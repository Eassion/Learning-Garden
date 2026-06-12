# Learning Garden

一个使用 Vite + React + TypeScript 构建的静态个人学习花园。它把 Markdown 笔记自动整理成博客、分类归档、标签、时间归档、学习热力图和回看入口。

## 功能

- Markdown 笔记博客
- 每篇笔记一个主分类
- 分类学习地图
- 标签索引
- 按月份归档
- 最近 365 天学习热力图
- 随机复习按钮
- Now 页面
- 深色/浅色主题切换
- Docker + nginx 静态部署

## 本地开发

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址即可预览。

## 写一篇新笔记

在 `src/content/posts/` 新建 Markdown 文件，例如 `spring-transaction.md`：

```markdown
---
title: Spring 事务学习笔记
date: 2026-06-08
category: Java 后端
tags:
  - Spring
  - 事务
---

## 正文

这里写学习内容。
```

必填字段是 `title`、`date`、`category`。`tags` 可选。

如果你想给这个项目提交笔记，请先阅读 [提交笔记指南](./CONTRIBUTING.md)。

## 在笔记中放图片

在 Markdown 中直接插入图片即可，启动或构建前会自动扫描笔记里的本地图片引用，把图片复制到站点资源目录并生成可访问路径。

```markdown
![Spring 事务流程图](C:/Users/me/Pictures/transaction-flow.png)
```

也可以继续使用相对路径、外链图片或 `/` 开头的公共路径：

```markdown
![相对路径图片](./spring-transaction/transaction-flow.svg)
![外链图片](https://example.com/image.png)
```

运行 `npm run dev`、`npm run build` 或 `npm test` 时会自动执行图片同步。

## 构建

```bash
npm run build
npm run preview
```

## Docker 本地运行

```bash
docker compose up -d --build
```

访问 `http://localhost`。

停止容器：

```bash
docker compose down
```

## 服务器部署

1. 在服务器安装 Docker 和 Docker Compose。
2. 把项目代码上传到服务器。
3. 在项目目录运行：

```bash
docker compose up -d --build
```

4. 通过 `http://服务器IP` 访问。

第一版没有配置域名和 HTTPS。后续可以用 Caddy、Traefik 或 nginx + Certbot 增加域名和证书。

## 验证

```bash
npm test
npm run build
```
