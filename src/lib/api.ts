import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Game, BlogPost } from "@/types";
import { i18n, Locale } from "@/i18n-config";

const gamesDirectory = path.join(process.cwd(), "content/games");
const blogDirectory = path.join(process.cwd(), "content/blog");

// Helper to get file path based on locale
// Strategy: 
// 1. Try exact match: `slug.locale.md` (e.g. game-1.zh.md)
// 2. Fallback to default: `slug.md` (e.g. game-1.md)
function getFilePath(directory: string, slug: string, locale: Locale) {
  const localePath = path.join(directory, `${slug}.${locale}.md`);
  if (fs.existsSync(localePath)) {
    return localePath;
  }
  return path.join(directory, `${slug}.md`);
}

// --- Games API ---

export function getGameSlugs() {
  // Get all unique slugs regardless of locale extension
  const files = fs.readdirSync(gamesDirectory);
  const slugs = new Set<string>();
  
  files.forEach(file => {
    // Remove .md and .locale.md extensions
    const slug = file.replace(/\.[a-z]{2}\.md$/, "").replace(/\.md$/, "");
    slugs.add(slug);
  });
  
  return Array.from(slugs);
}

export function getGameBySlug(slug: string, locale: Locale = i18n.defaultLocale): Game {
  const fullPath = getFilePath(gamesDirectory, slug, locale);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Game not found: ${slug} (${locale})`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    thumbnail: data.thumbnail,
    gameUrl: data.gameUrl,
    publishDate: data.publishDate,
    featured: data.featured,
    content,
  } as Game;
}

export function getAllGames(locale: Locale = i18n.defaultLocale): Game[] {
  const slugs = getGameSlugs();
  const games = slugs
    .map((slug) => {
      try {
        return getGameBySlug(slug, locale);
      } catch (e) {
        return null;
      }
    })
    .filter((game): game is Game => game !== null)
    .sort((game1, game2) => (game1.publishDate > game2.publishDate ? -1 : 1));
  return games;
}

export function getFeaturedGames(locale: Locale = i18n.defaultLocale): Game[] {
  const allGames = getAllGames(locale);
  return allGames.filter((game) => game.featured);
}

// --- Blog API ---

export function getPostSlugs() {
  const files = fs.readdirSync(blogDirectory);
  const slugs = new Set<string>();
  
  files.forEach(file => {
    const slug = file.replace(/\.[a-z]{2}\.md$/, "").replace(/\.md$/, "");
    slugs.add(slug);
  });
  
  return Array.from(slugs);
}

export function getPostBySlug(slug: string, locale: Locale = i18n.defaultLocale): BlogPost {
  const fullPath = getFilePath(blogDirectory, slug, locale);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug} (${locale})`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    author: data.author,
    content,
  } as BlogPost;
}

export function getAllPosts(locale: Locale = i18n.defaultLocale): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug, locale);
      } catch (e) {
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
