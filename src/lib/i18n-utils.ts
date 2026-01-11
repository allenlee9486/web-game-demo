import { i18n, Locale } from "@/i18n-config";

export function getLocalizedPath(path: string, lang: Locale): string {
  const isDefault = lang === i18n.defaultLocale;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (isDefault) return cleanPath;
  return `/${lang}${cleanPath}`;
}
