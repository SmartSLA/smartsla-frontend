export default {
  getConfigurations(configType = []) {
    return this.post(`/api/configurations?scope=user`, configType).then(({ data }) => normalize(data));
  }
};

function normalize(data) {
  return data[0].configurations[0].value || {};
}
