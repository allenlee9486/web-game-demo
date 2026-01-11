export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de", "fr", "ja", "es", "ko", "zh"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeConfig: Record<Locale, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇺🇸" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  ja: { name: "日本語", flag: "🇯🇵" },
  es: { name: "Español", flag: "🇪🇸" },
  ko: { name: "한국어", flag: "🇰🇷" },
  zh: { name: "中文", flag: "🇨🇳" },
};
