"use client";

import { useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Game } from "@/types";
import { Gamepad2, BookOpen, Lightbulb, Heart, CircleHelp, FileText, Video, LucideIcon } from "lucide-react";

interface GameTabsProps {
  game: Game;
}

export const GameTabs = ({ game }: GameTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Helper to determine icon based on title or type
  const getIconAndColor = (title: string, type: string) => {
    const lowerTitle = title.toLowerCase();
    
    if (type === 'video' || lowerTitle.includes('video')) {
      return { icon: Video, colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-100 dark:bg-red-900/30' };
    }
    if (type === 'faq' || lowerTitle.includes('faq')) {
      return { icon: CircleHelp, colorClass: 'text-purple-600 dark:text-purple-400', bgClass: 'bg-purple-100 dark:bg-purple-900/30' };
    }
    if (lowerTitle.includes('how to play')) {
      return { icon: BookOpen, colorClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-100 dark:bg-green-900/30' };
    }
    if (lowerTitle.includes('tips') || lowerTitle.includes('trick')) {
      return { icon: Lightbulb, colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-100 dark:bg-amber-900/30' };
    }
    if (lowerTitle.includes('why') || lowerTitle.includes('reason')) {
      return { icon: Heart, colorClass: 'text-red-600 dark:text-red-400', bgClass: 'bg-red-100 dark:bg-red-900/30' };
    }
    
    return { icon: FileText, colorClass: 'text-blue-600 dark:text-blue-400', bgClass: 'bg-blue-100 dark:bg-blue-900/30' };
  };

  const tabs = [
    { id: "overview", label: "Game Overview", icon: Gamepad2 },
    ...(game.modules || []).map(module => ({
      id: module.id,
      label: module.title,
      icon: getIconAndColor(module.title, module.type).icon
    }))
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Sticky Tabs Navigation */}
      <div className="sticky top-4 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none flex-1 justify-center
                  ${isActive 
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/50" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Content Sections */}
      <div className="space-y-8">
        {/* Game Overview */}
        <div id="overview" className="scroll-mt-28 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Play {game.title}
           </h2>
           <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <MarkdownContent content={game.content} />
           </div>
        </div>
        
        {/* Dynamic Modules */}
        {(game.modules || []).map(module => {
          const { icon: Icon, colorClass, bgClass } = getIconAndColor(module.title, module.type);
          
          return (
            <div key={module.id} id={module.id} className="scroll-mt-28 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 md:p-8">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${bgClass}`}>
                      <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                  {module.title}
               </h2>
               
               {module.type === 'markdown' && (
                 <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    {module.content ? (
                      <MarkdownContent content={module.content} />
                    ) : (
                      <p className="text-gray-500 italic">No content available.</p>
                    )}
                 </div>
               )}

               {module.type === 'faq' && (
                 <div className="space-y-4">
                    {module.items && module.items.length > 0 ? (
                      module.items.map((item, index) => (
                          <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.question}</h3>
                              <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                          </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No questions yet.</p>
                    )}
                 </div>
               )}

               {module.type === 'video' && (
                 <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black">
                   {module.videoUrl ? (
                     <iframe
                       src={module.videoUrl}
                       title={module.title}
                       className="w-full h-full"
                       frameBorder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     />
                   ) : (
                     <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                       <p>No video URL provided</p>
                     </div>
                   )}
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
