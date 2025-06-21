import fs from 'fs';
import path from 'path';
import i18next from 'i18next';

// Pomocnicza funkcja do wczytania tłumaczenia z pliku JSON
function loadLocale(lang: string): Record<string, any> {
  const filePath = path.join(__dirname, '../../shared/languages', `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Wczytujemy wszystkie dostępne języki
const resources = {
  pl: { translation: loadLocale('pl') },
  en: { translation: loadLocale('en') },
};

// Inicjalizacja i18next
i18next.init({
  lng: 'pl', // domyślny język
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false, // nie trzeba escapować w Node.js
  },
});

export default i18next;
