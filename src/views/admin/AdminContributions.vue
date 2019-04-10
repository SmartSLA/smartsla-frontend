<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="contributions-list">
      <div class="page-title">
        <span>
          {{$i18n.t("Contributions list")}}
        </span>
      </div>
      <div class="contributions-search">
        <span class="contributions-search-span">
          {{$i18n.t("Search by:")}}
        </span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="contributions-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="softwares"
          v-model="softwares"
          hide-details
          label="software"
          class="contributions-search-software"
        ></v-select>
        <v-select
          solo
          :items="statuss"
          v-model="statuss"
          hide-details
          label="statuss"
          class="contributions-search-statuss"
        ></v-select>
        <div class="contributions-operations">
          <a
            href="#"
            class="contributions-actions"
          >
            <v-icon>add_circle</v-icon>
            <span>{{$i18n.t("Add contribution")}}</span>
          </a>
          <a
            href="#"
            class="contributions-actions"
          >
            <v-icon>arrow_downward</v-icon>
            <span>{{$i18n.t("Export")}}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="admincontributions"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.software }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">{{ props.item.deposit }}</td>
          <td class="text-xs-center">{{ props.item.closure }}</td>
          <td class="text-xs-center">{{ props.item.time_limit }}</td>
          <td class="text-xs-center">{{ props.item.updated }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
var admincontributions = require("@/assets/data/admincontributions.json");
export default {
  data() {
    return {
      search: "",
      softwares: [],
      statuss: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: "10",
      headers: [
        { text: "Software", value: "software" },
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "Deposit at", value: "deposit" },
        { text: "Closure at", value: "closure" },
        { text: "Time limit", value: "time_limit" },
        { text: "Updated at", value: "updated" }
      ],
      admincontributions
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contributions");
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
.contributions-list
  width: 100% !important;
.container.fluid.fill-height
  padding: 50px;
  width: 100%;
  max-width: 100%;
.layout.justify-center.align-center > div
  width: 100%;
.contributions-search-span
  padding-top: 15px;
  width: 150px;
  color: #777;
.contributions-search-name,
.contributions-search-software,
.contributions-search-statuss
  width: 300px;
.contributions-search
  display: inline-flex !important;
  margin-bottom: 20px;
.v-input.contributions-search-name,
.v-input.contributions-search-software
  margin-right: 20px !important;
.contributions-operations a
  margin-left: 20px;
.contributions-operations
  margin: 10px;
  margin-left: 100px !important;
.contributions-actions
  text-decoration: none !important;
.contributions-search
  width: 100%;
</style>
