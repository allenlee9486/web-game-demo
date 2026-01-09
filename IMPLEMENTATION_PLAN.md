# 游戏门户网站开发实施计划 (Implementation Plan)

本文档旨在规划基于 Next.js + Markdown 的游戏门户网站开发流程。每次开发前请查阅此文档以保持上下文一致。

## 1. 核心目标
构建一个类似 PokePath TD 的静态游戏网站，包含：
- 首页 (Home)
- 游戏库 (Games)
- 博客 (Blog)
- 基于 Markdown 的内容管理系统 (无数据库，通过增加 .md 文件新增内容)

## 2. 技术栈
- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS + @tailwindcss/typography
- **Markdown 解析**: gray-matter (Frontmatter), react-markdown
- **图标**: lucide-react
- **工具**: clsx, tailwind-merge

## 3. 详细执行步骤

### 第一阶段：基础建设 (Infrastructure)
- [ ] **安装依赖**: `gray-matter`, `react-markdown`, `@tailwindcss/typography`, `lucide-react`, `clsx`, `tailwind-merge`
- [ ] **配置 Tailwind**: 修改 `tailwind.config.ts` 添加 typography 插件
- [ ] **清理初始代码**: 移除 Next.js 默认样板代码，重置 `globals.css`

### 第二阶段：数据层 (Data Layer)
- [ ] **创建目录结构**: 
    - `content/games`: 存放游戏 .md 文件
    - `content/blog`: 存放博客 .md 文件
    - `public/images`: 存放静态资源
- [ ] **定义 TypeScript 接口**: 在 `src/types/index.ts` 中定义 `Game` 和 `BlogPost` 类型
- [ ] **编写工具函数**: 创建 `src/lib/api.ts` 实现文件系统读取与 Frontmatter 解析逻辑

### 第三阶段：组件开发 (Components)
- [ ] **布局组件**: `Navbar` (导航), `Footer` (页脚)
- [ ] **展示组件**: 
    - `GameCard`: 游戏缩略图卡片
    - `BlogCard`: 博客文章卡片
    - `MarkdownContent`: 统一样式的 Markdown 渲染器

### 第四阶段：页面实现 (Pages)
- [ ] **首页 (`app/page.tsx`)**: 包含 Hero 区域、精选游戏展示、最新博客列表
- [ ] **游戏列表 (`app/games/page.tsx`)**: 网格布局展示所有游戏，支持基础分类筛选
- [ ] **游戏详情 (`app/games/[slug]/page.tsx`)**: 
    - 游戏容器 (iframe)
    - 游戏元信息展示
    - Markdown 描述内容
- [ ] **博客列表 (`app/blog/page.tsx`)**: 文章列表展示
- [ ] **博客详情 (`app/blog/[slug]/page.tsx`)**: 文章阅读页

### 第五阶段：内容填充 (Content)
- [ ] **示例数据**:
    - 添加 1-2 个示例游戏 MD 文件
    - 添加 1-2 篇示例博客 MD 文件
- [ ] **资源**: 添加必要的占位图片到 public 目录

### 第六阶段：验证与交付 (Verification)
- [ ] **构建测试**: 运行 `npm run build` 确保 SSG 生成无误
- [ ] **文档更新**: 更新 `README.md` 说明如何添加新游戏和文章

## 4. 数据结构规范

### 游戏 (Game) Frontmatter
文件路径: `content/games/game-name.md`
```yaml
---
title: "PokéPath TD"
slug: "pokepath-td"
description: "A strategic tower defense game where you catch and evolve monsters."
category: "Tower Defense"
thumbnail: "/images/games/poke-td.jpg"
gameUrl: "https://html5game-url.com/play"  # 游戏 iframe 地址
publishDate: "2023-10-01"
featured: true
---

这里是游戏的详细 Markdown 介绍...
```

### 博客 (Blog) Frontmatter
文件路径: `content/blog/post-name.md`
```yaml
---
title: "Version 1.2 Update Notes"
slug: "version-1-2-update"
date: "2023-10-05"
excerpt: "New levels and monsters added in this update."
coverImage: "/images/blog/update.jpg"
author: "Admin"
---

这里是博客正文内容...
```
