import { Locale, i18n } from "@/i18n-config";
import Link from "next/link";
import FooterLocaleSwitcher from "./FooterLocaleSwitcher";
import { SiteSettings } from "@/lib/settings";
import { getLocalizedPath } from "@/lib/i18n-utils";

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
  settings: SiteSettings;
}

export function Footer({ lang, dictionary, settings }: FooterProps) {
  const isDefault = lang === i18n.defaultLocale;
  const gamesHref = isDefault ? '/games' : `/${lang}/games`;
  const blogHref = isDefault ? '/blog' : `/${lang}/blog`;

  return (
    <footer className="border-t border-[#348a54] bg-[#3c9d60] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                "GamePortal"
              )}
            </h3>
            <p className="text-sm text-white/80">
              Your destination for the best free-to-play web games. Play instantly in your browser without downloads.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">{dictionary.common.about}</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href={gamesHref} className="hover:text-white transition-colors">
                  {dictionary.common.games}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedPath("/privacy", lang)} className="hover:text-white transition-colors">
                  {dictionary.common.privacy}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <p className="text-sm text-white/80">
              Follow us for updates on new games and features.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="mb-6">
            <FooterLocaleSwitcher />
          </div>
          <div className="flex flex-col items-center gap-4 text-sm text-white/60">
            <div>
              © {new Date().getFullYear()} {settings.logo ? "GamePortal" : "GamePortal"}. {dictionary.common.rights_reserved}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={getLocalizedPath("/privacy", lang)} className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href={getLocalizedPath("/terms", lang)} className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href={getLocalizedPath("/about", lang)} className="hover:text-white transition-colors">About Us</Link>
              <Link href={getLocalizedPath("/contact", lang)} className="hover:text-white transition-colors">Contact Us</Link>
              <Link href={getLocalizedPath("/copyright", lang)} className="hover:text-white transition-colors">Copyright Notice</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
