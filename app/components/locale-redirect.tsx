"use client";

import { useEffect } from "react";
import type { Locale } from "@/app/lib/locales";

/**
 * Resolves which language to send the visitor to on "/".
 *
 * Order: a language they explicitly chose before, then the browser's own
 * preference list in order, then English. The stored value is a real choice, so
 * it wins outright rather than merely being first in the queue.
 */
export function detectLocale(): Locale {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem("lang");
  } catch {
    // Private mode: no stored preference, fall through to the browser list.
  }
  if (stored) {
    const primary = stored.toLowerCase().split(/[-_]/)[0];
    // Honour it only if it really names a language we publish, so a stale or
    // hand-edited value falls through to the browser list instead of pinning
    // the visitor to English.
    if (primary === "en" || primary === "fr" || primary === "ar") return primary;
  }

  const preferred = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];
  for (const tag of preferred) {
    if (!tag) continue;
    const primary = tag.toLowerCase().split(/[-_]/)[0];
    if (primary === "en") return "en";
    if (primary === "fr") return "fr";
    if (primary === "ar") return "ar";
  }

  return "en";
}

/**
 * Sends the visitor to their language automatically. Rendered on the root path
 * only, which is why it can live outside the [lang] segment and reach for
 * localStorage and navigator directly.
 *
 * "/" renders the English page, so an English visitor is already where they
 * belong and no navigation happens — they get the name and the language links
 * with nothing to dismiss.
 *
 * The page behind the redirect is real content, so this is a convenience and
 * not the only way in: with JavaScript off the visitor still sees the English
 * page and working links.
 */
export default function LocaleRedirect() {
  useEffect(() => {
    const target = detectLocale();
    if (target === "en") return;
    window.location.replace(`/${target}`);
  }, []);

  return null;
}
