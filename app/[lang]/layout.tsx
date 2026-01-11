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

export const metadata: Metadata = {
  title: "GamePortal - Free Online Games",
  description: "Play the best free online games.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
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
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Navbar lang={lang} dictionary={dictionary} settings={settings} />
          <main className="flex-grow">{children}</main>
          <Footer lang={lang} dictionary={dictionary} settings={settings} />
        </div>
      </body>
    </html>
  );
}
