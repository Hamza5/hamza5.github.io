import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import ar from "../../messages/ar.json";
import { defaultLocale, type Locale } from "./locales";

export type Messages = typeof en;

// Assigning every dictionary to `Messages` makes the compiler enforce locale
// parity: adding a key to en.json without adding it to fr.json/ar.json fails
// the typecheck instead of silently shipping a fallback string.
const resources: Record<Locale, Messages> = { en, fr, ar };

/** Static, build-time access to one language's dictionary. */
export function getMessages(locale: Locale): Messages {
  return resources[locale] ?? resources[defaultLocale];
}

export interface SeoEntry {
  title: string;
  description: string;
}

/**
 * Per-page title + description for every language, resolved from the `seo`
 * block of the message files. The copy in .docs/ is the source of truth, so
 * the search snippet and the on-page heading stay in sync.
 */
export function getSeo(locale: Locale, page: string): SeoEntry {
  return resolve(locale, `seo.${page}`) as SeoEntry;
}

/** Short title + description for a page's social card. */
export function getOgCopy(locale: Locale, page: string): SeoEntry {
  return resolve(locale, `og.${page}`) as SeoEntry;
}

/** Resolves a dotted path against one language's dictionary. */
export function getMessage(locale: Locale, path: string): string {
  return resolve(locale, path) as string;
}

function resolve(locale: Locale, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      getMessages(locale),
    );
}
