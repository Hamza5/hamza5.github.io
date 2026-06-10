"use client";

import { useTranslation } from "react-i18next";

export default function HeroBio() {
  const { t } = useTranslation();
  return (
    <p
      className="entrance-4"
      style={{
        color: "var(--fg-muted)",
        fontSize: "clamp(0.875rem, 2vw, 1rem)",
        maxWidth: "26rem",
        lineHeight: 1.6,
        marginTop: "-0.25rem",
      }}
    >
      {t("hero.bio")}
    </p>
  );
}
