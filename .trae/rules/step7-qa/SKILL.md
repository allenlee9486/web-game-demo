---
name: sitebuilder-step7-qa
description: >
  建站 SOP 第七步：质量验证。去 AI 味、On-Page SEO、支柱模型、截图验收。
  Step7 未通过不准进入 Step8。
---

# Step 7: 质量验证（调度文件）

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 7a | `step7a-humanizer-seo.md` | 去 AI 味 + On-Page SEO 审计 | 审计报告 + 修复代码 | 15-25 min |
| 7b | `step7b-pillar-screenshots.md` | 支柱模型验证 + 截图验收 | 验收报告 | 15-25 min |

## 调度规则

1. 按 7a → 7b 顺序（7a 修复后 7b 才能验收）
2. 7a 用 `ho`（hongmacc/claude-opus-4-6）
3. 7b 用 `ikgpt54`（ikuncode/gpt-5.4）
4. **Step 7 是铁门：四项全过才能进 Step 8**
   - humanizer P0 清零
   - On-Page SEO 平均 ≥85
   - 支柱模型无蚕食无孤儿页
   - 截图验收通过

## 下一步

全部通过 → Step 8（部署上线）
