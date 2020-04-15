export const ApplicationSettings = Object.freeze({
  ...{
    BASE_URL: "/",
    VUE_APP_OPENPAAS_URL: "http://localhost:8080",
    SSP_URL: "http://ssp.localhost:8080/",
    SUPPORT_ACCOUNT: {
      name: "SmartSLA",
      color: "#d32f2f",
      logo: "logo.png"
    },
    LIMESURVEY_URL: "http://limesurvey.localhost:8080/"
  },
  ...process.env,
  ...window.openpaas
});

export default ApplicationSettings;
