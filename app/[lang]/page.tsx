import { getGameBySlug, getAllGames } from "@/lib/api";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { Game } from "@/types";
import { GamePlayer } from "@/components/home/GamePlayer";
import { GameFeatures } from "@/components/home/GameFeatures";
import { GameComments } from "@/components/home/GameComments";
import { GameListSidebar } from "@/components/home/GameListSidebar";
import { GameListBottom } from "@/components/home/GameListBottom";
import { GameCategories } from "@/components/home/GameCategories";
import { GameTabs } from "@/components/home/GameTabs";
import fs from 'fs';
import path from 'path';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
  // Fetch all games for lists
  const allGames = getAllGames(lang);

  // Determine featured game slug from settings
  let featuredSlug = 'pokepath-td'; // default
  try {
    const configPath = path.join(process.cwd(), 'content/config/settings.json');
    if (fs.existsSync(configPath)) {
      const settings = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (settings.featuredGameSlug) {
        featuredSlug = settings.featuredGameSlug;
      }
    }
  } catch (e) {
    console.warn("Failed to read settings.json", e);
  }

  // Fetch main featured game
  let mainGame: Game | undefined;
  try {
    mainGame = getGameBySlug(featuredSlug, lang);
  } catch {
    console.warn(`Main game '${featuredSlug}' not found, falling back to first featured game.`);
    if (allGames.length > 0) {
      mainGame = allGames[0];
    }
  }

  // Fallback view if no game at all
  if (!mainGame) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-white dark:bg-gray-950">
         <div className="text-center">
           <h1 className="text-2xl font-bold mb-4">Welcome to Game Portal</h1>
           <p className="text-gray-500">No games found. Please add games in Admin panel.</p>
         </div>
      </div>
    );
  }

  // Prepare lists (exclude main game if possible to avoid dupes, or just show all)
  const otherGames = allGames.filter(g => g.slug !== mainGame?.slug);
  const sidebarGames = otherGames.slice(0, 6); // 2 cols * 3 rows = 6 games
  const bottomGames = otherGames.slice(6, 11); // 5 games

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
      {/* 1. Header is in Layout */}

      {/* 2. Game Area (Player + Sidebar + Bottom) */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Game Player */}
            <div className="w-full lg:w-3/4">
               <GamePlayer game={mainGame} locale={lang} dictionary={dictionary} />
            </div>

            {/* Right: Sidebar Games (2 cols) */}
            <div className="w-full lg:w-1/4">
               <GameListSidebar 
                  games={sidebarGames} 
                  locale={lang} 
                  title="Popular Games" 
               />
            </div>
          </div>

          {/* Bottom: New Games (5 cols) */}
          <div className="mt-8">
             <GameListBottom 
                games={bottomGames.length > 0 ? bottomGames : sidebarGames.slice(0, 5)} 
                locale={lang} 
                title="New Games" 
             />
          </div>

        </div>
      </div>

      {/* 3. Features (Optional: Keep or Remove? User didn't explicitly say remove, but replaced with new layout below. I'll keep it as a separator for now or remove if it conflicts. I'll remove it to be cleaner as per design) */}
      
      {/* 4. Game Details & Comments Area (New Layout) */}
      <div className="container mx-auto px-4 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
               <GameCategories game={mainGame} locale={lang} />
               <GameTabs game={mainGame} />
            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:col-span-1">
               <GameComments slug={mainGame.slug} />
            </div>
         </div>
      </div>

      {/* 5. Footer is in Layout */}
    </div>
  );
}
