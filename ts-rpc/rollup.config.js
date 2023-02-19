import typescript from "@rollup/plugin-typescript";

// CLI和本体分开构建，cli的顶部加上banner以保证能够作为脚本运行

// 为了能够正产产生声明文件，一共有四种构建配置:
// cli+esm
// cli+cjs
// index+esm
// index+cjs
const external = ["commander", "lodash", "chokidar", "tree-kill", /node:.+/];
/**
 * @type {import("rollup").RollupOptions}
 */
export default [
  {
    input: ["./src/cli.ts"],
    external,
    output: [
      {
        dir: "./libs/cjs/",
        format: "cjs",
        banner: "#!/usr/bin/env node",
        preserveModules: true,
        entryFileNames: "[name].cjs",
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
    external,
    output: [
      {
        dir: "./libs/esm/",
        format: "esm",
        banner: "#!/usr/bin/env node",
        preserveModules: true,
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
        preserveModules: true,
        entryFileNames: "[name].cjs",
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
        preserveModules: true,
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
