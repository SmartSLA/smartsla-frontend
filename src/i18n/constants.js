export const USER_LANGUAGE = localStorage.getItem("userLanguage");

export const DEFAULT_LANGUAGE = "en";
export const FALLBACK_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "fr", "vi"];
export const SUPPORTED_LOCALES = [{ key: "en", value: "English" }, { key: "fr", value: "Français" }];

const browserLocale = navigator.language;
const browserPasedLanguage = browserLocale.includes("-")
  ? browserLocale.split("-")[0]
  : browserLocale || DEFAULT_LANGUAGE;
export const LOCALE = USER_LANGUAGE ? USER_LANGUAGE : browserPasedLanguage;
