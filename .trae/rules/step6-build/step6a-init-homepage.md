# Step 6a: 项目初始化 + 首页 + 布局

> 输入：`step4-planning.json` + `step5-content/`
> 输出：可 `npm run dev` 的项目骨架 + 首页 + 全局布局
> 下一步：step6b-core-pages.md

## 前置条件

- Step 5 已完成且新爷已确认

## 克隆模板

```bash
cp -r ~/.openclaw/workspace/repo/roblox-site-template/. ~/.openclaw/workspace/repo/<slug>
cd ~/.openclaw/workspace/repo/<slug>
rm -rf .git && git init && git checkout -b main
```

> ⚠️ `cp -r source/.` 才能复制隐藏文件。不要引入模板的 `.gb-*` class 体系。

## 配置 site.config.ts

```typescript
export const siteConfig = {
  name: "<游戏名>",
  url: "https://<domain>",
  description: "<含 primaryKeyword 的一句话>",
  analytics: { ga4Id: "G-XXXXXXXXXX" },  // 新爷提供
  adsense: { publisherId: "ca-pub-XXXXXXXXXX" },
  social: { discord: "", roblox: "", youtube: "" },
  primaryKeyword: "<从 step2-keywords.json 读取>",
}
```

## 安装依赖 + 复制素材

```bash
npm install
# 复制数据和图片
cp -r sop/roblox/runs/<slug>/step5-content/data/ src/data/
cp -r sop/roblox/runs/<slug>/step5-content/images/ public/images/<slug>/
```

## 全局 Layout

`src/app/layout.tsx` 必须包含：
- metadataBase（否则 OG image 路径错）
- GA4 脚本
- Adsense 脚本（如已申请）
- 导航栏 + Footer

## 首页

按 step4-planning.json 的 homepage 配置构建，包含：
- Hero section（primaryKeyword 在 H1 中）
- 各 hub 页入口卡片
- FAQ section + JSON-LD
- Related Links 链接到所有 hub 页

## 验证

```bash
npm run dev  # 新爷手动跑
# 确认首页可访问
```

## 汇报

```
🏗️ Step6a 项目初始化完成
- 模板已克隆，依赖已安装
- site.config.ts 已配置
- 首页已构建（H1 含 primaryKeyword）
- 全局 Layout 已配置（GA4/导航/Footer）
```

## 耗时预期
10-15 分钟。
