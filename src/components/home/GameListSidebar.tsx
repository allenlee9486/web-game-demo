import { Game } from "@/types";
import { GameCardSmall } from "./GameCardSmall";

interface GameListSidebarProps {
  games: Game[];
  locale: string;
  title: string;
}

export const GameListSidebar = ({ games, locale, title }: GameListSidebarProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {games.map((game) => (
          <GameCardSmall key={game.slug} game={game} locale={locale} />
        ))}
      </div>
    </div>
  );
};
