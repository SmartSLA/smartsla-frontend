export default {
  searchPeople(q, objectTypes = ["ldap"]) {
    return this.post("/api/people/search", {
      q,
      objectTypes
    }).then(response => response.data || []);
  }
};
