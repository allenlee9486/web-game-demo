import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Locale, i18n } from "@/i18n-config";
import LocaleSwitcher from "./LocaleSwitcher";
import { SiteSettings } from "@/lib/settings";
import { getLocalizedPath } from "@/lib/i18n-utils";

interface NavbarProps {
  lang: Locale;
  dictionary: {
    common: {
      home: string;
      games: string;
      blog: string;
    };
  };
  settings: SiteSettings;
}

export function Navbar({ lang, dictionary, settings }: NavbarProps) {
  const isDefault = lang === i18n.defaultLocale;
  const homeHref = isDefault ? '/' : `/${lang}`;

  return (
    <nav className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2 font-bold text-xl">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <>
              <Gamepad2 className="h-6 w-6 text-blue-600" />
              <span>GamePortal</span>
            </>
          )}
        </Link>
        
        <div className="flex items-center">
          <div className="flex gap-6 text-sm font-medium">
            {settings.navItems.map((item) => (
              <Link 
                key={item.id} 
                href={getLocalizedPath(item.href, lang)} 
                className="hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
