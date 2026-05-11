import { MetadataRoute } from 'next';
import { getGameSlugs } from '@/lib/api';
import { i18n } from '@/i18n-config';

const domain = 'https://klifur.online';

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getGameSlugs().map(s => s.replace(/\.md$/, ''));
  const locales = i18n.locales;

  const routes = ['', '/games', '/about', '/privacy', '/terms', '/contact', '/copyright'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes for each locale
  locales.forEach((lang) => {
    routes.forEach((route) => {
      const isDefault = lang === i18n.defaultLocale;
      const url = isDefault 
        ? `${domain}${route}` 
        : `${domain}/${lang}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });

    // Game routes for each locale
    slugs.forEach((slug) => {
      const isDefault = lang === i18n.defaultLocale;
      const url = isDefault 
        ? `${domain}/games/${slug}` 
        : `${domain}/${lang}/games/${slug}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return sitemapEntries;
}

// Next.js generates the sitemap at /sitemap.xml by default.
// If you want to support /zh/sitemap.xml etc., you need to use a dynamic route or rewrite.
// However, the standard approach is a single sitemap.xml at the root that lists all localized URLs.
