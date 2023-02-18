const { exec } = require("child_process");

// 先构建db.js，获取最新的DataSource
// 然后drop&run相当于一次sync
// 然后生成migration，可以指定文件前缀
exec(
  `yarn build && yarn typeorm schema:drop && yarn typeorm migration:run && yarn typeorm migration:generate ./src/migrations/${
    process.argv[2] || "auto-migration"
  } && yarn build`
);
