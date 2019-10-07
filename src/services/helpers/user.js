import ApplicationSettings from "@/services/application-settings";

export { getUserAvatarUrl };

function getUserAvatarUrl(user) {
  return new URL(`/api/users/${user._id}/profile/avatar`, ApplicationSettings.VUE_APP_OPENPAAS_URL).toString();
}
