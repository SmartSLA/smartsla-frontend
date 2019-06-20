<template>
  <div class="requests-list">
    <v-card-text>
      <a href="#" disabled class="text-lg-left action-links">
        <v-icon class="mr-2">bug_report</v-icon>
        <span>{{ $i18n.t("Requests list (TICKETS)") }}</span>
      </a>
      <download-excel :data="requests" class="export-excel">
        <v-icon class="mr-2">backup</v-icon>
        <span>{{ $i18n.t("EXPORT SHEET") }}</span>
      </download-excel>
      <a href="#" class="action-links mr-5 right">
        <v-icon class="mr-2">print</v-icon>
        {{ $i18n.t("PRINT SHEET") }}
      </a>
    </v-card-text>
    <div class="tickets-search">
      <div class="requests-filter-label">
        <span>{{ $i18n.t("Filter by:") }}</span>
      </div>
      <v-spacer class="mx-2"></v-spacer>
      <v-select
        solo
        :items="categories"
        v-model="categoriesFilter"
        hide-details
        class="scoped-requests-search"
        id="first-combo"
        v-bind:label="$t('Categories')"
      ></v-select>
      <v-select
        solo
        :items="values"
        v-model="valuesFilter"
        hide-details
        class="scoped-requests-search"
        v-bind:label="$t('Values')"
      ></v-select>
      <v-btn @click="addNewFilter" class="requests-filter-add">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer class="mx-2"></v-spacer>
      <div class="requests-filter-label">
        <span>{{ $i18n.t("And / Or") }}</span>
      </div>
      <v-spacer class="mx-2"></v-spacer>
      <v-select
        solo
        :items="selections"
        v-model="storedSelectionsFilter"
        hide-details
        class="scoped-requests-search"
        v-bind:label="$t('Stored selections')"
        @input="$emit('input')"
      ></v-select>
      <v-btn class="requests-filter-add">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer class="mx-2"></v-spacer>
      <div class="requests-filter-label">
        <span>{{ $i18n.t("And / Or") }}</span>
      </div>
      <v-spacer class="mx-2"></v-spacer>
      <v-text-field
        v-model="search"
        :placeholder="$i18n.t('Search')"
        single-line
        hide-details
        solo
        class="scoped-requests-search"
      >
        <v-icon @click="addNewFilter" outline class="pl-2">add</v-icon>
      </v-text-field>
    </div>
    <ul id="filter-chips">
      <li v-for="filter in customFilters" :key="filter.id" class="chips-elements">
        <v-chip v-model="filter.isOpen" close>{{ filter.categorie }} : {{filter.value}}</v-chip>
      </li>
    </ul>

    <v-layout>
      <v-data-table
        :headers="headers"
        :items="requests"
        class="elevation-1"
        :search="search"
        :custom-filter="requestsFilter"
        :filter="requestFilterByGroup"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.index }}</td>
          <td>
            <router-link :to="{ name: 'Request', params: { id: props.item.ticket_number } }">
              {{
              props.item.ticket_number
              }}
            </router-link>
          </td>
          <td class="text-xs-center" v-if="$auth.check('admin')">
            <v-badge v-if="props.item.id_ossa == 1" color="#512da8">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
            <v-badge v-if="props.item.id_ossa == 2" color="#8b60d8">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
            <v-badge v-if="props.item.id_ossa == 3" color="#dbc1ff">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
          </td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on">{{ props.item.severity }}</span>
              </template>
              <span>
                <b>Engagements critiques:</b>
                <ul>
                  <li>
                    Prise en charge:
                    <b>4H</b>
                  </li>
                  <li>
                    Contournement:
                    <b>1JO</b>
                  </li>
                  <li>
                    Résolution:
                    <b>3JO</b>
                  </li>
                </ul>
              </span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span
                  v-if="props.item.software == 'LibreOffice'"
                  class="major-criticality"
                  v-on="on"
                >{{ props.item.software }}</span>
                <span
                  v-else-if="props.item.software == 'NPM'"
                  class="medium-criticality"
                  v-on="on"
                >{{ props.item.software }}</span>
                <span v-else class="minor-criticality" v-on="on">{{ props.item.software }}</span>
              </template>
              <span>Version : 1.4.6 / Criticité : Haute</span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">{{ props.item.incident_wording }}</td>
          <td class="text-xs-center">{{ props.item.assign_to }}</td>
          <td class="text-xs-center">{{ props.item.responsible }}</td>
          <td class="text-xs-center">{{ props.item.transmitter }}</td>

          <td class="text-xs-center">
            <a href="#">{{ props.item.client_contrat.client }}</a>
            /
            <a href="#">{{ props.item.client_contrat.contract }}</a>
          </td>
          <td class="text-xs-center">{{ props.item.maj }}</td>
          <td class="text-xs-center">{{ props.item.created }}</td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">
            <v-progress-linear
              v-if="props.item.conf.color == 'error'"
              color="#d32f2f"
              height="20"
              value="30"
            >{{ props.item.remaining_time }}</v-progress-linear>
            <!-- <v-progress-linear
              v-if="props.item.conf.color == 'warning'"
              color="warning"
              height="20"
              value="50"
            >{{ props.item.remaining_time }}</v-progress-linear>-->
            <v-progress-linear
              v-else
              color="#76c43d"
              height="20"
              value="80"
            >{{ props.item.remaining_time }}</v-progress-linear>
          </td>
        </template>
      </v-data-table>
    </v-layout>
  </div>
