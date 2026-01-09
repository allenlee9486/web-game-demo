'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n } from '@/i18n-config';

export default function LocaleSwitcher() {
  const pathName = usePathname();
  
  const redirectedPathName = (locale: string) => {
    if (!pathName) return `/${locale}`;
    const segments = pathName.split('/');
    // segments[0] is empty string because path starts with /
    // segments[1] is the locale
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="flex gap-3 ml-4 items-center border-l pl-4 border-gray-200 dark:border-gray-700">
      {i18n.locales.map((locale) => {
        return (
          <Link
            key={locale}
            href={redirectedPathName(locale)}
            className="text-sm font-semibold uppercase hover:text-blue-600 transition-colors"
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
