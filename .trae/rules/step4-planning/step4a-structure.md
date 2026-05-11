# Step 4a: 页面结构设计 + 内容类型决策

> 输入：`step2-keywords.json` + `step3-competitive.json`
> 输出：`sop/roblox/runs/<slug>/step4a-structure.json`
> 下一步：step4b-assets-plan.md

## 前置条件

- Step 3 的 `finalVerdict` 是 go 或 caution
- 读取 `step2-keywords.json` 的 `finalPlan` 和 `step3-competitive.json` 的缺口分析

## 关键词 → URL 映射

- `primaryKeyword` → 首页（`/`）
- `pillarKeywords` → hub 页（如 `/codes`、`/calculator`、`/npcs`）
- `clusterKeywords` → cluster 页（如 `/npcs/gupta`、`/stats/strength`）

URL 命名：全小写，`-` 连接，含关键词但不堆砌。hub 用一级路径，cluster 用二级路径。

## 页面层级树

画出完整页面树，确保权重流向正确（cluster → hub → 首页）。

## 内链策略

每个页面的 Related Links 三层结构：
1. 第一位：父 hub 页
2. 第二位：同级 pillar 页
3. 第三位：首页或高流量页

铁律：hub 页必须先于 cluster 页建。

## 内容类型决策

按 Step 3 缺口分析决定每页类型：

| 类型 | 适用场景 | 优先级 |
|------|---------|--------|
| 工具页（计算器） | 有数值公式，玩家需要算 | 🔥 最高 |
| 工具页（数据库） | 大量物品/角色需要筛选 | 🔥 最高 |
| 工具页（交互地图） | 有地图探索、位置标注需求 | 🔥 最高 |
| hub 页 | 聚合同类 cluster 页 | ✅ 高 |
| 指南页 | 攻略、教程、how-to | ⚠️ 中（兜底） |
| codes 页 | 兑换码列表 | ⚠️ 中（红海兜底） |

核心原则：工具页优先 > 静态指南，codes 是兜底。

每页必备元素（EEAT）：至少 2 张图片 + 1 个 YouTube 嵌入 + 2 个权威外链 + FAQ section + Related Links + Structured Data

## 输出

落盘：`sop/roblox/runs/<slug>/step4a-structure.json`

```json
{
  "meta": { "step": "4a", "slug": "", "createdAt": "ISO-8601" },
  "siteStructure": {
    "homepage": { "url": "/", "primaryKeyword": "", "pageType": "homepage" },
    "pages": [
      {
        "url": "", "keyword": "",
        "pageType": "tool-calculator|tool-database|tool-map|hub|guide|codes",
        "parentHub": null,
        "relatedLinks": [],
        "priority": "P0|P1|P2"
      }
    ]
  },
  "buildOrder": {
    "batch1_hubs": [],
    "batch2_tools": [],
    "batch3_clusters": [],
    "batch4_guides": []
  },
  "internalLinking": {
    "strategy": "cluster → hub → homepage",
    "rules": ["每个 cluster 页 Related Links 第一位是父 hub", "首页链接所有 hub"]
  },
  "totalPages": 0
}
```

## 汇报

```
📋 <游戏名> Step4a 页面结构完成
页面总数：X 页（工具 X + hub X + cluster X + 指南 X）
建站顺序：Batch1(hub) → Batch2(工具) → Batch3(cluster) → Batch4(指南)
```

## 耗时预期
8-12 分钟。
