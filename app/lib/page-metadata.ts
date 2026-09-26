import type { Metadata } from "next";
import { localeMeta, locales, normalizeLocale } from "./locales";
import { getOgCopy, getSeo } from "./messages";
import { localePath, localeAlternates, ogImageUrl } from "./site";

/**
 * Every page is the same route with a different data entry, so the
 * per-language title, description, canonical URL, hreflang alternates and
 * social cards are all derived from one implementation. The [lang] segment
 * itself is resolved once, in app/[lang]/layout.tsx.
 *
 * Next replaces (rather than deep-merges) `openGraph`, `twitter` and `robots`
 * when a page exports them, so the social-card set is built here in full
 * rather than inherited from the layout.
 */
export function pageMetadata(path: string, seoKey: string) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ lang: string }>;
  }): Promise<Metadata> {
    const { lang } = await params;
    const locale = normalizeLocale(lang);
    const { title, description } = getSeo(locale, seoKey);
    const url = localePath(locale, path);
    const image = {
      url: ogImageUrl(locale, path),
      width: 1200,
      height: 630,
      alt: getOgCopy(locale, seoKey).title,
    };

    return {
      title,
      description,
      alternates: { canonical: url, languages: localeAlternates(path) },
      openGraph: {
        type: "website",
        url,
        siteName: "Hamza Abbad",
        title,
        description,
        locale: localeMeta[locale].ogLocale,
        alternateLocale: locales
          .filter((l) => l !== locale)
          .map((l) => localeMeta[l].ogLocale),
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl(locale, path)],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
    };
  };
}
