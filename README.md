# Apex 大佐点位图

## Getting started

### 前置条件

配置 TCB 环境：TBD

### 使用 GitPod

[![](https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/MiloWang2048/apex-ambush-locations)

### 本地开发

```sh
git clone https://github.com/MiloWang2048/apex-ambush-locations.git
cd apex-ambush-locations
cp .env.local.example .env.local
```

编辑`.env.local`，写入正确的 tcb 环境标识和地区标识，然后

```sh
npm i
npm run dev
```

## Todos

- 地图
  - [x] 拖拽、缩放
  - [x] 地图菜单、切换地图
- 点位
  - [x] 点位标记
  - [ ] 点位缩放适应
  - [ ] 点位详情
    - [x] 点位详情支持markdown部分语法
  - [x] 添加点位
  - [ ] 删除点位
  - [ ] 编辑点位
- 其他功能
  - [ ] 访问控制
    - [ ] 用户profile页面
      - [x] 登出
      - [ ] 我标记的点位
    - [x] 登录状态指示器
    - [x] 登录、注册
  - [ ] 内容审核机制
  - [x] 统一消息提示
  - [x] 404页面
- 动画
  - TBD
- 其他
  - [ ] 修改校验发件邮箱账户
  - [ ] 前端错误监控
  - [ ] 评论
  - [ ] 点赞
  - [ ] 收藏
  - [ ] 内嵌b站播放器
  - [ ] 操作提示和图例



