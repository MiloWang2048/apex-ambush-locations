import typescript from "@rollup/plugin-typescript";

// CLI和本体分开构建，cli的顶部加上banner以保证能够作为脚本运行

export default [
  {
    input: ["./src/cli.ts"],
    external: ["commander", "lodash", "chokidar", /node:.+/],
    output: [
      {
        dir: "./libs/cjs/",
        format: "cjs",
        banner: "#!/usr/bin/env node",
      },
    ],
    plugins: [
      typescript({
        compilerOptions: { declaration: true },
        outDir: "libs/cjs",
      }),
    ],
  },
  {
    input: ["./src/cli.ts"],
    external: ["commander", "lodash", "chokidar", /node:.+/],
    output: [
      {
        dir: "./libs/esm/",
        format: "esm",
        banner: "#!/usr/bin/env node",
      },
    ],
    plugins: [
      typescript({
        compilerOptions: { declaration: true },
        outDir: "libs/esm",
      }),
    ],
  },
  {
    input: ["./src/index.ts"],
    output: [
      {
        dir: "./libs/cjs/",
        format: "cjs",
      },
    ],
    plugins: [
      typescript({
        compilerOptions: { declaration: true },
        outDir: "libs/cjs",
      }),
    ],
  },
  {
    input: ["./src/index.ts"],
    output: [
      {
        dir: "./libs/esm/",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        compilerOptions: { declaration: true },
        outDir: "libs/esm",
      }),
    ],
  },
];
