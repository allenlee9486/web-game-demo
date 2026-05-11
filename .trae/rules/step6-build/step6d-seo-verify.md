# Step 6d: SEO 基础设施 + Build 验证

> 输入：6a-6c 构建完成的所有页面
> 输出：`npm run build` 通过 + SEO 基础设施完备
> 下一步：Step 7（`~/.openclaw/skills/sitebuilder-step7-qa/SKILL.md`）

## 前置条件

- Step 6a-6c 已完成，所有页面代码已写入

## Sitemap

`src/app/sitemap.ts`：包含所有页面路由，URL 用最终不跳转的主域。

## robots.txt

`public/robots.txt`：`User-agent: * / Allow: / / Sitemap: https://<domain>/sitemap.xml`

## Structured Data（JSON-LD）

- 所有页面：WebPage schema
- FAQ 页面：FAQPage schema
- 工具页：WebApplication schema

## 内链组件

确认 `RelatedLinks` 组件已创建，三层结构：父 hub → 同级 pillar → 首页/高流量页

## Build 验证

```bash
npm run build  # 必须 0 error
```

## 路由完整性

对照 step4-planning.json 的页面列表，确认每个页面路由都存在。

## 内容完整性扫描

```bash
# 每页有图片引用
grep -rn "Image\|img\|YouTubeEmbed" src/app/ --include="*.tsx"

# AI 味黑名单词
grep -rni "showcasing\|ensures\|vital\|not just\|delve\|tapestry\|landscape\|unleash\|elevate\|empower" src/app/ --include="*.tsx"

# Related Links 存在
grep -rn "RelatedLinks\|related" src/app/ --include="*.tsx"

# 图片文件都被引用
ls public/images/<slug>/
```

## 验证通过标准

- ✅ `npm run build` 零错误
- ✅ 所有页面路由存在
- ✅ 每页有图片（≥2张）+ YouTube 嵌入 + Related Links + FAQ
- ✅ 无 AI 味黑名单词
- ✅ seoTitle 长度合规（50-60字符）
- ✅ canonical URL 正确
- ✅ sitemap 包含所有路由

## 汇报

```
🏗️ <游戏名> Step6 站点构建完成

页面总数：X 页（全部 build 通过）
SEO 基础设施：✅ metadata / ✅ sitemap / ✅ robots / ✅ JSON-LD
验证：✅ build 零错误 / ✅ AI味扫描通过 / ✅ 图片视频完整

代码已提交：<commit hash>
请确认是否进入 Step 7？
```

## 耗时预期
8-12 分钟。
