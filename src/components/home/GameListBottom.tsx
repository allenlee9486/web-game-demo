import { Game } from "@/types";
import { GameCardSmall } from "./GameCardSmall";

interface GameListBottomProps {
  games: Game[];
  locale: string;
  title: string;
}

export const GameListBottom = ({ games, locale, title }: GameListBottomProps) => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {games.map((game) => (
          <GameCardSmall key={game.slug} game={game} locale={locale} />
        ))}
      </div>
    </div>
  );
};
