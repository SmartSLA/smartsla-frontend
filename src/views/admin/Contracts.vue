<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="contracts-list">
      <div class="page-title">
        <span>Contracts list</span>
      </div>

      <div class="contracts-search">
        <span class="contracts-search-span">Search by:</span>
        <v-text-field
          v-model="search"
          :placeholder="$t('Name')"
          single-line
          hide-details
          solo
          class="contracts-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          label="Status"
          class="contracts-search-status"
        ></v-select>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          label="Tam"
          class="contracts-search-tam"
        ></v-select>
        <v-select
          solo
          :items="roles"
          v-model="roles"
          hide-details
          label="Commercial"
          class="contracts-search-commercial"
        ></v-select>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          label="Team"
          class="contracts-search-team"
        ></v-select>
        <div class="contracts-operations">
          <a href="#" class="contracts-actions">
            <v-icon>add_circle</v-icon>
            <span>{{ $t("Add user") }}</span>
          </a>
          <a href="#" class="contracts-actions">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $t("Export") }}</span>
          </a>
        </div>
      </div>

      <v-data-table :headers="headers" :items="contracts" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
            <div v-if="props.item.isdisabled == 'yes'">
              <strike>{{ props.item.name }}</strike>
              <span class="expired-contracts">Expired</span>
            </div>
            <div v-else>{{ props.item.name }}</div>
          </td>
          <td class="text-xs-center">{{ props.item.begin }}</td>
          <td class="text-xs-center">{{ props.item.end }}</td>
          <td class="text-xs-center">
            <router-link class="contracts-actions" :to="{ name: 'Contract', params: { id: props.item.id } }">
              <v-icon>search</v-icon>
            </router-link>
          </td>
          <td class="text-xs-center">
            <router-link class="contracts-actions" :to="{ name: 'Contract', params: { id: props.item.id } }">
              <v-icon>create</v-icon>
            </router-link>
          </td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
var contracts = require("@/assets/data/contracts.json");
export default {
  data() {
    return {
      search: "",
      clients: [],
      roles: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Begin", value: "begin" },
        { text: "End", value: "end" },
        { text: "View", value: "view" },
        { text: "Edit", value: "edit" }
      ],
      contracts: []
    };
  },
  created() {
    this.contracts = contracts;
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contracts");
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
.contracts-list {
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
.contracts-search-span {
  padding-top: 15px;
  width: 100px;
  color: #777;
}
.contracts-search-name,
.contracts-search-status,
.contracts-search-tam,
.contracts-search-commercial,
.contracts-search-team {
  width: 200px;
}
.contracts-search {
  display: inline-flex !important;
  margin-bottom: 20px;
}
.v-input.contracts-search-name.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-text-field--placeholder.v-input--hide-details.theme--light,
.v-input.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-select.v-input--hide-details.theme--light {
  margin-right: 10px;
}
.user-mail {
  color: #a20000;
  font-weight: bold !important;
}
.contracts-operations a {
  margin-left: 20px;
}
.contracts-operations {
  margin: 10px;
}
.expired-contracts {
  color: #fa4b4b;
  padding: 2px;
  border: #fa4b4b solid 1px;
  border-radius: 5px;
  margin-left: 5px;
}
.contracts-actions {
  text-decoration: none !important;
}
</style>
