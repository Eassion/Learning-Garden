---
title: token和字符的区别，为什么要关注token

date: 2026-06-11

category: 大模型应用开发

tags:

  - 大模型

summary: 解释一下token



---

## 问题

token和字符的区别，为什么要关注token

token不是简单等于一个字或一个字符，它是模型真正处理文本的最小计费和推理单位。中文里一个字可能是一个token，英文单词可能被切成多个token。工程上关注token是因为它直接影响上下文长度、调用成本和响应延迟。


