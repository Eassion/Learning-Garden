---
title: 你都是vibe coding，怎么保证工程质量？
date: 2026-06-12
category: 大模型应用开发
tags:
  - skill
  - 插件
---

### 面试官问：“你都是Vibe Coding，怎么保证质量？”，我：“用OpenSpec、Superpowers、gstack把Vibe Coding 拉回到工程交付”

### 一、OpenSpec：先把需求变成规格

官方文档里强调几个点：

- 它是轻量级 spec-driven framework

- 支持 Claude Code、Cursor、Codex、GitHub Copilot 等工具

- 每次变更会产生 spec delta，方便审查需求变化

- specs 会和代码一起放在仓库里，作为长期上下文

它解决的是ai coding的第一步：需求太模糊，平时ad的时候总是喜欢给一句话想让它一下子实现自己想要的所有样子，但是大模型会尝试取悦你，需要你来告诉它详细的设计部分，你没有交代清楚，它就会去猜，但是会猜（语料库里积累了大量工程实践，总有相似的需求）不代表猜的对，所以做不对也是很正常的。

有人会想那我写一个详细的长prompt，每一步都详细介绍，但是prompt毕竟只会存在这一次session，下次新开个会话或者换一个人来开发就不知道当初为什么这么写，OpenSpec的价值就在这里，它可以把需求放进仓库，并且有一个详细的目录结构：

<img title="" src="file:///C:/Users/23738/AppData/Roaming/marktext/images/2026-06-12-16-44-46-image.png" alt="" width="347">

OpenSpec 的核心价值不是“帮我写计划”，而是把需求意图变成可版本管理、可审查、可复用的规格。它解决的是 AI 开发里最容易失控的上游问题：需求没定义清楚，Agent 就开始写代码。
