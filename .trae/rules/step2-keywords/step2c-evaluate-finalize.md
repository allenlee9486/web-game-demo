# Step 2c: 评估入库 + 输出最终关键词清单

> 输入：`step2a-seeds-serp.json` + `step2b-expanded.json`
> 输出：`sop/roblox/runs/<slug>/step2-keywords.json`（最终报告）
> 下一步：Step 3（`~/.openclaw/skills/sitebuilder-step3-competitive/SKILL.md`）

## 前置条件

- Step 2a 和 2b 已完成
- 读取两个 JSON 合并候选词库

## Google Trends 批量验证

把候选词分批（每批 5 个）丢进 Google Trends：
- 地区：United States（或目标市场）
- 时间：Past 12 months

记录：
- 平均热度（Average）
- 趋势方向（上升/平稳/下降）
- 7 天对比（最近一周 vs 上周，判断短期动量）

判断标准：
- 平均热度 < 5 → ❌ 太小，除非是 Breakout
- 平均热度 5-10 → ⚠️ 可考虑，看竞争度
- 平均热度 > 10 → ✅ 值得做
- Related Queries 里出现 Breakout → 🔥 优先做

## 竞争度快速判断

对通过热度筛选的词，做两个快速检查：

**检查 1：allintitle 查询**
```
agent-reach search "allintitle:\"<关键词>\""
```
- < 1,000 → 竞争很小，直接做
- 1,000 - 10,000 → 竞争中等，看内容质量
- > 10,000 → 竞争大，需要差异化角度

**检查 2：SERP 前排分析**
- ≥ 5 个内页（/blog/ /tools/ /wiki/）→ ✅ 小站有机会
- ≥ 3 个大站首页（Fandom/IGN/GameRant）→ ❌ 太难
- 前排有过时/低质内容 → ✅ 可以打

## KDROI 评分（可选，有对标词时用）

当有同类型已知搜索量的对标词时：
```
估算搜索量 = 对标词月搜索量 × (目标词热度 / 对标词热度)
KDROI = (估算搜索量 × CPC) / KD
```

KDROI > 100 → 值得做 / KDROI > 500 → 优先做

## 最终筛选 & 分级

**🟢 A 档（必做）**：热度 > 10 + 竞争度 < 10K + 工具意图
**🟡 B 档（值得做）**：热度 5-10 + 竞争度中等，或热度高但竞争大
**🔴 C 档（观望）**：热度 < 5，或竞争度 > 100K

每档选出 Top 词：
- A 档：3-5 个 → 决定建站的页面结构
- B 档：5-8 个 → 后续扩展用
- C 档：记录但不立即行动

## 输出

落盘路径：`sop/roblox/runs/<slug>/step2-keywords.json`

```json
{
  "meta": {
    "step": 2,
    "slug": "",
    "createdAt": "ISO-8601",
    "status": "complete|partial",
    "totalCandidates": 0,
    "finalKeywords": 0
  },
  "seedKeywords": [],
  "competitors": [],
  "expandedKeywords": [],
  "evaluation": [
    {
      "keyword": "",
      "trendsAvg": 0,
      "trendDirection": "up|stable|down",
      "allintitle": 0,
      "serpDifficulty": "easy|medium|hard",
      "intent": "tool|info|transaction|navigation",
      "tier": "A|B|C",
      "kdroi": null,
      "note": ""
    }
  ],
  "finalPlan": {
    "tierA": [],
    "tierB": [],
    "tierC": [],
    "primaryKeyword": "首页核心词（只选 1 个）",
    "pillarKeywords": ["hub 页关键词"],
    "clusterKeywords": ["cluster 页关键词"]
  }
}
```

## 完成条件

1. ✅ `step2-keywords.json` 已落盘且 JSON 合法
2. ✅ A 档至少有 3 个词
3. ✅ `primaryKeyword` 已确定（首页核心词）
4. ✅ 每个 A 档词都有 Google Trends 验证数据
5. ✅ 至少扫了 3 个竞品站

## 汇报

```
🔍 <游戏名> Step2 关键词发现完成

候选词总数：X 个（Suggest X + YouTube X + 竞品 X + Related X）
最终筛选：A档 X 个 / B档 X 个 / C档 X 个

🟢 A 档（必做）：
1. <keyword> — 热度 X，竞争 X，意图：tool
2. ...

首页核心词：<primaryKeyword>
Hub 页关键词：<pillarKeywords>

⚠️ 关键发现：
- <Related Queries 里的爆发词>
- <竞品在做但我们没想到的词>

报告已落盘：sop/roblox/runs/<slug>/step2-keywords.json
```

## 耗时预期
8-12 分钟。Google Trends 和 allintitle 查询串行 + 间隔 3 秒。
