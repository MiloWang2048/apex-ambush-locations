import * as fs from "node:fs/promises";
import * as path from "node:path";

interface HandlerMetadata
  extends Array<{
    name: string;
    path?: string;
    children?: HandlerMetadata;
  }> {}

interface FlattenedHandlerMetadata
  extends Array<{ importName: string; importPath: string }> {}

/**
 * Scan handlers, get metadata
 * @param handlersRoot Root directory of rpc handlers
 * @returns Nested handler metadata
 */
async function scanHandlers(sourceRoot: string, handlersRoot: string) {
  const dir = await fs.opendir(handlersRoot);
  const res: HandlerMetadata = [];
  const names = new Set<string>();
  for await (const entity of dir) {
    if (names.has(entity.name)) {
      throw new Error(
        `Duplicated file name with a directory: "${entity.name}"`
      );
    }
    names.add(entity.name);
    const entityPath = path.join(handlersRoot, entity.name);
    if (entity.isFile()) {
      const match = entity.name.match(/^([a-zA-Z][a-zA-Z0-9]*)\.ts$/);
      if (!match) {
        continue;
      }
      const source = (await fs.readFile(entityPath)).toString();
      if (source.match(/export\s+default/))
        res.push({
          name: match[1]!,
          path:
            "./" +
            path
              .relative(sourceRoot, entityPath)
              .replace(/\\/g, "/")
              .replace(/\.ts$/, ""),
        });
    } else if (entity.isDirectory()) {
      const match = entity.name.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
      if (!match) {
        continue;
      }
      res.push({
        name: match[1]!,
        children: await scanHandlers(sourceRoot, entityPath),
      });
    }
  }
  return res;
}

function flatHandlerMetadata(
  handlers: HandlerMetadata,
  parentImports: FlattenedHandlerMetadata = [],
  namePrefix = ""
): FlattenedHandlerMetadata {
  return parentImports.concat(
    handlers.flatMap((item) =>
      item.path
        ? {
            importName: `${namePrefix}${item.name}`,
            importPath: item.path,
          }
        : flatHandlerMetadata(
            item.children ?? [],
            parentImports,
            `${namePrefix ? namePrefix + "_" : ""}${item.name}_`
          )
    )
  );
}

function repeatIndent(times: number) {
  let res = "";
  for (let i = 0; i < times; i++) {
    res += "  ";
  }
  return res;
}

function generateClient(handlers: HandlerMetadata, indent = 1, prefix = "") {
  const lines: string[] = [];
  const indentString = repeatIndent(indent);
  handlers.forEach((handler) => {
    if (handler.path) {
      lines.push(
        `${indentString}${handler.name}: generateClientHandler<typeof ${prefix}${handler.name}>("${prefix}${handler.name}", agent),`
      );
    } else {
      lines.push(
        `${indentString}${handler.name}: ${generateClient(
          handler.children ?? [],
          indent + 1,
          `${prefix ? prefix + "_" : ""}${handler.name}_`
        )}`
      );
    }
  });
  return `{
${lines.join("\n")}
${repeatIndent(indent - 1)}}${prefix ? "," : ";"}`;
}

export async function generate(sourceRoot: string, handlersRoot: string) {
  console.log("[ts-rpc] Generating RPC server and client...");
  const res = await scanHandlers(sourceRoot, handlersRoot);
  const imports = flatHandlerMetadata(res);
  fs.writeFile(
    path.join(sourceRoot, "handlers.generated.ts"),
    `/**
 * This file is generated and should NOT be modified manually.
 */

import { HandlerMap } from "ts-rpc";

${imports
  .map((i) => `import ${i.importName} from "${i.importPath}";`)
  .join("\n")}

const handlers: HandlerMap = {
${imports.map((i) => `  ${i.importName},`).join("\n")}
}

export default handlers;
`
  );
  fs.writeFile(
    path.join(sourceRoot, "client.generated.ts"),
    `/**
 * This file is generated and should NOT be modified manually.
 */

import axios, { type AxiosInstance } from "axios";
import { generateClientHandler } from "ts-rpc";

${imports
  .map((i) => `import type ${i.importName} from "${i.importPath}";`)
  .join("\n")}

let agent = axios.create({
  baseURL: "http://localhost:3000",
});

export function setAgent(_agent: AxiosInstance) {
  agent = _agent;
}


export default ${generateClient(res)}
`
  );
}
