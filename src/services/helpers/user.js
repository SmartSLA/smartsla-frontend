import ApplicationSettings from "@/services/application-settings";

export { getUserAvatarUrl, formatAsTicketUser };

function getUserAvatarUrl(user) {
  return new URL(`/api/users/${user.user._id}/profile/avatar`, ApplicationSettings.VUE_APP_OPENPAAS_URL).toString();
}

function formatAsTicketUser(user) {
  return {
    id: user.user._id,
    name: user.name,
    email: user.email,
    type: user.type
  };
}
