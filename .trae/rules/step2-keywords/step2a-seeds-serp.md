# Step 2a: 设定词根 + 词找站

> 输入：`sop/roblox/runs/<slug>/step1-research.json`
> 输出：`sop/roblox/runs/<slug>/step2a-seeds-serp.json`
> 下一步：step2b-competitor-mining.md

## 前置条件

- Step 1 已完成，`step1-research.json` 存在
- 如果 `recommendation.primaryTool` 为空，先回去补完 Step 1

## 阶段 1：设定词根

从 Step 1 报告中提取 3-5 个聚焦词根。

### 从 step1-research.json 提取种子

**品牌词根**（必选）：
- `identity.gameName` → 如 `garden horizons`

**机制词根**（从 mechanics.systems 提取）：
- 每个 system.name 就是一个词根 → 如 `mutations`、`seeds`、`stats`

**工具意图词根**（从 recommendation 提取，最重要）：
- `recommendation.primaryTool` → 如 `calculator`
- `recommendation.secondaryTools` → 如 `database`、`map`

### 组合公式

**公式 1：`<游戏名> + <工具词>`**（优先级最高）
```
garden horizons calculator
garden horizons seed database
garden horizons mutation map
```

**公式 2：`<游戏名> + <机制词>`**
```
garden horizons mutations
garden horizons seed prices
garden horizons stats guide
```

**公式 3：`<游戏名> + <通用意图词>`**
```
garden horizons how to
garden horizons wiki
garden horizons not working
```

产出 20-30 个候选词，每个标注来源公式和优先级：
- **high**：公式 1（工具意图）
- **medium**：公式 2（机制意图）
- **low**：公式 3（通用意图）

## 阶段 2：词找站（SERP 扫描）

对 high priority 的候选词（通常 5-8 个），用 browser 打开 Google 搜索：

```
browser 打开 https://www.google.com/search?q=<URL编码的关键词>&hl=en&gl=us
```

不要用 `web_search`（禁用）。browser 能看到完整信息：
- 自然搜索结果 Top 10
- Featured Snippet（精选摘要）
- People Also Ask（相关问题）
- 视频轮播

对每个结果记录：
- URL + 域名
- 页面类型（首页/内页/论坛帖/视频）
- 内容质量判断（详细/粗糙/过时/AI味重）

### YouTube 标题挖词（优先用 bb-browser）

> 💡 **优先用 bb-browser**（结构化输出更快），fallback 用 agent-reach

#### bb-browser 方案（推荐）

```bash
# 准备
export PNPM_HOME="/Users/liyixin/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"

# 搜索 YouTube 视频标题
bb-browser site youtube/search "<游戏名> guide" --json
bb-browser site youtube/search "<游戏名> tips" --json
```

输出直接是结构化 JSON，收集 video title 拆出重复词组。

#### agent-reach 方案（fallback）

```bash
agent-reach search "site:youtube.com <游戏名> guide"
agent-reach search "site:youtube.com <游戏名> tips"
```

收集 15-20 个视频标题，拆出重复出现的词组（如 `best seeds`、`mutation guide`）。

### Google Suggest 自动补全

```bash
curl -s "https://suggestqueries.google.com/complete/search?client=firefox&q=<游戏名>+&hl=en" | python3 -c "import sys,json; print('\n'.join(json.loads(sys.stdin.read())[1]))"
```

变体查询（加字母后缀）：`<游戏名> a` 到 `<游戏名> z`

## 输出

落盘路径：`sop/roblox/runs/<slug>/step2a-seeds-serp.json`

```json
{
  "meta": {
    "step": "2a",
    "slug": "",
    "createdAt": "ISO-8601"
  },
  "seedKeywords": [
    {"keyword": "", "source": "formula1|formula2|formula3", "priority": "high|medium|low"}
  ],
  "competitors": [
    {
      "domain": "",
      "url": "",
      "keyword": "",
      "position": 0,
      "quality": "low|medium|high",
      "note": ""
    }
  ],
  "longTailFromYouTube": [],
  "longTailFromSuggest": []
}
```

## 汇报

```
🔍 <游戏名> Step2a 词根+SERP 完成
候选词：X 个（公式1 X / 公式2 X / 公式3 X）
竞品站：X 个
YouTube 长尾：X 个
Suggest 长尾：X 个
```

## 耗时预期
8-12 分钟。Google 搜索间隔 3 秒避免 429。
