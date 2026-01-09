import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { Locale } from "@/i18n-config";
import LocaleSwitcher from "./LocaleSwitcher";

interface NavbarProps {
  lang: Locale;
  dictionary: {
    common: {
      home: string;
      games: string;
      blog: string;
    };
  };
}

export function Navbar({ lang, dictionary }: NavbarProps) {
  return (
    <nav className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-bold text-xl">
          <Gamepad2 className="h-6 w-6 text-blue-600" />
          <span>GamePortal</span>
        </Link>
        
        <div className="flex items-center">
          <div className="flex gap-6 text-sm font-medium">
            <Link href={`/${lang}`} className="hover:text-blue-600 transition-colors">
              {dictionary.common.home}
            </Link>
            <Link href={`/${lang}/games`} className="hover:text-blue-600 transition-colors">
              {dictionary.common.games}
            </Link>
            <Link href={`/${lang}/blog`} className="hover:text-blue-600 transition-colors">
              {dictionary.common.blog}
            </Link>
          </div>
          <LocaleSwitcher />
        </div>
      </div>
    </nav>
  );
}
