"use client";

import { localeMeta, locales } from "@/app/lib/locales";
import { LANG_STORAGE_KEY } from "@/app/lib/locale-redirect";
import { localePath } from "@/app/lib/site";

/**
 * The language links on "/". Present as a fallback rather than as the primary
 * control: the page already redirects to the visitor's language on its own, so
 * these only matter when detection cannot decide or scripting is unavailable.
 *
 * Clicking one records the choice, which is what stops the bare "/" from
 * detecting over the top of it next time.
 */
export default function LocaleGateLinks() {
  return (
    <ul className="locale-gate-list">
      {locales.map((code) => (
        <li key={code}>
          <a
            href={localePath(code, "")}
            className="locale-gate-link"
            lang={localeMeta[code].htmlLang}
            hrefLang={localeMeta[code].htmlLang}
            onClick={() => {
              try {
                window.localStorage.setItem(LANG_STORAGE_KEY, code);
              } catch {
                // Private mode — the URL is authoritative anyway.
              }
            }}
          >
            {localeMeta[code].label}
          </a>
        </li>
      ))}
    </ul>
  );
}
