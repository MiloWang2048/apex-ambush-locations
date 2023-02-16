# ts-rpc

- 可以根据handlers生成handlerMap
- 提供一个express中间件生成器，接受handlerMap，生成一个中间件，用以处理rpc
- 命令
  - gen：生成client和server的ts文件
  - build：编译client和server
  - dev：监听改动并生成、编译client和server
- 参数
  - -c --config：指定配置文件，默认为ts-rpc.json
  - -o --out-dir：指定构建输出目录
  - -s --src：指定生成目录
  - -h --handler-root：指定handler目录
  - 