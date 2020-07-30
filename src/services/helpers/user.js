import ApplicationSettings from "@/services/application-settings";

export { getUserAvatarUrl, formatAsTicketUser };

function getUserAvatarUrl(userId) {
  return new URL(`/api/users/${userId}/profile/avatar`, ApplicationSettings.VUE_APP_OPENPAAS_URL).toString();
}

function formatAsTicketUser(user) {
  return {
    id: user.user._id,
    name: user.name,
    email: user.email,
    type: user.type
  };
}
