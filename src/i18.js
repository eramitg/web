import i18 from 'i18next/i18next';

export const locale = window.navigator.userLanguage || window.navigator.language; //returns e.g. en-US

i18.init({
  debug: 'false',
  lng: locale,
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  saveMissing: true,
  resources: {
    'de': {'translation': require("./assets/locales/de/translation.json")},
    'en': {'translation': require("./assets/locales/en/translation.json")}
  }
});

export default i18;