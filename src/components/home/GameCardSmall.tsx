import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types";
import { Locale } from "@/i18n-config";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface GameCardSmallProps {
  game: Game;
  locale: string;
}

export const GameCardSmall = ({ game, locale }: GameCardSmallProps) => {
  return (
    <Link 
      href={getLocalizedPath(`/games/${game.slug}`, locale as Locale)}
      className="group block overflow-hidden rounded-lg bg-gray-50 border border-gray-100 hover:ring-2 hover:ring-[#3c9d60] transition-all shadow-sm hover:shadow-md"
    >
      <div className="relative aspect-video w-full">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-2">
        <h3 className="truncate text-sm font-medium text-gray-800 group-hover:text-[#3c9d60]">
          {game.title}
        </h3>
      </div>
    </Link>
  );
};
