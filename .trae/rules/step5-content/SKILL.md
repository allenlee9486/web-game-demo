---
name: sitebuilder-step5-content
description: >
  建站 SOP 第五步：素材采集与数据生产。消费 Step4 的素材采购清单，
  逐项采集结构化数据、视觉素材、YouTube 视频、权威引用。
---

# Step 5: 素材采集与数据生产（调度文件）

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 5a | `step5a-data.md` | 结构化数据采集（JSON） | `step5-content/data/` | 10-20 min |
| 5b | `step5b-media-videos.md` | 视觉素材 + YouTube 视频 | `step5-content/images/` + `videos.json` | 10-15 min |
| 5c | `step5c-references-manifest.md` | 权威引用 + 汇总 Manifest | `references.json` + `step5-manifest.json` | 8-12 min |

## 调度规则

1. 5a 和 5b 可以并行（互不依赖）
2. 5a 用 `ikgpt54`（ikuncode/gpt-5.4）
3. 5b 用 `hg`（hongmacc/claude-sonnet-4-6）
4. 5c 用 `ikgpt54`，依赖 5a + 5b 完成后汇总
5. **Step 5 完成后等新爷确认再进 Step 6**

## 下一步

新爷确认后 → Step 6（站点构建）
