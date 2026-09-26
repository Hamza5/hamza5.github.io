// ---------------------------------------------------------------------------
// Locales — the single source of truth for language routing and SEO metadata.
//
// Every page lives under /{locale}/… so each language gets its own indexable
// URL, its own <title>/description, and hreflang alternates pointing at its
// siblings. Translations are rendered into the static HTML (see
// app/components/i18n-provider.tsx) — nothing swaps client-side.
// ---------------------------------------------------------------------------

export const locales = ["en", "fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleMeta {
  /** Endonym shown in the language switcher. */
  label: string;
  /** Value for <html lang>. */
  htmlLang: string;
  /** Value for <html dir>. */
  dir: "ltr" | "rtl";
  /** Open Graph locale, e.g. "fr_DZ". */
  ogLocale: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: "English",  htmlLang: "en", dir: "ltr", ogLocale: "en_US" },
  fr: { label: "Français", htmlLang: "fr", dir: "ltr", ogLocale: "fr_DZ" },
  ar: { label: "العربية",   htmlLang: "ar", dir: "rtl", ogLocale: "ar_DZ" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Strips a region code ("ar-DZ" → "ar") and falls back to the default. */
export function normalizeLocale(value: string | undefined | null): Locale {
  const primary = (value ?? "").toLowerCase().split(/[-_]/)[0];
  return isLocale(primary) ? primary : defaultLocale;
}
