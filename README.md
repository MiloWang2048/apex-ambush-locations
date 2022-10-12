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

- [ ] 地图
  - [x] 拖拽、缩放
  - [x] 地图菜单、切换地图
- [ ] 点位
  - [x] 点位标记
  - [ ] 缩放适应
  - [ ] 点位详情
    - [x] 点位详情支持markdown部分语法
    - [ ] 进入和退出的动画
  - [ ] 添加点位
  - [ ] 删除点位
- [ ] 辅助功能
  - [ ] 访问控制
    - [ ] 用户profile页面
    - [ ] 登录状态指示器
    - [ ] 登录、注册页面
    - [ ] 
  - [ ] 新增点位审核
  - [ ] 统一消息提示
