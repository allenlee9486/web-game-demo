import fs from 'fs';
import path from 'path';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface SiteSettings {
  logo?: string;
  navItems: NavItem[];
  featuredGameSlug?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  logo: '',
  navItems: [
      { id: '1', label: 'Home', href: '/' },
      { id: '2', label: 'Games', href: '/games' },
      { id: '3', label: 'Blog', href: '/blog' }
  ],
  featuredGameSlug: ''
};

const configPath = path.join(process.cwd(), 'content/config/settings.json');

export function getSiteSettings(): SiteSettings {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const settings = JSON.parse(content);
      return {
        logo: settings.logo || DEFAULT_SETTINGS.logo,
        navItems: settings.navItems || DEFAULT_SETTINGS.navItems,
        featuredGameSlug: settings.featuredGameSlug || DEFAULT_SETTINGS.featuredGameSlug
      };
    }
  } catch (e) {
    console.error('Failed to read site settings', e);
  }
  
  // Default settings
  return DEFAULT_SETTINGS;
}
