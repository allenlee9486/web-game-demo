---
name: sitebuilder-step2-keywords
description: >
  建站 SOP 第二步：关键词发现与搜索量验证。当用户说"Step2"、"找关键词"、
  "关键词发现"、"选词"时触发。消费 Step1 的研究报告，用找词飞轮方法论
  （词根→词找站→站找词→评估入库）发现并验证关键词。
  适用于 Roblox / IO / Web Meme Game 等所有游戏站类型。
---

# Step 2: 关键词发现与搜索量验证（调度文件）

> 本 Step 拆分为 3 个子阶段，每个子阶段由独立子代理执行。
> 主 session 按顺序调度，每个子阶段完成后汇报并等新爷确认。

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 2a | `step2a-seeds-serp.md` | 设定词根 + 词找站（SERP + YouTube + Suggest） | `step2a-seeds-serp.json` | 8-12 min |
| 2b | `step2b-competitor-mining.md` | 站找词 + Google Trends Related Queries | `step2b-expanded.json` | 8-12 min |
| 2c | `step2c-evaluate-finalize.md` | 评估入库 + 输出最终关键词清单 | `step2-keywords.json` | 8-12 min |

## 调度规则

1. 按 2a → 2b → 2c 顺序执行
2. 2a、2b 默认用 `ikgpt54`（ikuncode/gpt-5.4）
3. 2c 直接默认用 `ho`（hongmacc/claude-opus-4-6）做最终收口和拍板
4. 子代理读取对应的子阶段 .md 文件作为指令
5. 2a 依赖 Step 1 的 `step1-research.json`
6. 2b 依赖 2a 的产出（竞品列表 + 候选词）
7. 2c 依赖 2a + 2b 的产出（合并为最终关键词清单）
8. 每个子阶段完成后汇报摘要，等新爷确认再启动下一个

## 数据流

```
step1-research.json
    ↓
[2a] → step2a-seeds-serp.json（词根 + SERP + 长尾词）
    ↓
[2b] → step2b-expanded.json（竞品分析 + 扩展词库）
    ↓
[2c] → step2-keywords.json（最终评估 + 分级清单）
    ↓
Step 3 消费 step2-keywords.json
```

## 完成条件

1. ✅ `step2-keywords.json` 已落盘且 JSON 合法
2. ✅ A 档至少有 3 个词
3. ✅ `primaryKeyword` 已确定（首页核心词）
4. ✅ 每个 A 档词都有 Google Trends 验证数据
5. ✅ 至少扫了 3 个竞品站

## 下一步

Step 2 完成后，进入 **Step 3：竞品分析与内容验证**。
读取 skill：`~/.openclaw/skills/sitebuilder-step3-competitive/SKILL.md`
