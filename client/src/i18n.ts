import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../../shared/languages/en.json';
import pl from '../../shared/languages/pl.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
    lng: 'pl',
    fallbackLng: 'en',
    interpolation: { 
        escapeValue: false 
    },
  });

export default i18n;
