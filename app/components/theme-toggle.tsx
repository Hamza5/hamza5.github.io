"use client";

import { useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function readPreferredTheme(): boolean | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(() => readPreferredTheme());
  const { t } = useTranslation();

  // useLayoutEffect runs synchronously before the browser paints.
  // This re-derives and re-applies the correct theme from storage/system
  // preference in case React's hydration (triggered by lang/dir mismatches
  // on <html> for non-English locales) overwrote the class set by the
  // inline themeScript.
  useLayoutEffect(() => {
    if (isDark === null) return;
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggle = () => {
    if (isDark === null) return;
    const newDark = !isDark;
    // Always persist the explicit choice so it survives every refresh.
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
    setIsDark(newDark);
  };

  // Don't render until the client knows the active mode — prevents icon flash.
  if (isDark === null) return null;

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        style={{ width: "1rem", height: "1rem" }}
      />
    </button>
  );
}
