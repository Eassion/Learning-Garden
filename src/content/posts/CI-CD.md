---
title: CI/CD
date: 2026-07-13
category: 工程化
tags:
  - CI/CD
  - GitHub Actions
  - Docker
---

## 什么是 CI/CD？

CI/CD 是现代软件开发里很常见的一套自动化交付流程。

CI 是 Continuous Integration，也就是持续集成。它关注的是：代码提交之后，能不能自动完成依赖安装、测试、类型检查、构建等验证，尽早发现问题。

CD 可以理解成 Continuous Delivery 或 Continuous Deployment，也就是持续交付或持续部署。它关注的是：验证通过之后，能不能把代码自动发布到目标环境，减少人工登录服务器、手动执行命令带来的重复劳动和操作风险。

简单说，CI/CD 的目标不是让部署变得神秘，而是把平时手动做的一串步骤固定下来，让机器稳定、重复、可追踪地执行。

## 为什么需要 CI/CD？

在没有 CI/CD 的时候，我更新这个学习花园的大概流程是：

1. 本地新增或修改 Markdown 笔记
2. 提交代码并推送到 GitHub
3. 登录服务器
4. 拉取最新代码
5. 重新构建并启动 Docker 容器

这个流程本身不复杂，但是每次都要手动执行。只要次数多了，就容易出现一些小问题，比如忘记拉最新代码、忘记重新构建镜像、部署前没有跑测试，或者在服务器上输错命令。

CI/CD 适合解决的就是这种“步骤固定、重复频繁、最好不要靠人记忆”的事情。

## CI 和 CD 分别做什么？

### CI：先证明代码是健康的

CI 阶段通常会做这些事情：

- 拉取仓库代码
- 安装项目依赖
- 运行测试
- 执行类型检查
- 构建生产产物

以这个项目为例，它是一个 Vite + React + TypeScript 的静态站点。每次推送到主分支后，自动化流程会先执行：

```bash
npm ci
npm test
npm run build
```

`npm test` 可以检查内容解析、索引生成等逻辑是否正常，`npm run build` 可以确认 Markdown 笔记、图片资源、TypeScript 和 Vite 构建都能通过。

这一步的核心思想是：不要等部署到服务器之后才发现项目构建失败。

### CD：验证通过后再发布

CD 阶段发生在 CI 通过之后。它会连接到生产环境，执行维护者预先配置好的部署命令。

这个项目的部署方式是 Docker Compose。也就是说，服务器上会拉取最新代码，然后重新构建镜像并启动容器。

这里需要注意：生产服务器的地址、用户名、密码、部署目录等都不应该直接写在公开仓库里，而应该放到 GitHub Actions Secrets 这样的密钥管理工具里。仓库中的 workflow 只引用密钥名称，不暴露真实内容。

## GitHub Actions 是什么？

GitHub Actions 是 GitHub 提供的自动化工具。它可以在代码 push、PR、手动触发等事件发生时，按照仓库里的 workflow 文件执行任务。

workflow 文件一般放在：

```text
.github/workflows/
```

比如可以创建一个部署流程：

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

上面这段主要是 CI 部分：只要推送到 `main` 分支，就自动安装依赖、跑测试、执行构建。

如果后面再接上 SSH 部署步骤，就可以形成完整的 CI/CD。

## Secrets 为什么重要？

做 CI/CD 时，最容易犯的错误就是把敏感信息直接写进配置文件，比如：

- 服务器 IP
- 登录用户名
- 登录密码
- SSH 私钥
- 部署目录
- 数据库连接串

如果仓库是公开的，这些信息一旦提交，就等于暴露给所有人。即使仓库是私有的，也不建议把密码写进代码，因为 Git 历史记录很难彻底清理。

正确做法是把敏感信息放到 GitHub 仓库的 Secrets 里，然后在 workflow 中通过变量引用。

例如：

```yaml
host: ${{ secrets.SERVER_HOST }}
username: ${{ secrets.SERVER_USER }}
password: ${{ secrets.SERVER_PASSWORD }}
```

这样 workflow 文件可以公开保存，真正的值只存在 GitHub 的密钥管理系统里。

## CI/CD 带来的变化

配置好之后，日常写笔记的流程会变成：

1. 在本地新增 Markdown 笔记
2. 本地预览或构建确认没问题
3. 提交并推送到 GitHub
4. GitHub Actions 自动测试、构建、部署

也就是说，服务器上的重复操作被自动化流程接管了。对贡献者来说，只需要关注笔记内容和本地验证；对维护者来说，可以通过 Actions 日志查看每次部署是否成功。

这就是 CI/CD 的价值：不是为了显得流程高级，而是把交付过程变得稳定、可复现、可观察。

## 总结

CI/CD 可以理解成一条自动化流水线：

- CI 负责验证代码是否健康
- CD 负责把验证通过的代码发布出去
- Secrets 负责保护部署过程中需要用到的敏感信息
- Docker 负责让运行环境更稳定、更容易复现

对于个人博客、学习花园这类项目来说，CI/CD 的收益也很明显：以后新增一篇 Markdown 笔记，只要提交并推送，后面的测试、构建、部署就都可以自动完成。
