'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, localeConfig, Locale } from '@/i18n-config';
import { Globe } from 'lucide-react';

export default function FooterLocaleSwitcher() {
  const pathName = usePathname();

  // Get current locale from pathname
  const segment = pathName?.split('/')[1];
  const currentLocale = (i18n.locales.includes(segment as Locale) ? segment : i18n.defaultLocale) as Locale;

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split('/');
    const isCurrentPathHasLocale = i18n.locales.includes(segments[1] as Locale);

    if (isCurrentPathHasLocale) {
      if (locale === i18n.defaultLocale) {
        const newSegments = [...segments];
        newSegments.splice(1, 1);
        return newSegments.join('/') || '/';
      }
      const newSegments = [...segments];
      newSegments[1] = locale;
      return newSegments.join('/');
    } else {
      if (locale === i18n.defaultLocale) {
        return pathName;
      }
      return `/${locale}${pathName === '/' ? '' : pathName}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-white/60" />
      </div>
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={redirectedPathName(locale)}
          className={`flex items-center gap-1.5 transition-colors ${
            currentLocale === locale
              ? "text-white font-medium underline underline-offset-4 decoration-white/30"
              : "hover:text-white"
          }`}
        >
          <span className="text-base">{localeConfig[locale].flag}</span>
          <span>{localeConfig[locale].name}</span>
        </Link>
      ))}
    </div>
  );
}
