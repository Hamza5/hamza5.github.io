"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

/** Bumped on every toggle so useSyncExternalStore knows to re-read. */
const THEME_EVENT = "themechange";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

/** The server cannot know the preference, so it renders neither class. */
function getServerSnapshot() {
  return false;
}

function preferredDark(): boolean {
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored) return stored === "dark";
  } catch {
    // Private mode; fall through to the OS preference.
  }
  return window.matchMedia(DARK_QUERY).matches;
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { t } = useTranslation();

  // React 19 owns the attributes of the <html> element it renders, and
  // re-renders the layout whenever the [lang] segment changes. That wipes the
  // `dark` class, which is why changing language used to reset the theme.
  // There is nowhere to move the class to that React does not also own, and a
  // static export cannot read the stored preference on the server, so the
  // theme is re-asserted from storage after every commit. A layout effect runs
  // before paint, so this is not visible as a flash.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", preferredDark());
  });

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    // Always persist the explicit choice so it survives every reload.
    try {
      window.localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode: the class still applies for this page view.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

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
