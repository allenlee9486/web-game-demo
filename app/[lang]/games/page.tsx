import { getAllGames } from "@/lib/api";
import { GameCard } from "@/components/GameCard";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";

export const metadata: Metadata = {
  title: "All Games - GamePortal",
  description: "Browse our collection of free-to-play web games.",
};

export default async function GamesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const allGames = getAllGames(lang);
  
  // Get unique categories
  const categories = Array.from(new Set(allGames.map(game => game.category)));

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{dictionary.games.all_games}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {dictionary.games.browse_collection.replace('{count}', allGames.length.toString())}
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {dictionary.games.category_all}
            </button>
            {categories.map(category => (
              <button key={category} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allGames.map((game) => (
              <GameCard key={game.slug} game={game} lang={lang} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
