import Link from "next/link";
import { getFeaturedGames, getAllPosts } from "@/lib/api";
import { GameCard } from "@/components/GameCard";
import { BlogCard } from "@/components/BlogCard";
import { ArrowRight, Gamepad2, Zap, ShieldCheck, Smile } from "lucide-react";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const featuredGames = getFeaturedGames(lang);
  const recentPosts = getAllPosts(lang).slice(0, 3);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gray-50 py-20 dark:bg-gray-900 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center rounded-full border bg-white px-3 py-1 text-sm font-medium shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              {dictionary.home.new_games}
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-gray-900 dark:text-white">
              {dictionary.home.hero_title}
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              {dictionary.home.hero_subtitle}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={`/${lang}/games`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                {dictionary.home.browse_games}
              </Link>
              <Link
                href={`/${lang}/blog`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {dictionary.home.read_blog}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {dictionary.home.featured_games}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {dictionary.home.featured_subtitle}
              </p>
            </div>
            <Link href={`/${lang}/games`} className="group flex items-center font-medium text-blue-600 hover:text-blue-500">
              {dictionary.home.view_all_games}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {featuredGames.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredGames.map((game) => (
                <GameCard key={game.slug} game={game} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
              <p>{dictionary.home.no_featured}</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{dictionary.home.instant_play}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {dictionary.home.instant_play_desc}
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{dictionary.home.curated_selection}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {dictionary.home.curated_selection_desc}
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                <Smile className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{dictionary.home.always_free}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {dictionary.home.always_free_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {dictionary.home.latest_updates}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {dictionary.home.updates_subtitle}
              </p>
            </div>
            <Link href={`/${lang}/blog`} className="group flex items-center font-medium text-blue-600 hover:text-blue-500">
              {dictionary.home.view_all_posts}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
              <p>{dictionary.home.no_posts}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
