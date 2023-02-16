interface Config {
    sourceRoot: string;
    handlerRoot: string;
    output: string;
    tsconfig: string;
}
export declare function loadConfig(path: string): Config;
export {};
