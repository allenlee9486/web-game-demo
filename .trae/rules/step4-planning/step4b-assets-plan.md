# Step 4b: 素材采购清单 + 输出规划文档

> 输入：`sop/roblox/runs/<slug>/step4a-structure.json`
> 输出：`sop/roblox/runs/<slug>/step4-planning.json`（最终报告）
> 下一步：Step 5（`~/.openclaw/skills/sitebuilder-step5-content/SKILL.md`）

## 前置条件

- Step 4a 已完成，`step4a-structure.json` 存在

## 素材采购清单

对每个页面，列出需要采集的 4 类素材：

### 结构化数据（JSON）
- 计算器页：数值公式 + 参数范围 + 默认值（来源：Trello > Wiki > YouTube > Reddit）
- 数据库页：完整属性表 + 分类标签（来源：Trello > Wiki 表格 > 游戏截图）
- 交互地图页：地图底图 + 标注点坐标（来源：Wiki 地图 > YouTube 探索视频）
- hub 页：从 cluster 页元数据聚合，无需额外采集
- 指南页：MDX 正文内容（来源：YouTube 教程 > Reddit > Wiki）

### 视觉素材
| 素材类型 | 用途 | 命名规则 |
|---------|------|---------|
| hero banner | 页面顶部大图 | `<slug>-hero.webp` |
| 元素缩略图 | 角色/物品图标 | `<element-name>.webp` |
| 地图底图 | 交互地图背景 | `<area-name>-map.webp` |
| 截图配图 | 正文插图 | `<context>-screenshot.webp` |

图片规格：webp 优先，hero 1200×630，缩略图 400×400

### YouTube 视频
每页 1-2 个相关视频。优先：官方频道 > 知名 YouTuber > 最近 3 个月 Shorts

### 权威引用（EEAT）
每页 2-3 个：Trello(high) / Discord 公告(high) / Reddit 讨论(medium) / Wiki(medium)

## 输出

合并 step4a 的结构 + 素材清单，写入最终规划文档。

落盘：`sop/roblox/runs/<slug>/step4-planning.json`

```json
{
  "meta": { "step": 4, "slug": "", "createdAt": "ISO-8601", "status": "complete" },
  "siteStructure": "...从 step4a 合并...",
  "buildOrder": "...从 step4a 合并...",
  "internalLinking": "...从 step4a 合并...",
  "pages": [
    {
      "url": "", "keyword": "", "pageType": "",
      "assets": {
        "data": { "type": "", "fields": [], "sources": [], "status": "pending" },
        "images": [{ "type": "hero", "filename": "", "source": "", "status": "pending" }],
        "videos": [{ "videoId": "", "title": "", "status": "pending" }],
        "references": [{ "type": "trello", "url": "", "status": "pending" }]
      }
    }
  ],
  "techStack": {
    "framework": "Next.js", "styling": "Tailwind CSS",
    "components": "shadcn/ui", "hosting": "Cloudflare Pages"
  },
  "totalPages": 0,
  "estimatedBuildTime": ""
}
```

## 汇报

```
📋 <游戏名> Step4 内容规划完成

页面总数：X 页
- 工具页：X（计算器 X + 数据库 X + 地图 X）
- hub 页：X / cluster 页：X / 指南页：X

素材采集风险：<某页面的数据可能不全>
预计建站耗时：X 小时

报告已落盘：sop/roblox/runs/<slug>/step4-planning.json
请确认是否进入 Step 5？
```

## 耗时预期
8-12 分钟。
