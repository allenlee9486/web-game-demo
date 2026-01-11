import { getGameBySlug, getGameSlugs, getAllGames } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { GamePlayer } from "@/components/home/GamePlayer";
import { GameListSidebar } from "@/components/home/GameListSidebar";
import { GameListBottom } from "@/components/home/GameListBottom";
import { GameCategories } from "@/components/home/GameCategories";
import { GameTabs } from "@/components/home/GameTabs";
import { GameComments } from "@/components/home/GameComments";
import { GameVisitRecorder } from "@/components/GameVisitRecorder";

interface Props {
  params: Promise<{ slug: string; lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  try {
    const game = getGameBySlug(slug, lang);
    return {
      title: `${game.title}: Free Pokémon Tower Defense Game Online`,
      description: game.description,
    };
  } catch {
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
  } catch {
    notFound();
  }

  const allGames = getAllGames(lang).filter(g => g.slug !== game.slug);
  const sidebarGames = allGames.slice(0, 6);
  const bottomGames = allGames.slice(6, 11);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 min-h-screen">
      <GameVisitRecorder slug={game.slug} />
      {/* Game Area (Player + Sidebar + Bottom) */}
      <div className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Main Game Player */}
            <div className="w-full lg:w-3/4">
               <GamePlayer game={game} locale={lang} dictionary={dictionary} />
            </div>

            {/* Right: Sidebar Games (2 cols) */}
            <div className="w-full lg:w-1/4">
               <GameListSidebar 
                  games={sidebarGames} 
                  locale={lang} 
                  title="People also play" 
               />
            </div>
          </div>

          {/* Bottom: New Games (5 cols) */}
          <div className="mt-8">
             <GameListBottom 
                games={bottomGames.length > 0 ? bottomGames : sidebarGames.slice(0, 5)} 
                locale={lang} 
                title="More Games" 
             />
          </div>

        </div>
      </div>

      {/* Game Details & Comments Area */}
      <div className="container mx-auto px-4 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
               <GameCategories game={game} locale={lang} />
               <GameTabs game={game} />
            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:col-span-1">
               <GameComments slug={game.slug} />
            </div>
         </div>
      </div>
    </div>
  );
}
