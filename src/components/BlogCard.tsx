import Link from "next/link";
import { BlogPost } from "@/types";
import { Calendar } from "lucide-react";
import { Locale } from "@/i18n-config";

interface BlogCardProps {
  post: BlogPost;
  lang: Locale;
}

export function BlogCard({ post, lang }: BlogCardProps) {
  return (
    <Link href={`/${lang}/blog/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800">
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
           {post.coverImage && (
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                 style={{ backgroundImage: `url(${post.coverImage})` }} />
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
