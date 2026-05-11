import { getGameBySlug, getGameSlugs, getAllGames } from "@/lib/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, i18n } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { GamePlayer } from "@/components/home/GamePlayer";
import { GameListSidebar } from "@/components/home/GameListSidebar";
import { GameListBottom } from "@/components/home/GameListBottom";
import { GameCategories } from "@/components/home/GameCategories";
import { GameTabs } from "@/components/home/GameTabs";
import { GameComments } from "@/components/home/GameComments";
import { GameVisitRecorder } from "@/components/GameVisitRecorder";
import Script from "next/script";

interface Props {
  params: Promise<{ slug: string; lang: Locale }>;
}

const domain = 'https://klifur.online';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  try {
    const game = getGameBySlug(slug, lang);
    const isDefault = lang === i18n.defaultLocale;
    const canonical = isDefault 
      ? `${domain}/games/${slug}` 
      : `${domain}/${lang}/games/${slug}`;

    return {
      title: `${game.title} - Play ${game.title} Online for Free`,
      description: game.description,
      alternates: {
        canonical,
      }
    };
  } catch {
    return {
      title: "Game Not Found",
    };
  }
}

export async function generateStaticParams() {
  const slugs = getGameSlugs();
  const paths: { slug: string; lang: string }[] = [];
  
  i18n.locales.forEach(lang => {
    slugs.forEach(slug => {
      paths.push({
        slug: slug.replace(/\.md$/, ""),
        lang: lang as string
      });
    });
  });
  
  return paths;
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
  // Get 12 games for the bottom section
  const bottomGames = allGames.slice(0, 12);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.description,
    "image": `${domain}${game.thumbnail}`,
    "url": `${domain}/${lang}/games/${game.slug}`,
    "genre": game.category,
    "playMode": "Multiplayer",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": game.faq?.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <Script
        id="game-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {game.faq && game.faq.length > 0 && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <GameVisitRecorder slug={game.slug} />
      {/* Game Area (Player + Bottom) */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col gap-6">
            {/* Main Game Player */}
            <div className="w-full">
               <GamePlayer game={game} locale={lang} dictionary={dictionary} />
            </div>
          </div>

          {/* Bottom: New Games (5 cols) */}
          <div className="mt-8">
             <GameListBottom 
                games={bottomGames} 
                locale={lang} 
                title={dictionary.games.other_games} 
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
