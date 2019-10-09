import VueI18n from "vue-i18n";
import { FALLBACK_LANGUAGE, LOCALE as locale } from "./constants";
import en from "@/i18n/lang/en.json";
import fr from "@/i18n/lang/fr.json";
import vi from "@/i18n/lang/vi.json";

export default function(VueInstance) {
  VueInstance.use(VueI18n);

  return new VueI18n({
    locale,
    fallbackLocale: FALLBACK_LANGUAGE,
    messages: { fr, en, vi },
    silentTranslationWarn: true
  });
}
