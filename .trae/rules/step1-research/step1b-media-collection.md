# Step 1b: 素材采集

> 输入：`sop/roblox/runs/<slug>/step1a-identity-sources.json`
> 输出：`sop/roblox/runs/<slug>/media/` 文件夹 + 更新 JSON
> 下一步：step1c-mechanics-report.md

## 前置条件

- Step 1a 已完成，`step1a-identity-sources.json` 存在
- 读取该 JSON 获取 `sources.youtube` 和 `identity.universeId`

## YouTube 视频采集（优先用 bb-browser）

> 💡 **优先使用 bb-browser**（结构化输出更快），fallback 用 agent-reach

### bb-browser 方案（推荐）

```bash
# 搜索 YouTube 视频
export PNPM_HOME="/Users/liyixin/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
bb-browser site youtube/search "<游戏名> gameplay" --json
```

输出直接是结构化 JSON：
```json
{
  "videos": [
    {"videoId": "xxx", "title": "xxx", "channel": "xxx", "views": "xxx", "duration": "10:34"}
  ]
}
```

### agent-reach 方案（fallback）

```bash
agent-reach search "site:youtube.com <游戏名> gameplay"
```

---

## 截图采集

优先级从高到低：

1. **游戏攻略站扒图** — bloxinformer / beebom / gamezebo / PGG 等站的文章配图
   - `agent-reach search "<游戏名> guide"` 或 `"<游戏名> gameplay screenshots"`
   - 用 `curl -L -o` 下载，不要用 `web_fetch`（禁用）
2. **YouTube 视频截帧** — 从 step1a 找到的视频里截
   - 用 `yt-dlp` 下载视频，再用 `ffmpeg` 截固定时间点（20s/60s/120s）
   - 或者直接用 YouTube 高清封面：`https://img.youtube.com/vi/<videoId>/maxresdefault.jpg`
3. **Roblox 官方缩略图** — 用 API 获取（需要 universeId）
   - `curl "https://thumbnails.roblox.com/v1/games/icons?universeIds=<universeId>&size=512x512&format=Png"`

目标数量：**至少 5 张不同场景的截图**
- 1 张主视觉（hero 用）
- 2-3 张 gameplay（不同场景/机制）
- 1 张 UI/菜单截图

落盘路径：`sop/roblox/runs/<slug>/media/`
命名规则：按语义命名（`hero-overview.jpg`、`combat-system.jpg`），不要用 `img1.jpg`

## 视频素材

从 step1a 的 YouTube 列表中选：
- **至少 1 个 Shorts**（< 60s，适合页面嵌入）
- **至少 1 个 gameplay 实录**（> 2min，用于截帧和内容参考）

只记录 videoId，不下载完整视频（太大）。后续 Step6 用 YouTube embed。

## 铁律
- 图片文件名用语义命名，不要把 overview 图硬命名成具体 NPC/地点
- 大图 push 用 HTTPS 不用 SSH（避免超时）
- PGG 返回 200 不代表有内容，要检查页面是否真有图
- 下载失败的图标注"待补"，不要用占位图冒充

## 输出

更新 `step1a-identity-sources.json`，追加 media 字段：

```json
{
  "media": {
    "screenshots": [
      {"filename": "hero-overview.jpg", "source": "bloxinformer", "description": "主视觉概览"}
    ],
    "videos": [
      {"videoId": "", "title": "", "duration": "", "useFor": "embed|reference"}
    ],
    "thumbnail": "roblox-icon-512.png"
  }
}
```

或者写入独立文件 `step1b-media.json`（如果不想改 step1a 的文件）。

## 汇报

```
📸 <游戏名> Step1b 素材采集完成
截图：X 张已下载（hero ✅ / gameplay X张 / UI ✅|❌）
视频：Shorts X 个 / Gameplay X 个
缺口：X 张待补
```

## 耗时预期
5-10 分钟。下载慢的图跳过标"待补"，不要死等。
