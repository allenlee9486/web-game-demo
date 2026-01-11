'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { i18n, localeConfig, Locale } from '@/i18n-config';
import { ChevronDown, Globe } from 'lucide-react';

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale from pathname
  // Handle case where pathname might be just "/" or missing locale
  const segment = pathName?.split('/')[1];
  const currentLocale = (i18n.locales.includes(segment as Locale) ? segment : i18n.defaultLocale) as Locale;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Globe className="h-4 w-4" />
        <span>{localeConfig[currentLocale]?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-800">
          {i18n.locales.map((locale) => (
            <Link
              key={locale}
              href={redirectedPathName(locale)}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                currentLocale === locale 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{localeConfig[locale].flag}</span>
              <span>{localeConfig[locale].name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
