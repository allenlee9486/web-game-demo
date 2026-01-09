import { getGameBySlug, getGameSlugs } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Tag, Maximize2 } from "lucide-react";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";

interface Props {
  params: Promise<{ slug: string; lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  try {
    const game = getGameBySlug(slug, lang);
    return {
      title: `${game.title} - Play Online for Free`,
      description: game.description,
    };
  } catch (e) {
    return {
      title: "Game Not Found",
    };
  }
}

export async function generateStaticParams() {
  const slugs = getGameSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }));
}

export default async function GamePage({ params }: Props) {
  const { slug, lang } = await params;
  const dictionary = await getDictionary(lang);
  let game;
  
  try {
    game = getGameBySlug(slug, lang);
  } catch (e) {
    notFound();
  }

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Main Content Column */}
            <div className="space-y-8">
              {/* Game Container */}
              <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={game.gameUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
                    title={game.title}
                  />
                </div>
                <div className="flex items-center justify-between bg-gray-900 p-4 text-white">
                  <h1 className="text-xl font-bold">{game.title}</h1>
                  <button className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors">
                    <Maximize2 className="h-4 w-4" />
                    {dictionary.games.fullscreen}
                  </button>
                </div>
              </div>

              {/* Game Info & Description */}
              <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span className="font-medium text-gray-900 dark:text-white">{game.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={game.publishDate}>{game.publishDate}</time>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-100 dark:border-gray-800" />
                
                <MarkdownContent content={game.content} />
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="space-y-6">
              <div className="rounded-xl border bg-gray-50 p-6 dark:bg-gray-900 dark:border-gray-800">
                <h3 className="mb-4 font-bold text-lg">{dictionary.games.instructions}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dictionary.games.instructions_desc}
                </p>
              </div>
              
              <div className="rounded-xl border bg-gray-50 p-6 text-center dark:bg-gray-900 dark:border-gray-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {dictionary.games.ad_space}
                </span>
                <div className="mt-4 flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800">
                  <span className="text-gray-400">Ad 300x250</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
