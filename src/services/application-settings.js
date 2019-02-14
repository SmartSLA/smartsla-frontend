import env from "@/config/env";

export const ApplicationSettings = Object.freeze({
  ...{ BASE_URL: "/", VUE_APP_OPENPAAS_URL: "http://localhost:8080" },
  ...process.env,
  ...env
});

export default ApplicationSettings;
