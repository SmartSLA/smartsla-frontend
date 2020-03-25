import ApplicationSettings from "@/services/application-settings";
import { LOCALE } from "@/i18n/constants";

/**
 * Get survey url
 * @return {String}         - Survey url
 */
export default function surveyUrl(survey_id) {
  const baseUrl = `${ApplicationSettings.LIMESURVEY_URL}${survey_id}`;
  return {
    baseUrl,
    absoluteUrl: new URL(`${baseUrl}/lang/${LOCALE}/newtest/Y`, baseUrl).toString()
  };
}
