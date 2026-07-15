---
title: System Prompt、Few-shot、CoT在Prompt设计中分别解决什么问题？
date: 2026-07-15
category: 大模型应用开发
tags:
  - Prompt Engineering
---

| Prompt 技术                 | 解决的问题         | 核心思想                              |
| ------------------------- | ------------- | --------------------------------- |
| **System Prompt**         | 让模型"应该怎么回答"   | 定义角色、规则、边界                        |
| **Few-shot Prompt**       | 让模型"学会一种输出模式" | 给几个示例进行上下文学习（In-Context Learning） |
| **Chain of Thought（CoT）** | 让模型"怎么思考"     | 引导模型逐步推理                          |

其中CoT表示Chain of Thought，来自22年的一篇文章《Chain-of-Thought Prompting Elicits Reasoning in Large Language Models》，核心思想是告诉模型不要直接回答，先一步一步想。

举个例子，直接问：一个箱子有12个苹果。拿走3个。又放进去5个。现在几个？有时候模型会错

但是Prompt加一句：Let's think step by step.模型就会给出计算过程，正确率明显提升


