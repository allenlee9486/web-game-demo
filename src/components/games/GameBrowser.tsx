'use client';

import { useState, useEffect } from "react";
import { Search, LayoutGrid, TrendingUp, Star, Clock } from "lucide-react";
import Link from "next/link";
import { Game, Category } from "@/types";
import { GameCard } from "@/components/GameCard";
import { getGameStats, AllGameStats } from "@/lib/gameStats";
import { Locale } from "@/i18n-config";

interface GameBrowserProps {
  initialGames: Game[];
  categories: Category[];
  lang: Locale;
  dictionary: any;
}

type FilterType = 'all' | 'popular' | 'new' | 'recent' | 'category';

export function GameBrowser({ initialGames, categories, lang, dictionary }: GameBrowserProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [localStats, setLocalStats] = useState<AllGameStats>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocalStats(getGameStats());
    setMounted(true);
    
    // Check URL params for initial filter
    const params = new URLSearchParams(window.location.search);
    const filterParam = params.get('filter');
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      setFilter('category');
      setActiveCategory(categoryParam);
    } else if (filterParam === 'popular' || filterParam === 'new' || filterParam === 'recent') {
      setFilter(filterParam);
    }
  }, []);

  const getFilteredGames = () => {
    let filtered = [...initialGames];

    // 1. Apply Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q)
      );
    }

    // 2. Apply Filter/Sort
    switch (filter) {
      case 'popular':
        // Sort by local click count desc
        filtered.sort((a, b) => {
          const clicksA = localStats[a.slug]?.clicks || 0;
          const clicksB = localStats[b.slug]?.clicks || 0;
          return clicksB - clicksA;
        });
        break;
      case 'new':
        // Sort by publish date desc (closest to now)
        filtered.sort((a, b) => {
          const dateA = new Date(a.publishDate || 0).getTime();
          const dateB = new Date(b.publishDate || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'recent':
        // Filter only games in local stats and sort by lastPlayed
        filtered = filtered.filter(g => localStats[g.slug]?.lastPlayed);
        filtered.sort((a, b) => {
          const timeA = localStats[a.slug]?.lastPlayed || 0;
          const timeB = localStats[b.slug]?.lastPlayed || 0;
          return timeB - timeA;
        });
        break;
      case 'category':
        if (activeCategory) {
          filtered = filtered.filter(g => g.category === activeCategory);
        }
        break;
      case 'all':
      default:
        // Default: Sort by publish date desc
        filtered.sort((a, b) => {
          const dateA = new Date(a.publishDate || 0).getTime();
          const dateB = new Date(b.publishDate || 0).getTime();
          return dateB - dateA;
        });
        break;
    }

    return filtered;
  };

  const displayedGames = getFilteredGames();

  const handleFilterChange = (newFilter: FilterType, category?: string) => {
    setFilter(newFilter);
    if (category) setActiveCategory(category);
    else setActiveCategory('');
    
    // Update URL without reload
    const url = new URL(window.location.href);
    if (newFilter === 'all') {
      url.searchParams.delete('filter');
      url.searchParams.delete('category');
    } else if (newFilter === 'category' && category) {
      url.searchParams.set('filter', 'category');
      url.searchParams.set('category', category);
    } else {
      url.searchParams.set('filter', newFilter);
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url);
  };

  if (!mounted) {
    return null; // or loading skeleton
  }

  const getPageTitle = () => {
    switch (filter) {
      case 'popular': return 'Popular Games';
      case 'new': return 'New Games';
      case 'recent': return 'Recently Played';
      case 'category': return activeCategory || 'Games';
      default: return dictionary.games.all_games;
    }
  };

  const getPageDescription = () => {
    if (filter === 'recent') return 'Games you have played recently.';
    if (filter === 'popular') return 'Most popular games based on your activity.';
    if (filter === 'new') return 'Latest additions to our collection.';
    return dictionary.games.browse_collection.replace('{count}', displayedGames.length.toString());
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="p-6 sticky top-0 h-screen overflow-y-auto space-y-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search games..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Main Menu */}
          <nav className="space-y-1">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <LayoutGrid className="h-5 w-5" />
              <span>{dictionary.games.all_games}</span>
            </button>
            <button 
              onClick={() => handleFilterChange('popular')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${filter === 'popular' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Popular Games</span>
            </button>
            <button 
              onClick={() => handleFilterChange('new')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${filter === 'new' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Star className="h-5 w-5" />
              <span>New Games</span>
            </button>
            <button 
              onClick={() => handleFilterChange('recent')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium transition-colors ${filter === 'recent' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <span>Recently Played</span>
              </div>
              {Object.keys(localStats).length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {Object.keys(localStats).length}
                </span>
              )}
            </button>
          </nav>

          {/* Categories */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <button 
                onClick={() => handleFilterChange('all')}
                className={`w-full text-left px-4 py-2 text-sm rounded-lg font-medium transition-colors ${filter === 'all' && !activeCategory ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button 
                  key={category.id} 
                  onClick={() => handleFilterChange('category', category.name)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${filter === 'category' && activeCategory === category.name ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {getPageDescription()}
            </p>
            <div className="mt-4 text-sm font-medium text-gray-500">
              {displayedGames.length} games found
            </div>
          </div>
          
          {/* Game Grid */}
          {displayedGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {displayedGames.map((game) => (
                <GameCard key={game.slug} game={game} lang={lang} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No games found.</p>
                {filter === 'recent' && (
                  <p className="text-gray-400 text-sm mt-2">Start playing games to see them here!</p>
                )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
