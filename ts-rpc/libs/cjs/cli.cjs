#!/usr/bin/env node
'use strict';

var commander = require('commander');
var generate = require('./generate.cjs');
var _ = require('lodash');
var node_child_process = require('node:child_process');
var path = require('node:path');
var utils = require('./utils.cjs');
var chokidar = require('chokidar');
var kill = require('tree-kill');

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
    .description("Watch file changes and generate & build & run.")
    .action(async (options) => {
    const config = utils.loadConfig(options.config);
    let appProcess = undefined;
    console.log(`[ts-rpc] Watching changes in ${config.sourceRoot}...`);
    const dev = async () => {
        const start = Date.now();
        // 生成
        console.log(`[ts-rpc] Generating...`);
        await generate.generate(config.sourceRoot, config.handlerRoot);
        // 构建服务端
        console.log(`[ts-rpc] Building server...`);
        const serverPromise = new Promise((resolve) => {
            const serverCompileProcess = node_child_process.exec(`tsc -p tsconfig.json --outDir ${config.output}/server`).on("close", resolve);
            serverCompileProcess.stdout?.pipe(process.stdout);
            serverCompileProcess.stderr?.pipe(process.stderr);
            serverCompileProcess.on("close", resolve);
        });
        // 构建客户端
        console.log(`[ts-rpc] Building client...`);
        const clientPromise = new Promise((resolve) => {
            const clientCompileProcess = node_child_process.exec(`tsc -p tsconfig.client.json --outDir ${config.output}/client --declaration`);
            clientCompileProcess.stdout?.pipe(process.stdout);
            clientCompileProcess.stderr?.pipe(process.stderr);
            clientCompileProcess.on("close", resolve);
        });
        await Promise.allSettled([serverPromise, clientPromise]);
        // 如果有app进程，kill
        if (appProcess) {
            console.log(`[ts-rpc] Killing previous app process...`);
            appProcess.stdout?.unpipe();
            appProcess.stderr?.unpipe();
            kill(appProcess.pid);
            await new Promise((resolve) => {
                appProcess?.on("exit", resolve);
            });
        }
        // 执行app
        console.log(`[ts-rpc] Starting app process...`);
        appProcess = node_child_process.exec(`node ${path.join(config.output, "server", "server.js")}`);
        appProcess.stdout?.pipe(process.stdout);
        appProcess.stderr?.pipe(process.stderr);
        console.log(`[ts-rpc] Took ${Date.now() - start}ms to emit.`);
        console.log(`[ts-rpc] Waiting for changes...`);
    };
    dev();
    chokidar
        .watch(config.handlerRoot)
        .on("change", _.throttle(dev, 2000, { leading: true }));
});
program.action(() => {
    program.help();
});
program.parse(process.argv);
