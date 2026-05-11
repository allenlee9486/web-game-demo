# Step 1c: 机制摸底 + 输出研究报告

> 输入：`step1a-identity-sources.json` + `media/` 文件夹
> 输出：`sop/roblox/runs/<slug>/step1-research.json`（最终合并报告）
> 下一步：Step 2（`~/.openclaw/skills/sitebuilder-step2-keywords/SKILL.md`）

## 前置条件

- Step 1a 和 1b 已完成
- 读取 `step1a-identity-sources.json` 获取 sources 信息

## 机制摸底（核心差异化阶段）

目标：理解游戏核心机制，**重点评估哪些数据结构适合做计算器/数据库/交互地图**。

> ⚠️ 策略转向：不再默认规划 codes/tier list（红海，大站碾压）。
> 优先寻找可交互工具型页面的切入点。

### 核心机制梳理

从 Trello 看板 + Wiki + YouTube 视频中提取：
1. **核心玩法循环** — 玩家主要在做什么？（战斗/种植/交易/建造/收集）
2. **数值系统** — 有没有 stats/属性/等级/稀有度？
3. **物品/角色体系** — 有没有大量可枚举的实体？（武器/种子/宠物/NPC/地图区域）
4. **经济系统** — 有没有交易/价格/价值波动？
5. **进度系统** — 有没有解锁树/任务链/成就？

### 工具型页面机会评估（最重要）

对每个发现的数据结构，评估是否适合做交互工具：

| 数据结构 | 可做的工具 | 评估标准 |
|----------|-----------|---------| 
| 数值/属性系统 | **计算器**（伤害/收益/配装） | 有公式可算 + 玩家真的需要优化 |
| 大量可枚举实体 | **数据库/图鉴** | 实体数 > 20 + 有多维属性可筛选 |
| 地图/区域系统 | **交互地图** | 有空间关系 + 玩家需要找位置 |
| 价格/价值体系 | **价值追踪器** | 价格会变动 + 社区关心交易 |
| 进度/解锁树 | **进度规划器** | 路径有分支 + 玩家需要规划 |
| 兑换码系统 | codes 页（降级选项） | 只在没有更好工具机会时才做 |

### 不确定时的处理

- 截图猜机制容易翻车（历史教训：draw 模式 3 次反转）
- **铁律：不确定就停下来问新爷**，或者用 browser 打开游戏实际看一下
- Know Your Meme (KYM) 是最快的 meme game 机制参考
- 反转 2 次立刻停，问清楚再动手

## 输出研究报告

合并 step1a + step1b + 机制分析，写入最终报告。

落盘路径：`sop/roblox/runs/<slug>/step1-research.json`

```json
{
  "meta": {
    "step": 1,
    "slug": "",
    "createdAt": "ISO-8601",
    "status": "complete|partial"
  },
  "identity": { "...从 step1a 复制..." },
  "sources": { "...从 step1a 复制..." },
  "media": { "...从 step1b 复制..." },
  "mechanics": {
    "coreLoop": "描述核心玩法",
    "systems": [
      {
        "name": "系统名称",
        "description": "简述",
        "dataStructure": "数值|枚举|空间|价格|进度",
        "toolOpportunity": "calculator|database|map|tracker|planner|none",
        "confidence": "high|medium|low",
        "reason": "为什么适合/不适合做工具"
      }
    ]
  },
  "recommendation": {
    "primaryTool": "最推荐做的工具类型",
    "secondaryTools": [],
    "avoidList": [],
    "competitiveEdge": "这个工具为什么大站不容易抄"
  },
  "gaps": []
}
```

### 标注缺口

`gaps` 数组记录所有没拿到的信息：
```json
{"field": "sources.trello", "reason": "搜索未找到 Trello 看板", "priority": "low"}
```

priority 分级：
- **high**：影响 Step2 选词或 Step4 内容规划（如核心机制不明）
- **medium**：影响内容质量但不阻塞（如缺截图）
- **low**：锦上添花（如没找到 Twitter）

## 完成条件

1. ✅ `step1-research.json` 已落盘且 JSON 合法
2. ✅ `identity` 所有必填字段有值（gameName / platform / genre）
3. ✅ `sources` 至少找到 2 个有效源
4. ✅ `media.screenshots` 至少 3 张图已下载
5. ✅ `mechanics.systems` 至少识别出 1 个数据结构
6. ✅ `recommendation.primaryTool` 已给出建议

## 汇报

```
🎮 <游戏名> Step1 研究报告完成

身份：<平台> / <类型> / <开发者>
官方源：Trello ✅|❌ / Discord ✅|❌ / Reddit ✅|❌ / YouTube ✅|❌
素材：截图 X 张 / 视频 X 个
核心机制：<一句话概括>

🔧 工具型页面机会：
- 首推：<primaryTool>（原因）
- 备选：<secondaryTools>
- 不建议：<avoidList>

⚠️ 缺口（X 个 high / X 个 medium）：
- <列出 high priority gaps>

报告已落盘：sop/roblox/runs/<slug>/step1-research.json
```

## 耗时预期
5-8 分钟。不要超过 10 分钟。
