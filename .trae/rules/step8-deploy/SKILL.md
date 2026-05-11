---
name: sitebuilder-step8-deploy
description: >
  建站 SOP 第八步：部署上线（Cloudflare Pages）。将 Step7 验证通过的站点
  部署到 Cloudflare Pages，配置域名、提交 GSC、验证线上状态。
---

# Step 8: 部署上线（调度文件）

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 8a | `step8a-deploy-domain.md` | 代码推送 + CF Pages 部署 + 域名配置 | 线上可访问 | 15-30 min |
| 8b | `step8b-gsc-verify.md` | GSC 提交 + 线上验收 | 验收完成 | 15-30 min |

## 调度规则

1. 按 8a → 8b 顺序
2. 8a、8b 统一用 `ikgpt54`（ikuncode/gpt-5.4）
3. 8a 完成后确认站点可访问再启动 8b

## 完成

Step 8 完成 = 建站 SOP 全流程结束 🎉
