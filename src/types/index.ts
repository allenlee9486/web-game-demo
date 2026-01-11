export interface GameModule {
  id: string;
  type: 'markdown' | 'faq' | 'video';
  title: string;
  content?: string; // For markdown type
  items?: { question: string; answer: string }[]; // For faq type
  videoUrl?: string; // For video type (iframe url)
}

export interface Game {
  slug: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  gameUrl: string;
  publishDate: string;
  featured?: boolean;
  content: string;
  modules?: GameModule[];
  // Legacy fields - kept for backward compatibility but will be migrated to modules at runtime
  howToPlay?: string;
  tips?: string;
  whyPlay?: string;
  faq?: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  author: string;
  content: string;
}
