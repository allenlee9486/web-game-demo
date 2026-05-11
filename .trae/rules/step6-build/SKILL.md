---
name: sitebuilder-step6-build
description: >
  建站 SOP 第六步：站点构建（代码实现）。消费 Step4 页面规划 + Step5 素材数据，
  用 Next.js + Tailwind + shadcn/ui 构建完整站点。
---

# Step 6: 站点构建（调度文件）

## 子阶段

| 阶段 | 文件 | 任务 | 产出 | 预估耗时 |
|------|------|------|------|----------|
| 6a | `step6a-init-homepage.md` | 项目初始化 + 首页 + 布局 | 项目骨架 + 首页 | 10-15 min |
| 6b | `step6b-core-pages.md` | 核心页面（Hub + 工具页） | P0 页面代码 | 15-30 min |
| 6c | `step6c-remaining-pages.md` | 剩余页面（Cluster + 指南 + Codes） | P1/P2 页面代码 | 10-20 min |
| 6d | `step6d-seo-verify.md` | SEO 基础设施 + Build 验证 | build 通过 | 8-12 min |

## 调度规则

1. 严格按 6a → 6b → 6c → 6d 顺序
2. Step 6 统一用 `ho`（hongmacc/claude-opus-4-6），并直接拉起 **Claude Code CLI / ACP** 处理代码实现
3. 6b 是最重的阶段，页面多时可拆成多个 Claude Code 子会话，但每批仍要主 session 验收
4. 6d 是门禁：build 不过不能进 Step 7
5. **每个子阶段完成后等新爷确认代码方向**

## Claude Code 实际拉起模板

### 默认执行范式（首选：Claude Code CLI）

**铁律：**
- 在项目根目录执行
- **不要开 PTY**
- 统一使用：`claude --permission-mode bypassPermissions --print`
- 输入任务时把当前子阶段 `.md` 指令、Step4 规划、Step5 数据路径一起喂给 Claude Code
- 长任务用后台执行；每个子阶段完成后先验收，再决定是否进入下一阶段

```bash
cd /ABS/PATH/TO/PROJECT && \
claude --permission-mode bypassPermissions --print "
你在执行建站 SOP 的 Step 6 当前子阶段：<6a|6b|6c|6d>

必须先读取这些文件：
1. /Users/liyixin/.openclaw/skills/sitebuilder-step6-build/step6<stage>-*.md
2. sop/roblox/runs/<slug>/step4-plan.md
3. sop/roblox/runs/<slug>/step5-content-manifest.json
4. sop/roblox/runs/<slug>/step2-keywords.json

执行要求：
- 严格按子阶段指令实现，不要跳到下一个阶段
- 直接修改当前仓库代码
- 完成后先执行项目的 build / lint / typecheck（能跑的都跑）
- 输出：改了哪些文件、页面是否完成、还有什么风险
"
```

### OpenClaw / 聊天面执行范式（thread-bound 时用 ACP）

如果当前是在聊天线程里跑，而不是直接下本机 CLI，就用 ACP 方式拉起 Claude Code，会话要和线程绑定，避免上下文乱飞：

```json
{
  "runtime": "acp",
  "agentId": "claude-code",
  "thread": true,
  "mode": "session",
  "task": "执行建站 SOP 的 Step 6x。先读取对应 step6 子阶段文件 + step4-plan.md + step5-content-manifest.json + step2-keywords.json，只做当前阶段代码实现，完成后汇报改动文件、build 结果和风险。"
}
```

> 如果本机 ACP 里的 Claude Code agentId 不是 `claude-code`，就替换成实际配置的 id；别瞎猜别名。

### 6b 拆分建议（页面很多时）

- 一个 Claude Code 子会话只负责一组页面：比如 `hub + 2 个 tool pages`
- 不要把整个站一次性塞进一个超长 prompt
- 每一批做完先主 session 验收，再开下一批
- build 失败先原地修，不要带着红灯进入 6c / 6d

## 下一步

build 通过 → Step 7（质量验证）
