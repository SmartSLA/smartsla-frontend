<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="clients-list">
      <div class="page-title">
        <span>Clients list</span>
      </div>

      <div class="clients-search">
        <span class="clients-search-span">Search by:</span>
        <v-text-field
          v-model="search"
          :placeholder="$t('Name')"
          single-line
          hide-details
          solo
          class="clients-search-name"
        ></v-text-field>
        <div class="clients-operations">
          <a href="#" class="clients-actions">
            <v-icon>add_circle</v-icon>
            <span>Add client</span>
          </a>
          <a href="#" class="clients-actions">
            <v-icon>arrow_downward</v-icon>
            <span>Export</span>
          </a>
        </div>
      </div>

      <v-data-table :headers="headers" :items="clients" class="elevation-1" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.adresse }}</td>
          <td class="text-xs-center">{{ props.item.inactive }}</td>
          <td class="text-xs-center">{{ props.item.access_code }}</td>
          <td class="text-xs-center">{{ props.item.help_code }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
var clients = require("@/assets/data/clients.json");
export default {
  data() {
    return {
      search: "",
      clients: [],
      roles: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Adresse", value: "adresse" },
        { text: "Inactive", value: "inactive" },
        { text: "Access code", value: "access_code" },
        { text: "Help code", value: "help_code" }
      ]
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "clients");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>
<style type="text/css">
.elevation-1 {
  width: 100% !important;
  padding-bottom: 50px;
  background-color: #ffffff;
}
.page-title {
  color: #777777;
  margin-bottom: 20px;
}
.elevation-1 th {
  color: #000000;
}
.clients-list {
  width: 100% !important;
}
.container.fluid.fill-height {
  padding: 50px;
  width: 100%;
  max-width: 100%;
}
.layout.justify-center.align-center > div {
  width: 100%;
}
.clients-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}
.clients-search-name,
.clients-search-client,
.clients-search-roles {
  width: 300px;
}
.clients-search {
  display: inline-flex !important;
  margin-bottom: 20px;
}
.v-input.clients-search-name.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-text-field--placeholder.v-input--hide-details.theme--light,
.v-input.clients-search-client.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-select.v-input--hide-details.theme--light {
  margin-right: 20px;
}
.client-mail {
  color: #2196f3 !important;
  font-weight: bold !important;
}
.clients-operations a {
  margin-left: 20px;
}
.clients-operations {
  margin: 10px;
  margin-left: 100px !important;
}
.clients-actions {
  text-decoration: none !important;
}
</style>
