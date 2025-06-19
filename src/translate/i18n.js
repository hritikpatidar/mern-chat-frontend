import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      english: "English",
    },
  },
  ar: {
    translation: {
      arabic: "الإنجليزية",
    },
  },

  hi: {
    translation: {
      Hindi: "हिंदी",
    },
  },

  ur: {
    translation: {
      urdu: "اردو",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
