import { readFileSync } from "node:fs";

interface Config {
  sourceRoot: string;
  handlerRoot: string;
  output: string;
  tsconfig: string;
}

export function loadConfig(path: string) {
  let config: Config = {
    sourceRoot: "src",
    handlerRoot: "src/handlers",
    output: "dist",
    tsconfig: "tsconfig.json"
  };
  try {
    config = JSON.parse(readFileSync(path).toString());
  } catch {
    console.log('Failed to load config file, fall back to default.')
  }
  return config;
}
