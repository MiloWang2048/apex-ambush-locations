#!/usr/bin/env node
'use strict';

var commander = require('commander');
var generate = require('./generate.cjs');
var _ = require('lodash');
var node_child_process = require('node:child_process');
var path = require('node:path');
var utils = require('./utils.cjs');
var chokidar = require('chokidar');

const program = new commander.Command();
program.name("ts-rpc").version("0.1.0").description("CLI for ts-rpc.");
program
    .command("generate")
    .alias("gen")
    .option("-c, --config <config-path>", "Path to ts-rpc config file", "ts-rpc.json")
    .description("Generate handler map and client ts files")
    .action(async (options) => {
    const config = utils.loadConfig(options.config);
    await generate.generate(config.sourceRoot, config.handlerRoot);
});
program
    .command("build")
    .option("-c, --config <config-path>", "Path to ts-rpc config file", "ts-rpc.json")
    .description("Build ts into js, both server and client.")
    .action(async (options) => {
    const config = utils.loadConfig(options.config);
    await generate.generate(config.sourceRoot, config.handlerRoot);
    const serverCompileProcess = node_child_process.exec(`tsc -p tsconfig.json --outDir ${config.output}/server`);
    const clientCompileProcess = node_child_process.exec(`tsc -p tsconfig.client.json --outDir ${config.output}/client`);
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
    const config = utils.loadConfig(options.config);
    await generate.generate(config.sourceRoot, config.handlerRoot);
    const debouncedGenerate = _.debounce(generate.generate, 500);
    chokidar.watch(config.handlerRoot).on("change", () => {
        debouncedGenerate(config.sourceRoot, config.handlerRoot);
    });
    const serverCompileProcess = node_child_process.exec(`tsc -p tsconfig.json --outDir ${config.output}/server --watch`);
    const clientCompileProcess = node_child_process.exec(`tsc -p tsconfig.client.json --outDir ${config.output}/client --watch --declaration`);
    await new Promise((resolve) => {
        setTimeout(resolve, 2500);
    });
    const cmd = `nodemon --watch ${config.output}/server --delay 500 ${path.join(config.output, "server", "server.js")}`;
    const nodemonProcess = node_child_process.exec(cmd);
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
