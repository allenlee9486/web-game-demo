---
name: sitebuilder-step4-planning
description: >
  建站 SOP 第四步：内容规划与页面结构设计。当用户说"Step4"、"内容规划"、
  "页面结构"、"建什么页面"时触发。消费 Step2 关键词 + Step3 竞品报告，
  产出完整的页面蓝图和素材采购清单。
---

# Step 4: 内容规划与页面结构设计（调度文件）

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 4a | `step4a-structure.md` | 页面结构设计 + 内容类型决策 | `step4a-structure.json` | 8-12 min |
| 4b | `step4b-assets-plan.md` | 素材采购清单 + 输出规划文档 | `step4-planning.json` | 8-12 min |

## 调度规则

1. 按 4a → 4b 顺序执行
2. 4a、4b 统一用 `ho`（hongmacc/claude-opus-4-6）
3. 4b 依赖 4a 的页面结构
4. **Step 4 完成后是卡点：等新爷确认规划方案**

## 下一步

新爷确认后 → Step 5（素材采集）
