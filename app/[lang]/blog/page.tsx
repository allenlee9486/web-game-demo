import { getAllPosts } from "@/lib/api";
import { BlogCard } from "@/components/BlogCard";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";
import Link from "next/link";
import { getLocalizedPath } from "@/lib/i18n-utils";

export const metadata: Metadata = {
  title: "Blog - GamePortal",
  description: "Latest news, updates, and guides from the GamePortal team.",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const allPosts = getAllPosts(lang);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
             {/* Breadcrumbs */}
            <nav className="mb-8 flex items-center text-sm text-gray-500">
              <Link href={getLocalizedPath('/', lang)} className="hover:text-blue-600 transition-colors">Home</Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">Blog</span>
            </nav>

            <div className="mb-12 text-center">

              <h1 className="text-4xl font-bold mb-4">{dictionary.blog.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {dictionary.blog.subtitle}
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              {allPosts.map((post) => (
                <BlogCard key={post.slug} post={post} lang={lang} variant="horizontal" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
