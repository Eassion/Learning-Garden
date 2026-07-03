---
title: Agent trace方法
date: 2026-06-30
category: 大模型应用开发
tags:
  - Agent
  - Trace
  - hook
---

核心问题是 agent 的调用链不是线性的，它是一棵树（或者图），单纯的日志流反而更难看清。需要把它升级成**结构化 Tracing**，而不只是 log。

核心思想：把每次 agent 执行视为一次分布式 trace

每个hook点要记录什么：LLM调用前、LLM调用后、Tool调用前、Tool调用后、循环/决策点
如果不想造轮子，可以直接接 [Langfuse](https://langfuse.com)（开源可自部署），它就是专门为 LLM agent 做的 tracing 平台，有完整的 trace/span UI，能直接看出每轮 LLM call 和 tool call 的树形结构，比自己写 log 可视化省很多事。
