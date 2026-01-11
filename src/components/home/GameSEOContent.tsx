import { MarkdownContent } from "@/components/MarkdownContent";
import { Game } from "@/types";
import { Tag, Calendar } from "lucide-react";

interface GameSEOContentProps {
  game: Game;
}

export const GameSEOContent = ({ game }: GameSEOContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto rounded-xl bg-white p-6 text-gray-900 shadow-sm dark:bg-gray-900 dark:text-gray-100">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span className="font-medium text-gray-900 dark:text-white">{game.category || 'Game'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={game.publishDate}>{game.publishDate}</time>
          </div>
        </div>
        
        <hr className="my-6 border-gray-100 dark:border-gray-800" />
        
        <MarkdownContent content={game.content} />
      </div>
    </div>
  );
};
