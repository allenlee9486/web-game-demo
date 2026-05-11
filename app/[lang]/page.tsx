import { getGameBySlug, getAllGames } from "@/lib/api";
import { Locale, i18n } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale as string }));
}

import { getDictionary } from "@/dictionaries/get-dictionary";
import { Game } from "@/types";
import { GamePlayer } from "@/components/home/GamePlayer";
import { GameFeatures } from "@/components/home/GameFeatures";
import { GameComments } from "@/components/home/GameComments";
import { GameListBottom } from "@/components/home/GameListBottom";
import { GameCategories } from "@/components/home/GameCategories";
import { GameTabs } from "@/components/home/GameTabs";
import { GameVisitRecorder } from "@/components/GameVisitRecorder";
import fs from 'fs';
import path from 'path';
import { Metadata } from "next";

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "GamePortal - Free Online Games",
    description: "Play the best free online games.",
  };
}

export default async function Home({ params }: Props) {
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
  const bottomGames = otherGames.slice(0, 5);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
      <GameVisitRecorder slug={mainGame.slug} />
      
      {/* 1. Hero / Main Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Play <span className="text-green-600">{mainGame.title}</span> Online
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the ultimate browser-based gaming with realistic physics and addictive challenges.
          </p>
        </div>
      </div>

      {/* 2. Game Area (Player + Bottom) */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col gap-6">
            {/* Main Game Player */}
            <div className="w-full">
               <GamePlayer game={mainGame} locale={lang} dictionary={dictionary} />
            </div>
          </div>

          {/* Bottom: New Games (5 cols) */}
          <div className="mt-8">
             <GameListBottom 
                games={bottomGames} 
                locale={lang} 
                title="New & Popular Games" 
             />
          </div>

        </div>
      </div>

      {/* 3. Game Details & Comments Area */}
      <div className="container mx-auto px-4 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-12">
               <GameCategories game={mainGame} locale={lang} />
               <GameTabs game={mainGame} />
            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:col-span-1">
               <GameComments slug={mainGame.slug} />
            </div>
         </div>
      </div>
    </div>
  );
}