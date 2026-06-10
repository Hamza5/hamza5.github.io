"use client";

import { useTranslation } from "react-i18next";

const LOCALES = ["en", "ar", "fr"] as const;
type Locale = (typeof LOCALES)[number];

function getSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("fr")) return "fr";
  return "en";
}

export default function LangToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as Locale;

  const switchTo = (locale: Locale) => {
    const system = getSystemLocale();
    if (locale === system) {
      localStorage.removeItem("lang");
    } else {
      localStorage.setItem("lang", locale);
    }
    i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  };

  return (
    <div className="lang-toggle" aria-label="Language switcher">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          className={`lang-toggle-btn${current === locale ? " active" : ""}`}
          onClick={() => switchTo(locale)}
          aria-pressed={current === locale}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
