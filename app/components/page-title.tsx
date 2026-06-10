"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

const ROUTE_KEYS: Record<string, string> = {
  "/":             "home",
  "/about":        "about",
  "/career":       "career",
  "/projects":     "projects",
  "/skills":       "skills",
  "/publications": "publications",
};

export default function PageTitle() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    const key = ROUTE_KEYS[pathname] ?? "home";
    document.title = t(`page.${key}`);
  }, [t, pathname, i18n.language]);

  return null;
}
