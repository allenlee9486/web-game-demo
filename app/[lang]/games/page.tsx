import { getAllGames } from "@/lib/api";
import { getAllCategories } from "@/lib/categories";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { GameBrowser } from "@/components/games/GameBrowser";

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
  const categories = getAllCategories();

  return <GameBrowser initialGames={allGames} categories={categories} lang={lang} dictionary={dictionary} />;
}

