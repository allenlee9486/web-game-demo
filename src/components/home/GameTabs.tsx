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

  // Find specific modules or data for sections
  const findModule = (id: string) => game.modules?.find(m => m.id === id);
  const videoModule = game.modules?.find(m => m.type === 'video');
  const faqModule = game.modules?.find(m => m.type === 'faq');

  const videoUrl = videoModule?.videoUrl || (game as any).videoUrl;

  const tabs = [
    { id: "overview", label: "Game Overview", icon: Gamepad2 },
    ...(videoUrl ? [{ id: "video", label: "Video", icon: Video }] : []),
    { id: "how-to-play", label: "How to Play", icon: BookOpen },
    { id: "features", label: "Features", icon: Lightbulb },
    { id: "why", label: "Why Play?", icon: Heart },
    { id: "faq", label: "FAQ", icon: CircleHelp },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
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
                    ? "text-green-600 bg-green-50 shadow-sm ring-1 ring-green-100" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-green-600" : "text-gray-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stacked Content Sections */}
      <div className="space-y-8">
        {/* 1. Game Overview */}
        <div id="overview" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-blue-600" />
              </div>
              What is {game.title}?
           </h2>
           <div className="flex flex-col gap-8">
              {(game.thumbnail && !(game as any).hideWhatIsImage) && (
                <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <img 
                    src={game.thumbnail} 
                    alt={`${game.title} overview`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <div className="prose max-w-none text-gray-600">
                <MarkdownContent content={game.content || `Learn all about ${game.title}, its unique mechanics, and what makes it one of the best games in its genre.`} />
              </div>
           </div>
        </div>

        {/* 2. Video */}
        {videoUrl && (
          <div id="video" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                    <Video className="w-6 h-6 text-red-600" />
                </div>
                {videoModule?.title || "Gameplay Video"}
             </h2>
             <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-100">
                <iframe 
                  src={videoUrl}
                  className="w-full h-full"
                  title={videoModule?.title || `Watch ${game.title} in Action`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
             </div>
          </div>
        )}

        {/* 3. How to Play */}
        <div id="how-to-play" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              How to Play {game.title}
           </h2>
           <div className="prose max-w-none text-gray-600">
              <MarkdownContent content={game.howToPlay || findModule('how-to-play')?.content || "We are currently preparing a detailed guide on how to play this game. Check back soon for controls and strategies!"} />
           </div>
        </div>

        {/* 4. Features */}
        <div id="features" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              Key Features
           </h2>
           <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Image - Left on Desktop */}
              {(findModule('features')?.image || (game as any).featuresImage) && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                   <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
                      <img 
                        src={findModule('features')?.image || (game as any).featuresImage} 
                        alt={`${game.title} Features`}
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                      />
                   </div>
                </div>
              )}
              
              {/* Text - Right on Desktop */}
              <div className={`w-full ${(findModule('features')?.image || (game as any).featuresImage) ? 'md:w-2/3' : ''} prose max-w-none text-gray-600`}>
                 <MarkdownContent content={findModule('features')?.content || "Discover the exciting features that set this game apart, from unique power-ups to challenging levels."} />
              </div>
           </div>
        </div>

        {/* 5. Why Play */}
        <div id="why" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-600" />
              </div>
              Why Play {game.title}?
           </h2>
           <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Text - Left on Desktop */}
              <div className={`w-full ${(findModule('why-play')?.image || (game as any).whyPlayImage) ? 'md:w-2/3' : ''} prose max-w-none text-gray-600`}>
                 <MarkdownContent content={game.whyPlay || findModule('why-play')?.content || "Find out why thousands of players enjoy this game every day and what makes it so addictive."} />
              </div>

              {/* Image - Right on Desktop */}
              {(findModule('why-play')?.image || (game as any).whyPlayImage) && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                   <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-inner">
                      <img 
                        src={findModule('why-play')?.image || (game as any).whyPlayImage} 
                        alt={`Why Play ${game.title}`}
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                      />
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* 6. FAQ */}
        <div id="faq" className="scroll-mt-28 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                  <CircleHelp className="w-6 h-6 text-purple-600" />
              </div>
              Frequently Asked Questions
           </h2>
           <div className="space-y-4">
              {(faqModule?.items || game.faq || []).length > 0 ? (
                (faqModule?.items || game.faq || []).map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <h3 className="font-bold text-gray-900 mb-2">Q: {item.question}</h3>
                    <p className="text-gray-600">A: {item.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No questions answered yet. Have a question? Contact us!</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
