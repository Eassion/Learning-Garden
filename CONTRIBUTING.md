# 提交笔记指南

感谢你愿意给 Learning Garden 添加笔记。这个项目把 Markdown 文件自动整理成博客、分类、标签、归档和学习热力图，所以提交一篇新笔记通常只需要新增一个 Markdown 文件，必要时再添加配图。

## 1. 准备本地环境

先把项目拉到本地，并安装依赖：

```bash
git clone https://github.com/Eassion/Learning-Garden.git
cd Learning-Garden
npm install
```

启动本地预览：

```bash
npm run dev
```

打开终端输出的 Vite 地址，确认页面可以正常访问。

## 2. 新建笔记文件

所有笔记都放在 `src/content/posts/` 目录下。新建一个 Markdown 文件，文件名会成为文章 slug，也就是页面地址的一部分。

例如：

```text
src/content/posts/spring-transaction.md
```

建议文件名使用小写英文、数字和短横线，避免空格和中文标点。

## 3. 编写 Frontmatter

每篇笔记顶部必须有 Frontmatter，用来生成标题、分类和标签。

模板：

```markdown
---
title: Spring 事务学习笔记
date: 2026-06-08
category: Java 后端
tags:
  - Spring
  - 事务
---

## 正文标题

这里写你的学习笔记内容。
```

字段说明：

| 字段 | 是否必填 | 说明 |
| --- | --- | --- |
| `title` | 必填 | 笔记标题，会显示在文章列表和详情页 |
| `date` | 必填 | 发布或整理日期，格式为 `YYYY-MM-DD` |
| `category` | 必填 | 主分类，每篇笔记只写一个 |
| `tags` | 可选 | 标签列表，可以写多个 |

## 4. 添加图片或附件

如果笔记需要图片，把图片放到 `public/notes/<文章slug>/` 目录下。

例如文章文件是：

```text
src/content/posts/spring-transaction.md
```

对应图片可以放在：

```text
public/notes/spring-transaction/transaction-flow.svg
```

Markdown 中用根路径引用：

```markdown
![Spring 事务流程图](/notes/spring-transaction/transaction-flow.svg)
```

提交前请确认图片文件名和引用路径一致。

## 5. 本地验证

提交前运行：

```bash
npm test
npm run build
```

如果只是新增普通 Markdown 笔记，也建议至少运行 `npm run build`，这样可以提前发现 Frontmatter 缺字段、日期格式或图片路径问题。

## 6. 提交 Pull Request

建议从新分支提交：

```bash
git checkout -b notes/add-spring-transaction
git add src/content/posts/spring-transaction.md
git commit -m "docs: add Spring transaction note"
git push origin notes/add-spring-transaction
```

然后在 GitHub 上创建 Pull Request。PR 描述里请说明：

- 新增或修改了哪篇笔记
- 主要分类和标签是什么
- 是否包含图片或其他静态资源
- 是否已经运行本地验证命令

## 7. Review 标准

一篇笔记合入前，需要满足：

- Markdown 可以正常渲染
- 必填 Frontmatter 字段完整
- 分类和标签清晰、不过度重复
- 图片路径正确，资源文件已一起提交
- 内容适合公开展示，不包含敏感信息
- `npm run build` 可以通过

如果不确定分类、标签或内容粒度，可以先提交 PR，在描述里说明想讨论的点。
