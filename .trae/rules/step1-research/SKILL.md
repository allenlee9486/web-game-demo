---
name: sitebuilder-step1-research
description: >
  建站 SOP 第一步：游戏素材采集与研究。当用户说"启动建站"、"Step1"、
  "素材采集"、"研究这个游戏"时触发。负责收集游戏基础信息、官方源、
  截图、视频、社区情报，输出标准化研究报告供后续 Step 使用。
  适用于 Roblox / IO / Web Meme Game 等所有游戏站类型。
---

# Step 1: 素材采集与游戏研究（调度文件）

> 本 Step 拆分为 3 个子阶段，每个子阶段由独立子代理执行。
> 主 session 按顺序调度，每个子阶段完成后汇报并等新爷确认。

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 1a | `step1a-identity-sources.md` | 游戏身份确认 + 官方源锁定 | `step1a-identity-sources.json` | 5-8 min |
| 1b | `step1b-media-collection.md` | 截图/视频素材采集 | `media/` 文件夹 | 5-10 min |
| 1c | `step1c-mechanics-report.md` | 机制摸底 + 合并输出研究报告 | `step1-research.json` | 5-8 min |

## 调度规则

1. 按 1a → 1b → 1c 顺序执行
2. 每个子阶段派 1 个子代理（model: `hg`，hongmacc/claude-sonnet-4-6）
3. 子代理读取对应的子阶段 .md 文件作为指令
4. 1b 依赖 1a 的产出（需要 sources.youtube 和 identity.universeId）
5. 1c 依赖 1a + 1b 的产出（合并为最终报告）
6. 每个子阶段完成后汇报摘要，等新爷确认再启动下一个

## 数据流

```
用户输入（游戏名）
    ↓
[1a] → step1a-identity-sources.json
    ↓
[1b] → media/ 文件夹 + step1b-media.json
    ↓
[1c] → step1-research.json（最终合并报告）
    ↓
Step 2 消费 step1-research.json
```

## 完成条件

Step 1 整体完成的最低标准：
1. ✅ `step1-research.json` 已落盘且 JSON 合法
2. ✅ `identity` 所有必填字段有值（gameName / platform / genre）
3. ✅ `sources` 至少找到 2 个有效源
4. ✅ `media.screenshots` 至少 3 张图已下载
5. ✅ `mechanics.systems` 至少识别出 1 个数据结构
6. ✅ `recommendation.primaryTool` 已给出建议

## 下一步

Step 1 完成后，进入 **Step 2：关键词发现**。
读取 skill：`~/.openclaw/skills/sitebuilder-step2-keywords/SKILL.md`
