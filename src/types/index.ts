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
