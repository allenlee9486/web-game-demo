# Step 5b: 视觉素材 + YouTube 视频采集

> 输入：`step4-planning.json` 的 assets.images 和 assets.videos
> 输出：`step5-content/images/` + `step5-content/videos.json`
> 下一步：step5c-references-manifest.md

## 前置条件

- Step 5a 已完成
- 读取 `step4-planning.json` 每个页面的图片和视频需求

## 图片采集

来源优先级：Trello 图卡 > Fandom Wiki > 游戏官方页面 > YouTube 截帧

采集流程：
1. 找图（按优先级依次尝试）
2. 下载：`curl -L -o <filename> <url>`
3. 格式转换：`cwebp -q 80 input.png -o output.webp`（或 ffmpeg）
4. 尺寸调整：hero 1200×630，缩略图 400×400，配图宽度≤1200px
5. 落盘：`step5-content/images/<page-slug>/`

命名规则：`<page-slug>-hero.webp` / `<element-name>.webp` / `<context>-screenshot.webp`

铁律：
- 文件名不用中文/空格/特殊字符
- 下载失败标"missing"，Step 6 用 placeholder
- hero 找不到 → 用游戏官方缩略图裁切

## YouTube 视频采集

搜索：`site:youtube.com "<游戏名>" <关键词> gameplay|guide|tutorial`

筛选标准：
1. 官方频道预告片/更新日志
2. 知名 YouTuber（>10K 订阅）教程
3. 最近 3 个月 Shorts（<60s）
4. 播放量 >1K

排除：播放量 <100 / 标题党 / 不相关

每个视频记录：videoId / title / channel / duration / uploadDate / relevance

高清封面：`https://img.youtube.com/vi/<videoId>/maxresdefault.jpg`（404 降级 hqdefault）

## 输出

- 图片：`step5-content/images/<page-slug>/`
- 视频清单：`step5-content/videos.json`

## 汇报

```
📸 Step5b 视觉+视频采集完成
- 图片：X 张已下载（missing X 张）
- 视频：X 个已找到
```

## 耗时预期
10-15 分钟。
