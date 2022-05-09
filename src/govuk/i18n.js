import i18next from '../../node_modules/i18next/dist/esm/i18next.bundled'
import dictionaryEn from './locales/en'

i18next
  .init({
    debug: true,
    // Try and detect the language in use based on the <html> element's `lang` attribute
    lang: document.documentElement.lang,
    // Set fallback to English, if it can't find a file for the specified language
    fallbackLng: 'en',
    // Convert 'en-GB' to 'en-gb' for the purposes of file lookup
    lowerCaseLng: true,
    // Configure where to look for localisation files
    resources: {
      en: { translation: dictionaryEn }
    }
  })

export default i18next
