import { Game } from "@/types";
import { Gamepad2, Play, Maximize2, ExternalLink } from "lucide-react";
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
      <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="relative aspect-video w-full">
          {game.gameUrl ? (
            <>
              <iframe
                src={game.gameUrl}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen; geolocation; microphone; camera; midi"
                title={game.title}
              />
              {/* Optional: Overlay message for blocked iframes if needed, 
                  but we can't reliably detect it. Instead, we provide an alternative play button below. */}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Gamepad2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500">Game Loading...</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between bg-green-50 p-4 border-t border-green-100 text-gray-900 gap-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Play className="h-5 w-5 fill-green-600 text-green-600" />
            {game.title}
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Fallback for blocked iframes */}
            <a 
              href={game.gameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors shadow-sm"
              title="If the game doesn't load, try opening it in a new tab"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>

            <Link 
              href={getLocalizedPath(`/games/${game.slug}`, locale as Locale)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm"
            >
              <Maximize2 className="h-4 w-4" />
              {dictionary.games.fullscreen}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Troubleshooting hint */}
      <p className="mt-4 text-xs text-gray-400 text-center italic">
        Tip: If the game area is blank, the source site might prevent embedding. Click "Open in New Tab" to play.
      </p>
    </div>
  );
};
