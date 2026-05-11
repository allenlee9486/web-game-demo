import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale, i18n } from '@/i18n-config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getSiteSettings } from '@/lib/settings';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDefault = lang === i18n.defaultLocale;
  const domain = 'https://klifur.online';
  const canonical = isDefault ? domain : `${domain}/${lang}`;

  // Build languages for alternates
  const languages: Record<string, string> = {};
  i18n.locales.forEach((l) => {
    languages[l] = l === i18n.defaultLocale ? domain : `${domain}/${l}`;
  });

  return {
    title: {
      template: '%s | GamePortal',
      default: 'GamePortal - Play Best Free Online Games Instantly',
    },
    description: "Your destination for the best free-to-play web games. Play instantly in your browser without downloads. High-quality physics games, puzzles, and more.",
    alternates: {
      canonical,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale as string }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const dictionary = await getDictionary(lang);
  const settings = getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar lang={lang} dictionary={dictionary} settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer lang={lang} dictionary={dictionary} settings={settings} />
    </div>
  );
}
