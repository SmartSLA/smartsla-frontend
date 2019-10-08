export const DEFAULT_LANGUAGE = "en";
export const FALLBACK_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "fr", "vi"];

const browserLocale = navigator.language;
export const LOCALE = browserLocale.includes("-") ? browserLocale.split("-")[0] : browserLocale || DEFAULT_LANGUAGE;
