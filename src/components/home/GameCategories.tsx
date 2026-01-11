import Link from "next/link";
import { Game } from "@/types";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface GameCategoriesProps {
  game: Game;
  locale: string;
}

export const GameCategories = ({ game, locale }: GameCategoriesProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <Link 
          href={getLocalizedPath(`/games?category=${game.category}`, locale as Locale)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {game.category} Games
        </Link>
      </div>
    </div>
  );
};
