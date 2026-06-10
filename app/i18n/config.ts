import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../../messages/en.json";
import ar from "../../messages/ar.json";
import fr from "../../messages/fr.json";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
        fr: { translation: fr },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "ar", "fr"],
      // Strip region codes: "ar-DZ" → "ar", "fr-FR" → "fr"
      load: "languageOnly",
      // Allow "ar-DZ" to match the "ar" resource
      nonExplicitSupportedLngs: true,
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "lang",
        // Don't cache via the detector — we manage storage manually
        caches: [],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
