# Step 1a: 游戏身份确认 + 官方源锁定

> 输入：游戏名（+ 可选的域名、平台类型）
> 输出：`sop/roblox/runs/<slug>/step1a-identity-sources.json`
> 下一步：step1b-media-collection.md

## 前置条件

- 用户已给出游戏名称
- 如果有域名，记录到报告里；没有的话不管域名

## 阶段 1：游戏身份确认

目标：用最少的搜索确认游戏的基本身份信息。

执行步骤：
1. `agent-reach search` 搜索 `<游戏名> roblox` 或 `<游戏名> game`，确认平台归属
2. 从搜索结果中提取：
   - **平台**：Roblox / itch.io / Web / Steam（决定后续采集路径）
   - **开发者**：工作室或个人名
   - **上线日期**：大致时间即可
   - **类型标签**：RPG / 模拟 / 格斗 / Tycoon 等
3. Roblox 游戏额外提取：
   - **placeId**：从 roblox.com URL 里扒，格式 `roblox.com/games/<placeId>`
   - **universeId**：用 `curl "https://apis.roblox.com/universes/v1/places/<placeId>/universe"` 获取
   - 不要猜测 placeId，必须从可靠来源（wiki/guide 文章的 href）获取
4. Web Meme Game 额外确认：
   - 原版游戏 URL
   - 是否反 iframe（决定后续能不能嵌入）

## 阶段 2：官方源锁定

目标：找到这个游戏的所有官方/半官方信息源，为后续内容生产提供可引用的权威来源。

> 💡 **优先用 bb-browser**（结构化输出更快），fallback 用 agent-reach

### bb-browser 方案（推荐）

```bash
# 准备
export PNPM_HOME="/Users/liyixin/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"

# YouTube 搜索（结构化 JSON 秒出）
bb-browser site youtube/search "<游戏名> gameplay" --json

# Reddit 搜索
bb-browser site reddit/posts "<游戏名>" --json

# Wikipedia 搜索
bb-browser site wikipedia/search "<游戏名>" --json

# Twitter 搜索
bb-browser site twitter/search "<游戏名>" --json
```

### agent-reach 方案（fallback）

```bash
# YouTube
agent-reach search "site:youtube.com <游戏名> gameplay"
# Reddit
agent-reach search "site:reddit.com <游戏名>"
# Wiki
agent-reach search "<游戏名> wiki"
# Twitter
agent-reach search "site:twitter.com <游戏名>"
```

### 必查源（每个游戏都查）
1. **Trello 看板** — `agent-reach search "<游戏名> trello board"`
   - Roblox 游戏大概率有 Trello，这是最权威的机制/数据来源
   - 找到后记录 URL，后续 Step4 会深挖
2. **Discord 服务器** — 优先从游戏官方页面（Roblox 游戏描述区）扒取邀请链接
   - 没有专属 Discord 的游戏，记录为 null
3. **Reddit** — 用 bb-browser 或 agent-reach 搜索
   - 有专属 subreddit 记录 `/r/<名称>`
   - 没有的话记录 Reddit 搜索页 URL
4. **YouTube** — 用 bb-browser 搜索，找 3-5 个最新视频
   - 优先 Shorts（适合嵌入）和 gameplay 实录（适合截图）

### 选查源（有就记，没有不强求）
5. **Wiki** — 用 bb-browser 的 `wikipedia/search`
6. **官方社媒** — Twitter/X 账号，用 bb-browser 的 `twitter/search`
7. **Patch Notes / Changelog** — 官方更新日志

### 铁律
- Trello 链接必须能打开，不要从记忆里编造
- Discord 链接优先从游戏官方页面扒取，不要用过期邀请链接
- YouTube videoId 必须是真实的，用 `agent-reach search` 确认
- 找不到的源标 null，不要硬编

## 输出

创建工作目录：
```bash
mkdir -p ~/workspace/sop/roblox/runs/<slug>/media
```

落盘路径：`sop/roblox/runs/<slug>/step1a-identity-sources.json`

```json
{
  "meta": {
    "step": "1a",
    "slug": "",
    "createdAt": "ISO-8601",
    "status": "complete|partial"
  },
  "identity": {
    "gameName": "",
    "platform": "roblox|itch|web|steam",
    "developer": "",
    "releaseDate": "",
    "genre": "",
    "placeId": null,
    "universeId": null,
    "originalUrl": null
  },
  "sources": {
    "trello": null,
    "discord": null,
    "reddit": null,
    "youtube": [
      {"videoId": "", "title": "", "type": "shorts|gameplay|guide"}
    ],
    "wiki": null,
    "twitter": null,
    "patchNotes": null
  },
  "gaps": []
}
```

## 汇报

完成后向新爷汇报：
```
🎮 <游戏名> Step1a 身份+源锁定完成
平台：<platform> / 类型：<genre> / 开发者：<developer>
官方源：Trello ✅|❌ / Discord ✅|❌ / Reddit ✅|❌ / YouTube ✅|❌
缺口：X 个
```

## 耗时预期
5-8 分钟。不要超过 10 分钟。
