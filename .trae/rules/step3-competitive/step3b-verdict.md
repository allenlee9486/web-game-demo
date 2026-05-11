# Step 3b: 域名检查 + 生命周期判断 + 输出竞品报告

> 输入：`sop/roblox/runs/<slug>/step3a-serp-gaps.json`
> 输出：`sop/roblox/runs/<slug>/step3-competitive.json`（最终报告）
> 下一步：Step 4（`~/.openclaw/skills/sitebuilder-step4-planning/SKILL.md`）

## 前置条件

- Step 3a 已完成，`step3a-serp-gaps.json` 存在

## 域名注册时间检查

对 step3a 中识别出的所有小站（exact-match 域名），查注册时间：

```bash
whois <domain> | grep -i "creation date"
```

或 browser 打开 `https://who.is/whois/<domain>`

竞争窗口判断：
- < 2 周 → ✅ 窗口还开着，加速建站
- 2-4 周 → ⚠️ 窗口快关了，需要内容质量碾压
- > 1 个月 → ❌ 窗口已关，先发优势+索引积累难打
- 没有小站排进前 10 → 🔥 蓝海

## 游戏生命周期判断

结合 Google Trends 数据和 SERP 竞争情况：
- **起步期**（趋势刚起来，SERP 几乎没有专站）→ 🔥 最佳入场
- **爆发期**（趋势高位，已有 2-3 个小站）→ ✅ 还能进，但要快
- **平台期**（趋势平稳，小站已站稳）→ ⚠️ 需要差异化
- **衰退期**（趋势下降）→ ❌ 不建议进

## 最终判决

综合 step3a 的缺口分析 + 域名检查 + 生命周期：

- **go**：至少 3 个 A 档词 recommendation 是 go，游戏处于起步/爆发期
- **caution**：部分词能打但需要差异化
- **abort**：所有词都是 skip，或游戏已衰退

> ⚠️ abort 决策必须向新爷汇报并等确认，不能自己默默放弃。

## 输出

落盘：`sop/roblox/runs/<slug>/step3-competitive.json`

```json
{
  "meta": { "step": 3, "slug": "", "createdAt": "ISO-8601", "status": "complete|partial" },
  "serpAnalysis": "...从 step3a 合并...",
  "domainChecks": [
    { "domain": "", "registrationDate": "ISO-8601", "ageWeeks": 0, "windowStatus": "open|closing|closed" }
  ],
  "gameLifecycle": "起步|爆发|平台|衰退",
  "finalVerdict": {
    "goKeywords": [],
    "cautionKeywords": [],
    "skipKeywords": [],
    "overallRecommendation": "go|caution|abort",
    "reason": ""
  }
}
```

## 汇报

```
🔍 <游戏名> Step3 竞品分析完成

游戏阶段：<起步/爆发/平台/衰退>
竞争窗口：<开/快关/已关>

A 档词：
1. <keyword> → <go/caution/skip>（原因）

🏆 降维打击点：<工具型差异化优势>
⚠️ 风险点：<已有老小站站稳的词>

最终建议：<go/caution/abort>
报告已落盘：sop/roblox/runs/<slug>/step3-competitive.json
```

## 耗时预期
8-12 分钟。
