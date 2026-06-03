"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  // null = not yet determined (SSR / first paint)
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const newDark = !isDark;

    // Only store the key when the chosen mode differs from the system default.
    // When both match, clear the key so the page follows the system again.
    if (newDark === systemDark) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", newDark ? "dark" : "light");
    }

    document.documentElement.classList.toggle("dark", newDark);
    setIsDark(newDark);
  };

  // Don't render until the client knows the active mode — prevents icon flash.
  if (isDark === null) return null;

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon
        icon={isDark ? faSun : faMoon}
        style={{ width: "1rem", height: "1rem" }}
      />
    </button>
  );
}
