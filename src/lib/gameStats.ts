'use client';

export interface GameStats {
  clicks: number;
  lastPlayed: number;
}

export interface AllGameStats {
  [slug: string]: GameStats;
}

const STORAGE_KEY = 'game_portal_stats';

export const getGameStats = (): AllGameStats => {
  if (typeof window === 'undefined') return {};
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : {};
  } catch {
    return {};
  }
};

export const recordGameVisit = (slug: string) => {
  if (typeof window === 'undefined') return;
  try {
    const stats = getGameStats();
    const current = stats[slug] || { clicks: 0, lastPlayed: 0 };
    
    stats[slug] = {
      clicks: current.clicks + 1,
      lastPlayed: Date.now(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to record game visit', e);
  }
};
