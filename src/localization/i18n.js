import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {en,de} from "./translations";
import {Platform, NativeModules} from "react-native";

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};

const lan = Platform.select({
  ios: NativeModules.SettingsManager?.settings?.AppleLocale || NativeModules.SettingsManager?.settings?.AppleLanguages[0],
  android: NativeModules.I18nManager.localeIdentifier,
});

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  lng: lan,
  // locale: lan,
  //language to use if translations in user language are not available
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
