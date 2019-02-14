import createLogger from "vuex/dist/logger";
import ApplicationSettings from "@/services/application-settings";

export default (ApplicationSettings.NODE_ENV !== "production" && ApplicationSettings.NODE_ENV !== "test"
  ? [createLogger()]
  : []);
