"use client";

import { createInstance, type i18n as I18nInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { useMemo, type ReactNode } from "react";
import { defaultLocale, locales } from "@/app/lib/locales";

type Resources = Record<string, unknown>;

// One instance per locale, created lazily and reused for the rest of the
// session. Each instance holds only its own language, so the static HTML
// already contains the correct translated text and the client bundle no
// longer ships all three dictionaries.
const instances = new Map<string, I18nInstance>();

function getInstance(locale: string, resources: Resources): I18nInstance {
  const cached = instances.get(locale);
  if (cached) return cached;

  const instance = createInstance();
  instance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    resources: { [locale]: { translation: resources } },
    interpolation: { escapeValue: false },
  });

  instances.set(locale, instance);
  return instance;
}

interface I18nProviderProps {
  locale: string;
  resources: Resources;
  children: ReactNode;
}

export default function I18nProvider({ locale, resources, children }: I18nProviderProps) {
  const i18n = useMemo(() => getInstance(locale, resources), [locale, resources]);

  // `key` forces a remount when the visitor switches language, so every
  // client component re-renders from the new dictionary instead of keeping
  // stale nodes.
  return (
    <I18nextProvider i18n={i18n} key={locale}>
      {children}
    </I18nextProvider>
  );
}