</template>

<script>
var requests = require("@/assets/data/requests.json");
import { mapGetters } from "vuex";
import Vue from "vue";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);
export default {
  data() {
    return {
      filterGroups: ["Ticket", "Client / Contract", "Software"],
      teams: [
        {
          text: "All Teams",
          value: ""
        },
        {
          text: "ossa",
          value: "ossa"
        },
        {
          text: "support",
          value: "support"
        },
        {
          text: "hosting",
          value: "hosting"
        }
      ],
      searchCriteria: "Ticket",
      rowsPerPageItems: [10, 25, 50],
      pagination: "10",
      search: null,
      toggle_multiple: "2",
      teamsFilter: {
        text: "All Teams",
        value: ""
      },
      isMobile: false,
      headers: [
        { text: "#", value: "number" },
        { text: this.$i18n.t("Ticket N°"), value: "ticket_number" },
        { text: this.$i18n.t("ID OSSA"), value: "id_ossa" },
        { text: this.$i18n.t("Type"), value: "type" },
        { text: this.$i18n.t("Severity"), value: "severity" },
        { text: this.$i18n.t("Software"), value: "software" },
        { text: this.$i18n.t("Subject"), value: "incident_wording" },
        { text: this.$i18n.t("Assign To"), value: "assign_to" },
        { text: this.$i18n.t("Responsible"), value: "responsible" },
        { text: this.$i18n.t("Author"), value: "transmitter" },
        { text: this.$i18n.t("Client / Contrat"), value: "client_contrat" },
        { text: this.$i18n.t("MAJ"), value: "maj" },
        { text: this.$i18n.t("Created"), value: "created" },
        { text: this.$i18n.t("Status"), value: "status" },
        { text: this.$i18n.t("Remaining time"), value: "remaining_time" }
      ],
      requests: [],
      categories: [
        "Type",
        "Severity",
        "Software",
        "Assign To",
        "Responsible",
        "Transmitter",
        "Client / Contract",
        "Status"
      ],
      categoriesFilter: "",
      values: [],
      selections: [],
      chip1: true,
      types: ["Anomalie", "Evolution"],
      severities: ["Bloquant", "Non Bloquant"],
      status: [
        "New",
        "Taken into contact",
        "Circumvention",
        "Fenced",
        "Resolution"
      ],
      customFilters: [],
      customFiltersCategories: [],
      softwareList: []
    };
  },
  mounted() {
    if (this.$auth.ready() && !this.$auth.check("admin")) {
      this.headers = this.headers.filter(header => header.value != "id_ossa");
    }
    this.$http.listSoftware().then(response => {
      response.data.forEach(software => {
        this.softwareList.push(software.name);
      });
    });
    this.$http.listUsers().then(response => {
      response.data.forEach(user => {
        this.userList.push(user.name);
      });
    });
    this.$http.getContracts().then(response => {
      response.data.forEach(contract => {
        this.contractClientList.push(contract.client + " / " + contract.name);
      });
    });
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail"
    })
  },
  created() {
    this.requests = requests;
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  watch: {
    categoriesFilter: function(newCategory, oldCategory) {
      switch (this.categoriesFilter) {
        case "Type":
          this.values.length = 0;
          this.values = this.types;
          return;
        case "Severity":
          this.values.length = 0;
          this.values = this.severities;
          return;
        case "Software":
          this.values.length = 0;
          this.values = this.softwareList;
          return;
        case "Assign To":
          this.values.length = 0;
          this.values = this.userList;
          return;
        case "Responsible":
          this.values.length = 0;
          this.values = this.userList;
          return;
        case "Transmitter":
          this.values.length = 0;
          this.values = this.userList;
          return;
        case "Client / Contract":
          this.values.length = 0;
          this.values = this.contractClientList;
          return;
        case "Status":
          this.values.length = 0;
          this.values = this.status;
          return;
        default:
          return false;
      }
    }
  },
  updated() {},
  methods: {
    resetRequestSearch() {
      this.search = null;
      this.teamsFilter = "";
      this.searchCriteria = this.filterGroups[0];
    },
    requestsFilter(items, search, Filter) {
      if (this.teamsFilter.length) {
        items = items.filter(
          item => item.team.toLowerCase() == this.teamsFilter
        );
      }
      return items.filter(item => Filter(item, search.toLowerCase()));
    },
    requestFilterByGroup(item, search) {
      // switch (this.searchCriteria) {
      //   case "Ticket":
      //     return item.incident_wording.toLowerCase().includes(search);
      //   case "Client / Contract":
      //     return item.client_contract.toLowerCase().includes(search);
      //   case "Responsible":
      //     return item.responsible.toLowerCase().includes(search);
      //   case "Software":
      //     console.log("test");
      //     return item.software.toLowerCase().includes(search);
      //   default:
      //     return false;
      // }
      return (
        item.software.toLowerCase().includes(search) ||
        item.incident_wording.toLowerCase().includes(search) ||
        item.client_contrat.client.toLowerCase().includes(search) ||
        item.client_contrat.contract.toLowerCase().includes(search)
      );
    },
    addNewFilter(categoriesFilter, valuesFilter) {
      if (this.categoriesFilter && this.valuesFilter) {
        // var parent = document.getElementById("filter-chips");
        // var newChild =
        //   '<v-chip v-model="categories" close>' +
        //   this.categoriesFilter +
        //   " : " +
        //   this.valuesFilter +
        //   "</v-chip>";
        // parent.insertAdjacentHTML("beforeend", newChild);
        var filter = {
          categorie: this.categoriesFilter,
          value: this.valuesFilter
        };
        this.customFilters.push(filter);
      }
      return;
    },
    categoriesFilter() {},
    valuesFilter() {},
    storedSelectionsFilter() {}
  }
};
</script>

