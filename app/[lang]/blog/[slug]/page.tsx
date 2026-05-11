import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";
import { BlogCard } from "@/components/BlogCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface Props {
  params: Promise<{ slug: string; lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  try {
    const post = getPostBySlug(slug, lang);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, lang } = await params;
  let post;
  
  try {
    post = getPostBySlug(slug, lang);
  } catch {
    notFound();
  }

  // Fetch related posts (3 most recent excluding current)
  const relatedPosts = getRelatedPosts(slug, lang, 3);
  
  // Calculate read time
  const words = post.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <main className="flex-1 py-12">
        <article className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumbs */}
             <nav className="mb-8 flex items-center text-sm text-gray-500 flex-wrap gap-2">
              <Link href={getLocalizedPath('/', lang)} className="hover:text-blue-600 transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href={getLocalizedPath('/blog', lang)} className="hover:text-blue-600 transition-colors">Blog</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 truncate max-w-[200px] md:max-w-md font-medium">{post.title}</span>
            </nav>

            <header className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{post.author || 'Admin'}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </header>
            
            {post.coverImage && (
              <div className="mb-12 overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-900/5">
                 <div className="aspect-[21/9] w-full bg-cover bg-center bg-gray-100" 
                      style={{ backgroundImage: `url(${post.coverImage})` }} />
              </div>
            )}
            
            <div className="prose prose-lg mx-auto mb-16 prose-img:rounded-xl prose-headings:scroll-mt-20">
              <MarkdownContent content={post.content} />
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-16 mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                  <Link href={`/${lang}/blog`} className="text-blue-600 hover:text-blue-700 font-medium text-sm hidden sm:block">
                    View All Posts &rarr;
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map(post => (
                    <BlogCard key={post.slug} post={post} lang={lang} variant="vertical" />
                  ))}
                </div>
                <div className="mt-8 text-center sm:hidden">
                  <Link href={`/${lang}/blog`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All Posts &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
