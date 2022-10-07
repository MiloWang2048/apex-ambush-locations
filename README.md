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

## 需求

- 地图
  - [x] 拖拽、缩放
  - [x] 地图菜单、切换地图
- 点位
  - [ ] 点位标记、缩放适应
  - [ ] 点位详情
  - [ ] 添加点位
  - [ ] 删除点位
