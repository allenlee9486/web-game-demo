import { Locale } from "@/i18n-config";
import Link from "next/link";

interface FooterProps {
  lang: Locale;
  dictionary: {
    common: {
      about: string;
      games: string;
      blog: string;
      privacy: string;
      rights_reserved: string;
    };
  };
}

export function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-950 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">GamePortal</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your destination for the best free-to-play web games. Play instantly in your browser without downloads.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">{dictionary.common.about}</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href={`/${lang}/games`} className="hover:text-blue-600">
                  {dictionary.common.games}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-blue-600">
                  {dictionary.common.blog}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  {dictionary.common.privacy}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Follow us for updates on new games and features.
            </p>
          </div>
        </div>
        <div className="border-t dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} GamePortal. {dictionary.common.rights_reserved}
        </div>
      </div>
    </footer>
  );
}
