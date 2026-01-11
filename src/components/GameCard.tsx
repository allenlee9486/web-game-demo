import Link from "next/link";
import { Game } from "@/types";
import { Play, Gamepad2 } from "lucide-react";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface GameCardProps {
  game: Game;
  lang: Locale;
}

export function GameCard({ game, lang }: GameCardProps) {
  return (
    <Link href={getLocalizedPath(`/games/${game.slug}`, lang)} className="group block h-full">
      <div className="h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Placeholder for when image is missing or loading */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <Gamepad2 className="h-12 w-12 opacity-20" />
          </div>
          
          {game.thumbnail && (
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                 style={{ backgroundImage: `url(${game.thumbnail})` }} />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/40 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-white p-3 text-black">
              <Play className="h-6 w-6 fill-current" />
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {game.category}
            </span>
          </div>
          <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
            {game.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
