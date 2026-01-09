import { getPostBySlug, getPostSlugs } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";

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
  } catch (e) {
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
  const dictionary = await getDictionary(lang);
  let post;
  
  try {
    post = getPostBySlug(slug, lang);
  } catch (e) {
    notFound();
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1 py-12">
        <article className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Link 
              href={`/${lang}/blog`}
              className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dictionary.common.back_to_blog}
            </Link>

            <header className="mb-10 text-center">
              <div className="mb-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {post.title}
              </h1>
            </header>
            
            {post.coverImage && (
              <div className="mb-10 overflow-hidden rounded-xl shadow-lg">
                 {/* Placeholder for image component */}
                 <div className="aspect-[2/1] w-full bg-cover bg-center bg-gray-100" 
                      style={{ backgroundImage: `url(${post.coverImage})` }} />
              </div>
            )}
            
            <div className="rounded-xl border bg-white p-8 shadow-sm dark:bg-gray-900 dark:border-gray-800">
              <MarkdownContent content={post.content} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
