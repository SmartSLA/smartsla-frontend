import Vue from "vue";
import VueI18n from "vue-i18n";
import { FALLBACK_LANGUAGE, LOCALE as locale } from "./constants";
import en from "@/i18n/lang/en.json";
import fr from "@/i18n/lang/fr.json";
import vi from "@/i18n/lang/vi.json";

Vue.use(VueI18n);

export function i18n() {
  const i18n = new VueI18n({
    locale,
    fallbackLocale: FALLBACK_LANGUAGE,
    messages: { fr, en, vi },
    silentTranslationWarn: true
  });

  setWidgetsMessage(i18n);

  return i18n;
}

function loadWidgetsMessage() {
  const messages = {};
  const locales = require.context("@/components/dashboard/widgets", true, /\.json$/);

  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = Object.assign({}, messages[locale], locales(key));
    }
  });

  return messages;
}

function setWidgetsMessage(i18n) {
  const messagesWidgets = loadWidgetsMessage();

  Object.keys(i18n.messages).map(locale => {
    i18n.mergeLocaleMessage(locale, { ...messagesWidgets[locale] });
  });
}
