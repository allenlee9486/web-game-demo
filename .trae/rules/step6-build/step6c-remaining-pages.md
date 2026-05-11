# Step 6c: 剩余页面（Cluster + 指南 + Codes）

> 输入：step4-planning.json 的 batch3_clusters + batch4_guides
> 输出：所有 cluster 页 + 指南页 + codes 页代码
> 下一步：step6d-seo-verify.md

## 前置条件

- Step 6b 已完成，hub 页和工具页已存在

## Cluster 页（Batch 3）

- 动态路由：`src/app/<hub>/[slug]/page.tsx`
- 每页从对应 data JSON 读取单条记录
- Related Links 第一位必须是父 hub（已在 6b 建好）
- 每页：独立 metadata + 2 张图片 + 1 个视频 + FAQ + Related Links

## 指南页（Batch 4）

- 服务端组件，MDX 或 TSX 长文
- H2/H3 结构化标题（含关键词）
- 图文混排
- 每页同样需要完整的 EEAT 元素

## Codes 页（如有）

- `"use client"`（Copy 按钮需要交互）
- 兑换码卡片：码 + 奖励 + 状态（Active/Expired）+ Copy 按钮
- 最后更新时间显示

## 汇报

```
🏗️ Step6c 剩余页面完成
- Cluster 页：X 个
- 指南页：X 个
- Codes 页：X 个
- 全部页面已含标准 EEAT 元素
```

## 耗时预期
10-20 分钟。
