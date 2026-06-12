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

<img title="" src="file:///C:/Users/23738/AppData/Roaming/marktext/images/2026-06-12-16-44-46-image.png" alt="" width="272">

OpenSpec 的核心价值不是“帮我写计划”，而是把需求意图变成可版本管理、可审查、可复用的规格。它解决的是 AI 开发里最容易失控的上游问题：需求没定义清楚，Agent 就开始写代码。

### 二、Superpowers：让Agent按工程纪律执行

有了高质量文档之后，不代表agent就是一个听话规矩的孩子，能严格按照文档要求一步步做。。。如果能的话我觉得ai coding界又是一个很大的轰动

很多agent都有一个问题，就是太着急写代码，看起来很主动，实际上风险很大，这也就是为什么我们只使用codex或claude code是不太够的，而superpowers是先把流程变硬，再让agent在流程里发挥，比如TDD。AI当然会写测试，但一般都是代码写完之后再写测试，很容易变成证明题：证明刚刚自己写的代码是正确的。如果按 red/green TDD，就要先写失败测试，再写最小实现，再重构。这会逼 Agent 先明确行为预期，而不是直接堆实现。

**Superpowers 解决的不是模型能力问题，而是 Agent 开发纪律问题。它把澄清、设计确认、TDD、任务拆分、子 Agent 执行和 Review 变成默认流程，避免 Agent 一上来就写代码。**

### 三、gstack：把交付闭环补完整

真正的工程交付，不是“代码写完”和“跑通”，而是：

- 代码有没有被审查？

- 页面有没有真实跑过？

- 回归测试有没有补？

- 发布前检查有没有做？

- 这次踩过的坑有没有沉淀？

它官方页面把自己定义成一个 AI coding 的 delivery loop，而不是一堆 prompt。

gstack的流程大概是：
<img title="" src="file:///C:/Users/23738/AppData/Roaming/marktext/images/2026-06-12-18-07-02-image.png" alt="" width="316">

值得说的就是Browser QA。

很多AI代码“测试通过了”，但页面一打开就露馅，单靠单元测试，发现不了一些问题。

**gstack 的价值在交付闭环。它不是替代编码工具，而是把产品复盘、工程评审、代码 Review、浏览器 QA、Ship 和 Retro 串起来，防止 AI 写完代码后直接跳过验证和发布纪律。**

### 四、三件套怎么组合

完整链路可以这样理解：

**第一步，OpenSpec 把需求变成规格。**

先问清楚要做什么，边界是什么，验收标准是什么。

输出是 proposal、design、tasks、spec delta。

**第二步，Superpowers 按规格执行开发。**

先确认设计，再按任务拆分，尽量用 TDD，把复杂任务交给子 Agent 分段完成，最后做自检和 Review。

**第三步，gstack 做交付前后的闭环。**

用产品和工程视角压测计划，用 Review 找隐藏风险，用 Browser QA 跑真实流程，用 Ship 做发布检查，用 Retro 沉淀经验。
