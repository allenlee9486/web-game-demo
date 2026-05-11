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

  // Migration logic: Construct modules from legacy fields if modules are missing
  const modules = data.modules || [];
  if (modules.length === 0) {
    if (data.howToPlay) {
      modules.push({
        id: 'how-to-play',
        type: 'markdown',
        title: 'How to Play',
        content: data.howToPlay
      });
    }
    if (data.tips) {
      modules.push({
        id: 'tips',
        type: 'markdown',
        title: 'Tips & Tricks',
        content: data.tips
      });
    }
    if (data.whyPlay) {
      modules.push({
        id: 'why-play',
        type: 'markdown',
        title: 'Why Play Here?',
        content: data.whyPlay
      });
    }
    if (data.faq && Array.isArray(data.faq)) {
      modules.push({
        id: 'faq',
        type: 'faq',
        title: 'FAQ',
        items: data.faq
      });
    }
  }

  return {
    slug,
    title: data.title,
    description: data.description,
    category: data.category,
    thumbnail: data.image || data.thumbnail || '/images/placeholder.jpg',
    gameUrl: data.gameUrl,
    publishDate: (data.publishDate || data.date) instanceof Date 
      ? (data.publishDate || data.date).toISOString() 
      : (data.publishDate || data.date),
    featured: data.featured,
    videoUrl: data.videoUrl,
    content,
    modules,
    howToPlay: data.howToPlay,
    tips: data.tips,
    whyPlay: data.whyPlay,
    faq: data.faq,
  } as Game;
}

export function getAllGames(locale: Locale = i18n.defaultLocale): Game[] {
  const slugs = getGameSlugs();
  const games = slugs
    .map((slug) => {
      try {
        return getGameBySlug(slug, locale);
      } catch {
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

  // Logic to extract and remove first image from content to avoid duplication
  let coverImage = data.coverImage || '/images/blog/placeholder.jpg';
  let finalContent = content;

  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/;

  const mdMatch = content.match(markdownImageRegex);
  const htmlMatch = content.match(htmlImageRegex);

  let selectedImage = null;
  let matchToRemove = null;

  if (mdMatch && htmlMatch) {
    if ((mdMatch.index || 0) < (htmlMatch.index || 0)) {
      selectedImage = mdMatch[1];
      matchToRemove = mdMatch[0];
    } else {
      selectedImage = htmlMatch[1];
      matchToRemove = htmlMatch[0];
    }
  } else if (mdMatch) {
    selectedImage = mdMatch[1];
    matchToRemove = mdMatch[0];
  } else if (htmlMatch) {
    selectedImage = htmlMatch[1];
    matchToRemove = htmlMatch[0];
  }

  if (selectedImage) {
    coverImage = selectedImage;
    // Remove the image tag from content so it doesn't appear twice (header + body)
    finalContent = content.replace(matchToRemove!, "");
  }

  return {
    slug,
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date,
    excerpt: data.excerpt,
    coverImage: coverImage,
    author: data.author,
    content: finalContent,
  } as BlogPost;
}

export function getAllPosts(locale: Locale = i18n.defaultLocale): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(slug, locale);
      } catch {
        return null;
      }
    })
    .filter((post): post is BlogPost => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getRelatedPosts(currentSlug: string, locale: Locale = i18n.defaultLocale, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts(locale);
  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);
}
