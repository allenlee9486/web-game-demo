import { Game } from "@/types";
import { Gamepad2, Play, Maximize2 } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface GamePlayerProps {
  game: Game;
  locale: string;
  dictionary: any;
}

export const GamePlayer = ({ game, locale, dictionary }: GamePlayerProps) => {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
        <div className="relative aspect-video w-full">
          {game.gameUrl ? (
            <iframe
              src={game.gameUrl}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
              title={game.title}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <Gamepad2 className="mx-auto h-16 w-16 opacity-50 mb-4" />
                <p className="text-gray-400">Game Loading...</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between bg-gray-800/50 p-4 backdrop-blur-sm text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Play className="h-5 w-5 fill-green-500 text-green-500" />
            {game.title}
          </h1>
          <Link 
            href={getLocalizedPath(`/games/${game.slug}`, locale as Locale)}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
            {dictionary.games.fullscreen}
          </Link>
        </div>
      </div>
    </div>
  );
};
