#!/usr/bin/env node
import { readFileSync } from 'node:fs';

function loadConfig(path) {
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

export { loadConfig };
