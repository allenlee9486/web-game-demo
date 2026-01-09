# Game Portal

This is a static game portal built with Next.js 15, Tailwind CSS, and Markdown.
It is designed to be easily managed by adding/editing Markdown files.

## 🚀 Features

- **Multi-language Support (i18n)**: Supports English and Chinese (Simplified).
- **Admin Dashboard**: Web-based interface to manage games and blog posts.
- **Static Site Generation (SSG)**: Blazing fast performance and SEO friendly.
- **Markdown Driven**: Manage games and blog posts using simple `.md` files.
- **No Database**: Zero maintenance database-free architecture.
- **Responsive Design**: Looks great on mobile and desktop.
- **Dark Mode**: System-aware dark mode support.

## 🌍 Multi-language

The site supports `en` (English) and `zh` (Chinese).
- Content files can have a locale suffix, e.g., `game-1.zh.md`.
- If a locale-specific file is missing, it falls back to the default (`.md`).

## 🛡️ Admin Dashboard

Access the admin dashboard at `/admin`.
- **Default Password**: `admin123`
- **Features**: List, Add, Delete games and blog posts.

## 🛠️ How to Manage Content

### Adding a New Game

1. Create a new `.md` file in the `content/games/` directory.
2. Use the following Frontmatter template:

```yaml
---
title: "My New Game"
description: "A short description of the game."
category: "Action"
image: "/images/games/thumbnail.jpg"
gameUrl: "https://example.com/game-iframe-url"
date: "2023-10-27"
featured: true
---

## Game Description

Write your game description here using Markdown.
```

3. Place the thumbnail image in `public/images/games/`.

### Adding a Blog Post

1. Create a new `.md` file in the `content/blog/` directory.
2. Use the following Frontmatter template:

```yaml
---
title: "My New Post"
date: "2023-10-27"
excerpt: "A short summary of the post."
coverImage: "/images/blog/cover.jpg"
author: "Admin"
---

## Post Content

Write your blog post here.
```

3. Place the cover image in `public/images/blog/`.

## 💻 Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

```bash
npm run build
```

This will generate static HTML files in the `out` directory (if configured for export) or optimize the `.next` build for production.

## 📁 Project Structure

- `app/[lang]/`: Next.js App Router pages (Localized).
- `app/admin/`: Admin Dashboard.
- `app/api/`: API Routes for Admin.
- `content/`: Markdown files for Games and Blog.
- `public/`: Static assets (images, icons).
- `src/components/`: React components.
- `src/lib/`: Utility functions and API logic.
- `src/types/`: TypeScript definitions.
- `src/dictionaries/`: Localization strings.
