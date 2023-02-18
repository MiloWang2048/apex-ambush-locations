#!/usr/bin/env node

import { Command } from "commander";
import { generate } from "./generate.js";
import fs from "node:fs/promises";
import _ from "lodash";
import { exec } from "node:child_process";
import path from "node:path";
import { loadConfig } from "./utils";
import chokidar from "chokidar";

const program = new Command();

program.name("ts-rpc").version("0.1.0").description("CLI for ts-rpc.");

program
  .command("generate")
  .alias("gen")
  .option(
    "-c, --config <config-path>",
    "Path to ts-rpc config file",
    "ts-rpc.json"
  )
  .description("Generate handler map and client ts files")
  .action(async (options: { config: string }) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
  });

program
  .command("build")
  .option(
    "-c, --config <config-path>",
    "Path to ts-rpc config file",
    "ts-rpc.json"
  )
  .description("Build ts into js, both server and client.")
  .action(async (options: { config: string }) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
    const serverCompileProcess = exec(
      `tsc -p tsconfig.json --outDir ${config.output}/server`
    );
    const clientCompileProcess = exec(
      `tsc -p tsconfig.client.json --outDir ${config.output}/client`
    );
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
  .option(
    "-c, --config <config-path>",
    "Path to ts-rpc config file",
    "ts-rpc.json"
  )
  .description('Watch file changes and generate & build & run.')
  .action(async (options: { config: string }) => {
    const config = loadConfig(options.config);
    await generate(config.sourceRoot, config.handlerRoot);
    const debouncedGenerate = _.debounce(generate, 500);
    chokidar.watch(config.handlerRoot).on("change", () => {
      debouncedGenerate(config.sourceRoot, config.handlerRoot);
    });
    const serverCompileProcess = exec(
      `tsc -p tsconfig.json --outDir ${config.output}/server --watch`
    );
    const clientCompileProcess = exec(
      `tsc -p tsconfig.client.json --outDir ${config.output}/client --watch --declaration`
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 2500);
    });
    const cmd = `nodemon --watch ${
      config.output
    }/server --delay 500 ${path.join(config.output, "server", "server.js")}`;
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
