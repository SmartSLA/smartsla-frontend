import ApplicationSettings from "@/services/application-settings";

const state = {
  baseUrl: ApplicationSettings.VUE_APP_OPENPAAS_URL
};

export default { namespaced: true, state };
