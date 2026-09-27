"use client";

import { useTranslation } from "react-i18next";

/**
 * Site-wide illustration credit.
 *
 * The Storyset (Freepik) free licence covers personal and commercial use only
 * *with attribution*. That attribution is a licence term rather than a
 * courtesy, so it sits in the footer of every page rather than a colophon
 * nobody visits — see https://storyset.com/terms.
 *
 * The strings are translated because every page is; the link text stays the
 * brand name, which is not localised.
 */
export default function Credits() {
  const { t } = useTranslation();

  return (
    <footer className="site-credits">
      <p className="site-credits-text">
        {t("common.creditsIllustrations")}{" "}
        <a
          className="site-credits-link"
          href="https://storyset.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Storyset
        </a>
      </p>
    </footer>
  );
}
