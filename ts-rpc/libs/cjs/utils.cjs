#!/usr/bin/env node
'use strict';

var node_fs = require('node:fs');

function loadConfig(path) {
    console.log("path", path);
    let config = {
        sourceRoot: "src",
        handlerRoot: "src/handlers",
        output: "dist",
        tsconfig: "tsconfig.json"
    };
    try {
        config = JSON.parse(node_fs.readFileSync(path).toString());
    }
    catch {
        console.log('Failed to load config file, fall back to default.');
    }
    return config;
}

exports.loadConfig = loadConfig;
