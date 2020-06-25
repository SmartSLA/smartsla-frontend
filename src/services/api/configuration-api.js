export default {
  getConfigurations(configType = []) {
    return this.post(`/api/configurations?scope=user`, configType).then(({ data }) => normalize(data));
  },

  setUserLanguage(userId, payload) {
    return this.put(`/api/configurations?scope=user&user_id=${userId}`, payload);
  },

  getUserLanguage(userId, configType = []) {
    return this.post(`/api/configurations?scope=user&user_id=${userId}`, configType).then(({ data }) =>
      normalize(data)
    );
  }
};

function normalize(data) {
  return data[0].configurations[0].value || {};
}
