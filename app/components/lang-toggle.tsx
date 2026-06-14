"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LOCALES = ["en", "ar", "fr"] as const;
type Locale = (typeof LOCALES)[number];

function normalizeLocale(locale: string): Locale {
  const normalized = locale.toLowerCase();
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("fr")) return "fr";
  return "en";
}

function getSystemLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("fr")) return "fr";
  return "en";
}

export default function LangToggle() {
  const { i18n } = useTranslation();
  const current = normalizeLocale(i18n.language);

  useEffect(() => {
    document.documentElement.lang = current;
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr";
  }, [current]);

  const switchTo = (locale: Locale) => {
    const system = getSystemLocale();
    if (locale === system) {
      localStorage.removeItem("lang");
    } else {
      localStorage.setItem("lang", locale);
    }
    i18n.changeLanguage(locale);
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
