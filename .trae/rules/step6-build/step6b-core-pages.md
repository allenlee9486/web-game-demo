# Step 6b: 核心页面构建（P0 工具页 + Hub 页）

> 输入：step4-planning.json 的 batch1_hubs + batch2_tools
> 输出：所有 hub 页 + 工具页代码
> 下一步：step6c-remaining-pages.md

## 前置条件

- Step 6a 已完成，项目骨架可运行

## 建站顺序（铁律）

1. **先建所有 hub 页**（Batch 1）
2. **再建工具页**（Batch 2）

hub 必须先于 cluster 建，cluster 的 Related Links 第一位必须指向已存在的父 hub。

## 每页标准结构

```tsx
// 1. Metadata
export const metadata: Metadata = {
  title: "<50-60字符，含关键词>",
  description: "<150-160字符>",
  alternates: { canonical: "<完整 URL>" },
}

// 2. 页面内容
export default function Page() {
  return (
    <>
      {/* Hero Section */}
      {/* 主要内容（工具/列表） */}
      {/* YouTube 嵌入 */}
      <YouTubeEmbed videoId="xxx" title="xxx" />
      {/* FAQ + JSON-LD */}
      <FAQ items={faqData} />
      {/* Related Links（三层内链） */}
      <RelatedLinks links={relatedLinks} />
    </>
  )
}
```

## 页面类型模板

**工具页（计算器）**：`"use client"` + 从 data JSON 读公式 + shadcn Input/Slider/Card
**工具页（数据库）**：`"use client"` + 搜索框 + 分类筛选 + 卡片/表格
**工具页（交互地图）**：`"use client"` + Canvas/SVG 底图 + 可点击标注点
**Hub 页**：服务端组件 + 子页面列表（缩略图+标题+简介+链接）

每页必须有：至少 2 张图片 + 1 个 YouTube 嵌入 + FAQ + Related Links

## 禁止事项

- ❌ 不要硬编码 GA/Adsense ID（用 site.config.ts）
- ❌ 不要用 `minHeight: 100vh` 在嵌入组件上
- ❌ 不要在 metadata 里用 `meta keywords`

## 汇报

```
🏗️ Step6b 核心页面完成
- Hub 页：X 个
- 工具页：X 个（计算器 X + 数据库 X + 地图 X）
- 每页已含图片/视频/FAQ/Related Links
```

## 耗时预期
15-30 分钟（取决于页面数量和工具复杂度）。
