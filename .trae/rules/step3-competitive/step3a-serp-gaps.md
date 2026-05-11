# Step 3a: SERP 深度分析 + 功能性缺口扫描

> 输入：`sop/roblox/runs/<slug>/step2-keywords.json`
> 输出：`sop/roblox/runs/<slug>/step3a-serp-gaps.json`
> 下一步：step3b-verdict.md

## 前置条件

- Step 2 已完成，`step2-keywords.json` 存在
- `finalPlan.tierA` 至少有 3 个词

## SERP 深度分析

对每个 A 档关键词，用 agent-reach search 获取真实 SERP 数据（**不要用 browser 打 Google，headless Chrome 会被反爬返回 simulated SERP**）：

```bash
agent-reach search "<关键词>" -n 10 --json > /tmp/serp-<slug>.json
```

从 JSON 结果中提取并记录：rank / url / domain / siteType(大站/中站/新小站/老小站) / pageType(首页/内页/论坛帖/视频/工具页，根据 URL 路径深度判断) / contentType(静态文章/数据库/计算器/交互地图/视频/论坛) / quality(high/medium/low) / hasInteractive / gaps

SERP 特征（Featured Snippet / PAA / 视频轮播）：agent-reach 不返回这些，跳过或单独用 browser 抓一次 PAA 区块。

> 如遇 API 限流（429），等待 10 秒重试；3 次失败后停止并回报。

## 功能性缺口扫描

对 SERP 前 5 的每个竞品页面，用 `agent-reach read <url>` 读取内容，回答：

1. 它是静态文章还是交互工具？（静态 → ✅ 我们做工具就是降维打击）
2. 它的数据完整吗？（不全/过时 → ✅ 我们补全就是优势）
3. 它有没有交互功能？（没有 → ✅ 直接做）
4. 它的 SEO 基础设施怎么样？（没有 structured data / FAQ schema → ✅ 我们加上）

核心逻辑：大站（IGN/Fandom）只能写静态长文，做不了交互工具。我们的计算器/数据库/交互地图就是降维打击。

## 输出

落盘：`sop/roblox/runs/<slug>/step3a-serp-gaps.json`

```json
{
  "meta": { "step": "3a", "slug": "", "createdAt": "ISO-8601" },
  "serpAnalysis": [
    {
      "keyword": "",
      "tier": "A",
      "serpFeatures": {
        "featuredSnippet": null,
        "peopleAlsoAsk": [],
        "videoCarousel": false,
        "knowledgePanel": false
      },
      "results": [
        {
          "rank": 1, "url": "", "domain": "",
          "siteType": "大站|中站|新小站|老小站",
          "contentType": "静态文章|数据库|计算器|交互地图|视频|论坛",
          "quality": "high|medium|low",
          "hasInteractive": false,
          "gaps": []
        }
      ],
      "gapSummary": {
        "ourAdvantage": "",
        "difficultyRating": "easy|medium|hard",
        "recommendation": "go|caution|skip"
      }
    }
  ]
}
```

## 汇报

```
🔍 <游戏名> Step3a SERP+缺口分析完成
A 档词 X 个已分析
go: X / caution: X / skip: X
核心发现：<竞品最大缺口是什么>
```

## 耗时预期
10-15 分钟。每个词间隔 5 秒避免 Google 限流。
