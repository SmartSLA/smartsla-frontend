<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="users-list">
      <div class="page-title">
        <span>
          {{ $i18n.t("Users list") }}
        </span>
      </div>
      <div class="users-search">
        <span class="users-search-span">
          {{ $i18n.t("Search by:") }}
        </span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="users-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          label="Client"
          class="users-search-client"
        ></v-select>
        <v-select solo :items="roles" v-model="roles" hide-details label="Roles" class="users-search-roles"></v-select>
        <div class="users-operations">
          <a href="#" class="users-actions">
            <v-icon>add_circle</v-icon>
            <span>{{ $i18n.t("Add user") }}</span>
          </a>
          <a href="#" class="users-actions">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $i18n.t("Export") }}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="users"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.title }}</td>
          <td class="text-xs-center">
            <div v-if="props.item.isdisabled == 'yes'">
              <strike>{{ props.item.name }}</strike>
            </div>
            <div v-else>{{ props.item.name }}</div>
          </td>
          <td class="text-xs-center">{{ props.item.role }}</td>
          <td class="text-xs-center">{{ props.item.engineer }}</td>
          <td class="text-xs-center">{{ props.item.beneficiary }}</td>
          <td class="text-xs-center user-mail">{{ props.item.email }}</td>
          <td class="text-xs-center">{{ props.item.phone }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
var users = require("@/assets/data/users.json");
export default {
  data() {
    return {
      search: "",
      clients: [],
      roles: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: "10",
      headers: [
        { text: "Title", value: "title" },
        { text: "Name", value: "name" },
        { text: "Role", value: "role" },
        { text: "Engineer", value: "engineer" },
        { text: "Beneficiary", value: "beneficiary" },
        { text: "E-mail", value: "email" },
        { text: "Phone", value: "phone" }
      ],
      users
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "users");
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

<style lang="stylus" scoped>
.elevation-1
  width: 100% !important;
  padding-bottom: 50px;
  background-color: #ffffff;
.elevation-1 th
  color: #000000;
.page-title
  color: #777777;
  margin-bottom: 20px;
.users-list
  width: 100% !important;
.container.fluid.fill-height
  padding: 50px;
  width: 100%;
  max-width: 100%;
.layout.justify-center.align-center > div
  width: 100%;
.users-search-span
  padding-top: 15px;
  width: 150px;
  color: #777;
.users-search-name,
.users-search-client,
.users-search-roles
  width: 300px;
.users-search
  display: inline-flex !important;
  margin-bottom: 20px;
.v-input.users-search-name,
.v-input.users-search-client
  margin-right: 20px !important;
.user-mail
  color: #2196f3 !important;
  font-weight: bold !important;
.users-operations a
  margin-left: 20px;
.users-operations
  margin: 10px;
  margin-left: 100px !important;
.users-actions
  text-decoration: none !important;
.users-search
  width: 100%;
</style>
