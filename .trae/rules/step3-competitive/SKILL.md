---
name: sitebuilder-step3-competitive
description: >
  建站 SOP 第三步：竞品分析与内容验证。当用户说"Step3"、"竞品分析"、
  "能不能打"、"SERP分析"时触发。消费 Step2 的关键词清单，对 A 档关键词
  做深度 SERP 分析，回答"我们能不能打赢？怎么打？"。
  适用于 Roblox / IO / Web Meme Game 等所有游戏站类型。
---

# Step 3: 竞品分析与内容验证（调度文件）

> 本 Step 拆分为 2 个子阶段，每个子阶段由独立子代理执行。

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 3a | `step3a-serp-gaps.md` | SERP 深度分析 + 功能性缺口扫描 | `step3a-serp-gaps.json` | 10-15 min |
| 3b | `step3b-verdict.md` | 域名检查 + 生命周期判断 + 最终判决 | `step3-competitive.json` | 8-12 min |

## 调度规则

1. 按 3a → 3b 顺序执行
2. 3a、3b 统一用 `ho`（hongmacc/claude-opus-4-6）
3. 3b 依赖 3a 的产出
4. **Step 3 完成后是关键卡点：必须等新爷确认 go/caution/abort**

## 数据流

```
step2-keywords.json
    ↓
[3a] → step3a-serp-gaps.json（SERP 分析 + 缺口）
    ↓
[3b] → step3-competitive.json（最终判决）
    ↓
新爷确认 → Step 4
```

## 下一步

- go → Step 4（内容规划）
- caution → 调整关键词后 Step 4
- abort → 停止建站
