import Link from "next/link";
import { BlogPost } from "@/types";
import { Calendar, Clock, User } from "lucide-react";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface BlogCardProps {
  post: BlogPost;
  lang: Locale;
  variant?: "vertical" | "horizontal";
}

export function BlogCard({ post, lang, variant = "vertical" }: BlogCardProps) {
  // Simple read time calculation (approx 200 words per minute)
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <Link href={getLocalizedPath(`/blog/${post.slug}`, lang)} className="group block h-full">
      <div 
        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800 flex flex-col h-full ${
          variant === "horizontal" ? "md:flex-row" : ""
        }`}
      >
        <div 
          className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${
            variant === "horizontal" 
              ? "w-full md:w-2/5 aspect-video md:aspect-auto md:min-h-[200px]" 
              : "aspect-video w-full"
          }`}
        >
           {post.coverImage ? (
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                 style={{ backgroundImage: `url(${post.coverImage})` }} />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-400">
               <span className="text-sm">No Image</span>
             </div>
          )}
        </div>
        
        <div className={`flex flex-col p-5 ${variant === "horizontal" ? "md:w-3/5" : "w-full"}`}>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <time dateTime={post.date}>{post.date}</time>
            </div>
             <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readTime} min read</span>
            </div>
          </div>
          
          <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow text-sm leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
               <User className="h-3 w-3" />
               <span>{post.author || 'Admin'}</span>
            </div>
            {variant === "horizontal" && (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Read More &rarr;
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