<style lang="stylus" scoped>
.view-request {
  color: #ffffff;
}

.page-title {
  color: #777777;
  margin-bottom: 20px;
}

.elevation-1 th {
  color: #000000;
}

.requests-list {
  width: 100%;
}

.v-btn-toggle .v-btn.v-btn--active {
  background-color: #2195f2;
  color: #fff;
}

.v-item-group.transparent.theme--light.v-btn-toggle {
  margin-top: 10px;
}

.v-input.pa-0.v-text-field.v-select.v-select--is-menu-active.v-autocomplete.v-input--is-focused.primary--text, .v-input.pa-0.v-text-field.v-select {
  width: 200px !important;
}

.tickets-search {
  display: inline-flex;
  margin-bottom: 20px;
}

.v-item-group.transparent.theme--light.v-btn-toggle.v-btn-toggle--only-child.v-btn-toggle--selected {
  height: 48px;
}

.v-btn-toggle .v-btn {
  height: 48px;
}

.v-text-field {
  margin-top: 10px;
}

.mobile {
  color: #333;
}

.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}

td {
  margin: 2px !important;
  padding: 0px 15px !important;
  text-align: center;
}

th.column.sortable.text-xs-left {
  padding: 0px 15px !important;
  text-align: center !important;
}

.scoped-requests-search {
  padding-top: 10px !important;
}

div.v-input.scoped-requests-searchv-text-field--enclosed.v-text-field--placeholder, > div, > div, > div.v-input__append-inner, > div, div.v-input.scoped-requests-searchv-text-field--enclosed.v-select {
  max-width: 250px;
}

.major-criticality {
  background-color: #d32f2f;
  color: #ffffff;
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.medium-criticality {
  background-color: #ffa000;
  color: #ffffff;
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.minor-criticality {
  background-color: #e0e0e0;
  color: #000000;
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.action-links {
  text-decoration: none;
  color: grey;
}

.requests-filter-add {
  margin-top: 10px;
  height: 48px;
  margin-left: 0px;
}

.requests-filter-label {
  padding-top: 25px;
  color: #777;
}

.tickets-search {
  width: 100% !important;
}

.v-card__text {
  padding-left: 0px;
  padding-bottom: 24px;
  padding-right: 0px;
  padding-top: 0px;
}

.v-card__text {
  padding: 0px;
  width: 100%;
}

.tickets-search {
  margin-bottom: 0px;
  padding-bottom: 24px;
}

span.v-chip:nth-child(3), span.v-chip:nth-child(4) {
  padding-bottom: 0px;
  margin-bottom: 24px;
}

.v-card__text {
  padding-bottom: 24px;
}

div.v-input:nth-child(14) {
  width: 320px;
}

.text-lg-left {
  display: flex;
}

.text-lg-left > span:nth-child(2) {
  margin-top: 2px;
}

.export-excel {
  float: right;
}

.chips-elements {
  list-style: none;
}

#filter-chips {
  display: inline-flex;
  padding-bottom: 24px;
}
</style>
