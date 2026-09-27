"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeMeta, locales, type Locale } from "@/app/lib/locales";
import { LANG_STORAGE_KEY } from "@/app/lib/locale-redirect";

/**
 * The three languages are three different URLs, not a client-side text swap, so
 * switching is a real navigation. That is what lets each language be indexed
 * separately, and it is also why the toggle cannot call i18n.changeLanguage.
 */
export default function LangToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");

  return (
    <div className="lang-toggle" aria-label="Language">
      {locales.map((code) => (
        <Link
          key={code}
          href={currentPath === "" ? `/${code}` : `/${code}${currentPath}`}
          className={`lang-toggle-btn${code === locale ? " active" : ""}`}
          hrefLang={localeMeta[code].htmlLang}
          lang={localeMeta[code].htmlLang}
          aria-current={code === locale ? "true" : undefined}
          // Remembered so the bare "/" redirect can send returning visitors
          // straight back to the language they chose.
          onClick={() => {
            try {
              localStorage.setItem(LANG_STORAGE_KEY, code);
            } catch {
              // Private mode — the URL is authoritative anyway.
            }
          }}
        >
          {code.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
