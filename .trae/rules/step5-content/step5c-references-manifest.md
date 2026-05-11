# Step 5c: 权威引用采集 + 汇总 Manifest

> 输入：step5a 数据 + step5b 素材 + step4-planning.json
> 输出：`step5-content/references.json` + `step5-content/step5-manifest.json`
> 下一步：Step 6（`~/.openclaw/skills/sitebuilder-step6-build/SKILL.md`）

## 前置条件

- Step 5a 和 5b 已完成

## 权威引用采集

为每个页面找 2-3 个权威来源（EEAT 信号）：

| 来源类型 | EEAT 信号 | 怎么找 |
|---------|----------|--------|
| Trello 看板 | Experience + Authoritativeness | Step 1 已采集的链接，找最相关卡片 |
| Discord 公告 | Authoritativeness | browser 打开 announcements 频道 |
| Reddit 讨论 | Trust（社区验证） | `site:reddit.com "<游戏名>" <关键词>` |
| Wiki 页面 | Expertise | Fandom/独立 Wiki 对应页面 |

质量标准：
- **high**：官方来源（Trello/Discord 公告/开发者回复）
- **medium**：社区验证（Reddit 高赞帖/Wiki）
- **low**：单一来源未验证

每页至少 1 个 high + 1 个 medium。

落盘：`step5-content/references.json`

## 汇总 Manifest

对 step4 采购清单的每一项逐个核对完成度，写入 manifest：

```json
{
  "meta": { "step": 5, "slug": "", "createdAt": "ISO-8601", "status": "complete|partial" },
  "pages": [
    {
      "slug": "",
      "completeness": {
        "data": "complete|partial|missing",
        "images": "complete|partial|missing",
        "videos": "complete|missing",
        "references": "complete|partial|missing"
      }
    }
  ],
  "overallCompleteness": "X%",
  "missingItems": []
}
```

缺失处理：
- 数据字段缺失 → 标 `unknown`，页面显示"数据待更新"
- 图片缺失 → placeholder，Step 6 生成占位图
- 视频找不到 → 嵌入游戏官方页面链接
- 引用不够 → 补充 Google 搜索媒体报道

落盘：`step5-content/step5-manifest.json`

## 汇报

```
📦 <游戏名> Step5 素材采集完成

整体完成度：X%
各页面：
- /calculator：✅数据 ✅图片 ✅视频 ✅引用
- /npcs：✅数据 ⚠️图片（缺2张）✅视频 ✅引用

缺失项：<具体缺什么>
素材已落盘：sop/roblox/runs/<slug>/step5-content/
请确认是否进入 Step 6？
```

## 耗时预期
8-12 分钟。
