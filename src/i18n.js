import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Ładowanie tłumaczeń z plików JSON
  .use(LanguageDetector) // Automatyczne wykrywanie języka
  .use(initReactI18next) // Integracja z react-i18next
  .init({
    fallbackLng: 'en', // Domyślny język
    debug: true, // Ustaw na "false" w produkcji
    interpolation: {
      escapeValue: false, // Nie escape'uj znaków (React robi to sam)
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Ścieżka do plików JSON z tłumaczeniami
    },
  });

export default i18n;
