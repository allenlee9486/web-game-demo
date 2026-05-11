# Step 2b: 站找词 + Google Trends

> 输入：`sop/roblox/runs/<slug>/step2a-seeds-serp.json`
> 输出：`sop/roblox/runs/<slug>/step2b-expanded.json`
> 下一步：step2c-evaluate-finalize.md

## 前置条件

- Step 2a 已完成，`step2a-seeds-serp.json` 存在
- 读取该 JSON 获取 competitors 列表和候选词

## 阶段 3：站找词

### 竞品流量与关键词提取

对 step2a 中质量不高但有流量的站点，用 browser 打开流量分析工具：

**工具地址**：`https://sim.3ue.co/#/activation/home`

操作步骤：
1. `browser` 打开上述地址
2. 输入竞品域名查询
3. 记录：月访问量、Organic Search 占比、Top Organic Keywords

重点关注：
- **Organic Search 占比 > 50%** 的站 → SEO 驱动，词库有参考价值
- **月访问量 > 10K** 的站 → 说明这个赛道有真实流量

### 从竞品页面结构反推词

如果没有流量数据（小站/新站），直接看竞品的页面结构：

```
agent-reach read "https://competitor.com/sitemap.xml"
```

或者扫它的导航/侧边栏，看它做了哪些页面：
- `/calculator` → calculator 这个词有人做
- `/tier-list` → tier list 有需求
- `/values` → values/trading 有需求

竞品做了但我们没想到的页面类型 = 潜在关键词机会。

### Google Trends Related Queries

> ⚠️ **Google 检测自动化浏览器**，bb-browser 返回模拟 SERP。请用以下方案：

#### browser 工具方案（推荐）

```
browser 打开 https://trends.google.com/trends/explore?q=<关键词>&geo=US
```

然后用 `snapshot` 提取 Related Queries 数据。

#### agent-reach 方案（fallback）

```bash
agent-reach search "site:trends.google.com <关键词>"
```

重点看 **Rising** 类别：
- **Breakout**（+5000%）→ 🔥 爆发词，优先做
- **+100% 以上** → 上升趋势，值得做
- **+50% 以下** → 平稳，看竞争度再决定

## 输出

合并 step2a 的候选词 + 本阶段新发现的词，去重后写入：

落盘路径：`sop/roblox/runs/<slug>/step2b-expanded.json`

```json
{
  "meta": {
    "step": "2b",
    "slug": "",
    "createdAt": "ISO-8601"
  },
  "competitorAnalysis": [
    {
      "domain": "",
      "monthlyVisits": 0,
      "organicPercent": 0,
      "topKeywords": []
    }
  ],
  "expandedKeywords": [
    {
      "keyword": "",
      "source": "suggest|youtube|competitor|related_queries",
      "intent": "tool|info|transaction|navigation",
      "priority": "high|medium|low",
      "trendsNote": ""
    }
  ],
  "breakoutKeywords": []
}
```

## 汇报

```
🔍 <游戏名> Step2b 站找词完成
竞品分析：X 个站
新发现关键词：X 个
爆发词（Breakout）：X 个
扩展词库总计：X 个
```

## 耗时预期
8-12 分钟。Google Trends 查询间隔 3 秒避免 429。
