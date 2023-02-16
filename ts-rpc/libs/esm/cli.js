#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import path__default from 'node:path';
import _ from 'lodash';
import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';
import chokidar from 'chokidar';

/**
 * Scan handlers, get metadata
 * @param handlersRoot Root directory of rpc handlers
 * @returns Nested handler metadata
 */
async function scanHandlers(sourceRoot, handlersRoot) {
    const dir = await fs.opendir(handlersRoot);
    const res = [];
    const names = new Set();
    for await (const entity of dir) {
        if (names.has(entity.name)) {
            throw new Error(`Duplicated file name with a directory: "${entity.name}"`);
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
                    name: match[1],
                    path: "./" +
                        path
                            .relative(sourceRoot, entityPath)
                            .replace(/\\/g, "/")
                            .replace(/\.ts$/, ""),
                });
        }
        else if (entity.isDirectory()) {
            const match = entity.name.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)$/);
            if (!match) {
                continue;
            }
            res.push({
                name: match[1],
                children: await scanHandlers(sourceRoot, entityPath),
            });
        }
    }
    return res;
}
function flatHandlerMetadata(handlers, parentImports = [], namePrefix = "") {
    return parentImports.concat(handlers.flatMap((item) => item.path
        ? {
            importName: `${namePrefix}${item.name}`,
            importPath: item.path,
        }
        : flatHandlerMetadata(item.children ?? [], parentImports, `${namePrefix ? namePrefix + "_" : ""}${item.name}_`)));
}
function repeatIndent(times) {
    let res = "";
    for (let i = 0; i < times; i++) {
        res += "  ";
    }
    return res;
}
function generateClient(handlers, indent = 1, prefix = "") {
    const lines = [];
    const indentString = repeatIndent(indent);
    handlers.forEach((handler) => {
        if (handler.path) {
            lines.push(`${indentString}${handler.name}: generateClientHandler<typeof ${prefix}${handler.name}>("${prefix}${handler.name}", agent),`);
        }
        else {
            lines.push(`${indentString}${handler.name}: ${generateClient(handler.children ?? [], indent + 1, `${prefix ? prefix + "_" : ""}${handler.name}_`)}`);
        }
    });
    return `{
${lines.join("\n")}
${repeatIndent(indent - 1)}}${prefix ? "," : ";"}`;
}
async function generate(sourceRoot, handlersRoot) {
    console.log("[ts-rpc] Generating RPC server and client...");
    const res = await scanHandlers(sourceRoot, handlersRoot);
    const imports = flatHandlerMetadata(res);
    fs.writeFile(path.join(sourceRoot, "handlers.generated.ts"), `/**
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
`);
    fs.writeFile(path.join(sourceRoot, "client.generated.ts"), `/**
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
`);
}

function loadConfig(path) {
    console.log("path", path);
    let config = {
        sourceRoot: "src",
        handlerRoot: "src/handlers",
        output: "dist",
        tsconfig: "tsconfig.json"
    };
    try {
        config = JSON.parse(readFileSync(path).toString());
    }
    catch {
        console.log('Failed to load config file, fall back to default.');
    }
    return config;
}

const program = new Command();
program.name("ts-rpc").version("0.1.0").description("CLI for ts-rpc.");
program
    .command("generate")
    .alias("gen")
    .option("-c, --config <config-path>", "Path to ts-rpc config file", "ts-rpc.json")
    .description("Generate handler map and client ts files")
    .action(async (options) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
});
program
    .command("build")
    .option("-c, --config <config-path>", "Path to ts-rpc config file", "ts-rpc.json")
    .description("Build ts into js, both server and client.")
    .action(async (options) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
    const serverCompileProcess = exec(`tsc -p tsconfig.json --outDir ${config.output}/server`);
    const clientCompileProcess = exec(`tsc -p tsconfig.client.json --outDir ${config.output}/client`);
    serverCompileProcess.stdout?.pipe(process.stdout);
    serverCompileProcess.stderr?.pipe(process.stderr);
    serverCompileProcess.stdout?.on("end", () => {
        clientCompileProcess.stdout?.pipe(process.stdout);
    });
    serverCompileProcess.stderr?.on("end", () => {
        clientCompileProcess.stderr?.pipe(process.stderr);
    });
});
program
    .command("dev")
    .option("-c, --config <config-path>", "Path to ts-rpc config file", "ts-rpc.json")
    .description('Watch file changes and generate & build & run.')
    .action(async (options) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
    const debouncedGenerate = _.debounce(generate, 500);
    chokidar.watch(config.handlerRoot).on("all", () => {
        debouncedGenerate(config.sourceRoot, config.handlerRoot);
    });
    const serverCompileProcess = exec(`tsc -p tsconfig.json --outDir ${config.output}/server --watch`);
    const clientCompileProcess = exec(`tsc -p tsconfig.client.json --outDir ${config.output}/client --watch --declaration`);
    await new Promise((resolve) => {
        setTimeout(resolve, 2500);
    });
    const cmd = `nodemon --watch ${config.output}/server --delay 500 ${path__default.join(config.output, "server", "server.js")}`;
    const nodemonProcess = exec(cmd);
    serverCompileProcess.stdout?.pipe(process.stdout);
    serverCompileProcess.stderr?.pipe(process.stderr);
    clientCompileProcess.stdout?.pipe(process.stdout);
    clientCompileProcess.stderr?.pipe(process.stderr);
    if (nodemonProcess.stdin) {
        process.stdin.pipe(nodemonProcess.stdin);
    }
    nodemonProcess.stdout?.pipe(process.stdout);
    nodemonProcess.stderr?.pipe(process.stderr);
    console.log(`[ts-rpc] Watching changes in ${config.sourceRoot}...`);
});
program.action(() => {
    program.help();
});
program.parse(process.argv);
