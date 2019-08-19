<template>
  <div class="requests-list">
    <v-card-text>
      <div class="text-lg-left">
        <a href="#" disabled class="action-links">
          <v-icon class="mr-2">format_list_numbered</v-icon>
          <span>{{ pageTitle }}</span>
        </a>
        <a
          href="#"
          disabled
          class="font-italic ml-2 mt-1 action-links red--text"
          @click="deleteDialog = true"
          v-show="showDeleteBtn"
        >
          <v-icon class="mr-2 error--text">delete_outline</v-icon>
          <span>{{ $t("Delete filter") }}</span>
        </a>
      </div>
      <download-excel :data="requests" class="export-excel">
        <v-icon class="mr-2">backup</v-icon>
        <span>{{ $t("EXPORT SHEET") }}</span>
      </download-excel>
      <a href="#" class="action-links mr-5 right">
        <v-icon class="mr-2">print</v-icon>
        {{ $t("PRINT SHEET") }}
      </a>
    </v-card-text>
    <div class="tickets-search">
      <div class="requests-filter-label">
        <span>{{ $t("Filter by:") }}</span>
      </div>
      <v-spacer class="mx-2"></v-spacer>
      <v-select
        solo
        :items="categories"
        v-model="categoriesFilter"
        hide-details
        class="scoped-requests-search"
        id="first-combo"
        v-bind:label="$i18n.t('Categories')"
      ></v-select>
      <v-select
        solo
        :items="values"
        v-model="valuesFilter"
        hide-details
        hide-selected
        class="scoped-requests-search"
        v-bind:label="$i18n.t('Values')"
      ></v-select>
      <v-btn @click="addNewFilter" class="requests-filter-add">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer class="mx-2"></v-spacer>
      <div class="requests-filter-label">
        <span>{{ $t("And/Or") }}</span>
      </div>
      <v-spacer class="mx-2"></v-spacer>
      <v-select
        solo
        :items="savedFilters"
        item-text="name"
        v-model="storedSelectionsFilterHolder"
        hide-details
        hide-selected
        class="scoped-requests-search"
        v-bind:label="$i18n.t('Stored selections')"
        @input="$emit('input')"
        return-object
        ></v-select>
      <v-btn class="requests-filter-add" @click="loadFilter">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-spacer class="mx-2"></v-spacer>
      <div class="requests-filter-label">
        <span>{{ $t("And/Or") }}</span>
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
      <li v-for="(filter, key) in customFilters" :key="key" class="chips-elements">
        <v-chip @input="removeFilter(filter)" close>{{ filter.category }} : {{ filter.value }}</v-chip>
      </li>
    </ul>
    <div v-if="customFilters.length > 0" class="filter-save mt-2">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <a href="#" class="font-italic blue--text action-links ml-2" v-on="on" v-show="isNewFilter">
            <v-icon class="mr-2 blue--text">playlist_add</v-icon>
            {{ $i18n.t("Create new filter") }}
          </a>
          <a
            href="#"
            @click="updateCurrectFilter"
            v-show="updateBtn"
            class="font-italic action-links warning--text ml-2"
          >
            <v-icon class="mr-2 warning--text">save_alt</v-icon>
            {{ $i18n.t("save") }}</a
          >
          <a
            class="font-italic grey--text action-links right"
            href="#"
            color="grey darken-1"
            v-on="on"
            @click="resetFilters"
          >
            <v-icon class="mr-2 grey--text">refresh</v-icon>
            {{ $i18n.t("reset") }}</a
          >
        </template>

        <v-card class="px-4">
          <v-card-title class="headline grey lighten-2" primary-title>{{ $i18n.t("Save filter") }}</v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field :label="$i18n.t('Filter name')" v-model="newFilterName"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="saveCurrentFilter">{{ $t("Save") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="deleteDialog" persistent max-width="290" v-if="storedSelectionsFilter.name">
      <v-card class="px-4 pt-2">
        <v-card-text>
          <span class="body-2"
            >{{ $t("are you sure you want to remove the filter") }} "{{ storedSelectionsFilter.name }}"?</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteCurrentFilter">{{ $t("confirm") }}</v-btn>
          <v-btn color="error" @click="deleteDialog = false">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <br />
    <v-layout>
      <v-data-table
        :headers="headers"
        :items="requests"
        class="elevation-1"
        :search="centralSearch"
        :custom-filter="requestsFilter"
        :filter="requestFilterByGroup"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
        ref="requestsTable"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.index }}</td>

            <td class="text-xs-center" v-if="$auth.check('admin')">
            
            <v-chip v-if="props.item.type == 'Anomalie'" color="#d32f2f" class="ma-2" label text-color="white">L</v-chip>
            <v-chip v-else color="#174dc5" class="ma-2" label text-color="white">S</v-chip>
          </td>
          <td>
            <router-link :to="{ name: 'Request', params: { id: props.item.ticket_number } }" class="blue-color">
              {{ props.item.ticket_number }}
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
                  class="major-criticality red-background-color"
                  v-on="on"
                  >{{ props.item.software }}</span
                >
                <span
                  v-else-if="props.item.software == 'NPM'"
                  class="medium-criticality yellow-background-color"
                  v-on="on"
                  >{{ props.item.software }}</span
                >
                <span v-else class="minor-criticality grey-background-color" v-on="on">{{ props.item.software }}</span>
              </template>
              <span>Version : 1.4.6 / Criticité : Haute</span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">{{ props.item.incident_wording }}</td>
          <td class="text-xs-center">{{ props.item.assign_to }}</td>
          <td class="text-xs-center">{{ props.item.responsible }}</td>
          <td class="text-xs-center">{{ props.item.transmitter }}</td>

          <td class="text-xs-center">
            <a class="blue-color" href="#">{{ props.item.client_contrat.client }}</a>

            <a class="blue-color" href="#">{{ props.item.client_contrat.contract }}</a>
          </td>
          <td class="text-xs-center">{{ props.item.maj }}</td>
          <td class="text-xs-center">{{ props.item.created }}</td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">

            <v-progress-linear v-if="props.item.conf.color == 'error'" color="#d32f2f" height="20" value="30">{{
              props.item.remaining_time
            }}</v-progress-linear>
            <v-progress-linear v-else color="#76c43d" height="20" value="80">{{
              props.item.remaining_time
            }}</v-progress-linear>
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
      dialog: false,
      deleteDialog: false,
      pageTitle: this.$i18n.t("ALL REQUESTS"),
      storedFilterUpdated: false,
      filterGroups: ["Ticket", "Client / Contract", "Software"],
      tickets: [
        {
          text: this.$i18n.t("All Tickets"),
          value: ""
        },
        {
          text: this.$i18n.t("ossa"),
          value: "ossa"
        },
        {
          text: this.$i18n.t("Support"),
          value: "support"
        },
        {
          text: this.$i18n.t("Hosting"),
          value: "hosting"
        }
      ],
      searchCriteria: "Ticket",
      rowsPerPageItems: [10, 25, 50],
      pagination: { p: "10" },
      search: null,
      centralSearch: null,
      toggle_multiple: "2",
      ticketsFilter: {
        text: this.$i18n.t("All Tickets"),
        value: ""
      },
      paginationObject: [
        {
          p: "10",
          descending: false,
          page: 1,
          rowsPerPage: 10,
          sortBy: "number"
        }
      ],
      isMobile: false,
      headers: [
        { text: "#", value: "number" },
        { text: this.$i18n.t("Organization"), value: "organization" },
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
        this.$i18n.t("Type"),
        this.$i18n.t("Severity"),
        this.$i18n.t("Software"),
        this.$i18n.t("Assign To"),
        this.$i18n.t("Responsible"),
        this.$i18n.t("Transmitter"),
        this.$i18n.t("Client / Contract"),
        this.$i18n.t("Status")
      ],
      categoriesFilter: "",
      valuesFilter: "",
      values: [],
      selections: [],
      types: [this.$i18n.t("Anomalie"), this.$i18n.t("Evolution")],
      severities: [this.$i18n.t("Bloquant"), this.$i18n.t("Non Bloquant")],
      status: [
        this.$i18n.t("New"),
        this.$i18n.t("Taken into contact"),
        this.$i18n.t("Circumvention"),
        this.$i18n.t("Fenced"),
        this.$i18n.t("Resolution")
      ],
      customFilters: [],
      customFiltersCategories: [],
      softwareList: [],
      userList: [],
      contractClientList: [],
      newFilterName: "",
      savedFilters: [],
      storedSelectionsFilter: {},
      storedSelectionsFilterHolder: {},
      deleteBtn: false,
      updateBtn: false
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
    this.$http.listFilters().then(response => {
      this.savedFilters = response.data;
    });
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail"
    }),

    isNewFilter() {
      return Object.keys(this.storedSelectionsFilter).length === 0;
    },

    showDeleteBtn() {
      return this.deleteBtn;
    }
  },
  created() {
    this.requests = requests;

        console.log(this.requests);
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
    this.$auth.ready(() => {
      this.$store.dispatch("user/fetchUser");
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  watch: {
    categoriesFilter: function(newCategory, oldCategory) {
      try {
        switch (this.categoriesFilter) {
          case "Type":
            this.values.length = 0;
            this.values = [...this.types];
            break;
          case "Severity":
            this.values.length = 0;
            this.values = [...this.severities];
            break;
          case "Software":
            this.values.length = 0;
            this.values = [...this.softwareList];
            break;
          case "Assign To":
            this.values.length = 0;
            this.values = [...this.userList];
            break;
          case "Responsible":
            this.values.length = 0;
            this.values = [...this.userList];
            break;
          case "Transmitter":
            this.values.length = 0;
            this.values = [...this.userList];
            break;
          case "Client / Contract":
            this.values.length = 0;
            this.values = [...this.contractClientList];
            break;
          case "Status":
            this.values.length = 0;
            this.values = [...this.status];
            break;
        }
      } catch (err) {
      } finally {
        let selectedValues = this.customFilters.filter(filter => filter.category == this.categoriesFilter);
        this.values = this.values.filter(value => {
          return selectedValues.filter(filter => filter.value == value).length == 0;
        });
      }
    },
    search: function(oldValue, newValue) {
      this.centralSearch = newValue;
    }
  },
  methods: {
    resetRequestSearch() {
      this.centralSearch = null;
      this.ticketsFilter = "";
      this.searchCriteria = this.filterGroups[0];
    },
    requestsFilter(items, search, Filter) {
      if (this.ticketsFilter.length) {
        items = items.filter(item => item.team.toLowerCase() == this.ticketsFilter);
      }
      return items.filter(item => Filter(item, search.toLowerCase()));
    },
    checkStoredFilterUpdate() {
      if (this.storedSelectionsFilter.items) {
        if (this.storedSelectionsFilter.items.length !== this.customFilters.length) {
          this.updateBtn = true;
        } else {
          this.updateBtn = JSON.stringify(this.storedSelectionsFilter.items) !== JSON.stringify(this.customFilters);
        }
      }
    },
    requestFilterByGroup(item, search) {
      let match = false;
      let typesFilter = this.customFilters.filter(filter => filter.category == "Type");
      let severityFilter = this.customFilters.filter(filter => filter.category == "Severity");
      let softwareFilter = this.customFilters.filter(filter => filter.category == "Software");
      let assignedFilter = this.customFilters.filter(filter => filter.category == "Assign To");
      let responsibleFilter = this.customFilters.filter(filter => filter.category == "Responsible");
      let transmitterFilter = this.customFilters.filter(filter => filter.category == "Transmitter");
      let clientFilter = this.customFilters.filter(filter => filter.category == "Client / Contract");
      let statusFilter = this.customFilters.filter(filter => filter.category == "Status");

      let typesFilterMacth = true;
      let severityFilterMacth = true;
      let softwareFilterMacth = true;
      let assignedFilterMacth = true;
      let responsibleFilterMacth = true;
      let transmitterFilterMacth = true;
      let clientFilterMacth = true;
      let statusFilterMacth = true;

      if (typesFilter.length) {
        typesFilterMacth = false;

        typesFilter.forEach(currentFilter => {
          if (item.type.toLowerCase() == currentFilter.value.toLowerCase()) {
            typesFilterMacth = true;
          }
        });
      }

      if (severityFilter.length) {
        severityFilterMacth = false;

        severityFilter.forEach(currentFilter => {
          if (item.severity.toLowerCase() == currentFilter.value.toLowerCase()) {
            severityFilterMacth = true;
          }
        });
      }

      if (softwareFilter.length) {
        softwareFilterMacth = false;

        softwareFilter.forEach(currentFilter => {
          if (item.software.toLowerCase() == currentFilter.value.toLowerCase()) {
            softwareFilterMacth = true;
          }
        });
      }

      if (assignedFilter.length) {
        assignedFilterMacth = false;

        assignedFilter.forEach(currentFilter => {
          if (item.assign_to.toLowerCase() == currentFilter.value.toLowerCase()) {
            assignedFilterMacth = true;
          }
        });
      }

      if (responsibleFilter.length) {
        responsibleFilterMacth = false;

        responsibleFilter.forEach(currentFilter => {
          if (item.responsible.toLowerCase() == currentFilter.value.toLowerCase()) {
            responsibleFilterMacth = true;
          }
        });
      }

      if (transmitterFilter.length) {
        transmitterFilterMacth = false;

        transmitterFilter.forEach(currentFilter => {
          if (item.transmitter.toLowerCase() == currentFilter.value.toLowerCase()) {
            transmitterFilterMacth = true;
          }
        });
      }

      if (clientFilter.length) {
        clientFilterMacth = false;

        clientFilter.forEach(currentFilter => {
          if (item.client_contract && item.client_contract.toLowerCase() == currentFilter.value.toLowerCase()) {
            clientFilterMacth = true;
          }
        });
      }

      if (statusFilter.length) {
        statusFilterMacth = false;

        statusFilter.forEach(currentFilter => {
          if (item.status.toLowerCase() == currentFilter.value.toLowerCase()) {
            statusFilterMacth = true;
          }
        });
      }

      match =
        typesFilterMacth &&
        severityFilterMacth &&
        softwareFilterMacth &&
        assignedFilterMacth &&
        responsibleFilterMacth &&
        transmitterFilterMacth &&
        clientFilterMacth &&
        statusFilterMacth;
      return (
        match ||
        item.software.toLowerCase().includes(search) ||
        item.incident_wording.toLowerCase().includes(search) ||
        item.client_contrat.client.toLowerCase().includes(search) ||
        item.client_contrat.contract.toLowerCase().includes(search)
      );
    },
    addNewFilter() {
      if (this.categoriesFilter && this.valuesFilter) {
        var filter = {
          category: this.categoriesFilter,
          value: this.valuesFilter
        };
        this.centralSearch = this.valuesFilter.toLowerCase();
        this.customFilters.push(filter);
        this.categoriesFilter = "";
        this.valuesFilter = "";
        this.values = [];
        this.checkStoredFilterUpdate();
      }
    },
    saveCurrentFilter() {
      var filterToSave = {
        name: this.newFilterName,
        items: this.customFilters,
        user: this.$store.state.user.user._id
      };
      this.$http
        .createFilters(filterToSave)
        .then(response => {
          this.dialog = false;
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter saved"),
            color: "success"
          });
          this.$http.listFilters().then(response => {
            this.savedFilters = response.data;
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    updateCurrectFilter() {
      var filterToUpdate = Object.assign({}, this.storedSelectionsFilter);
      filterToUpdate.items = [...this.customFilters];
      this.$http
        .updateFilters(filterToUpdate._id, filterToUpdate)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Filter updated")
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    deleteCurrentFilter() {
      this.$http
        .deleteFilters(this.storedSelectionsFilter._id)
        .then(response => {
          this.customFilters = [];
          this.deleteBtn = false;
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter deleted")
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
      this.deleteDialog = false;
      this.resetFilters();
      this.$http.listFilters().then(response => {
        this.savedFilters = response.data;
      });
    },
    loadFilter() {
      this.resetFilters();
      this.storedSelectionsFilter = Object.assign({}, this.storedSelectionsFilterHolder);
      this.storedSelectionsFilterHolder = {};
      this.customFilters = [...this.storedSelectionsFilter.items];
      this.deleteBtn = true;
      if (this.customFilters.length) {
        this.centralSearch = this.customFilters[0].value;
      }
      this.categoriesFilter = "";
      this.valuesFilter = "";
      this.pageTitle = this.storedSelectionsFilter.name;
    },
    removeFilter(filter) {
      this.customFilters = this.customFilters.filter(customFilter => {
        return JSON.stringify(customFilter) != JSON.stringify(filter);
      });
      this.centralSearch = "";
      this.checkStoredFilterUpdate();
    },

    resetFilters() {
      this.customFilters = [];
      this.centralSearch = "";
      this.pageTitle = this.$i18n.t("ALL REQUESTS");
      this.deleteBtn = false;
    }
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
  color: #ffffff;
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.medium-criticality {
  color: #ffffff;
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.minor-criticality {
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
  float: left;
}

#filter-chips {
  display: block;
  clear: both;
  max-width: 100%;
}

div.layout:nth-child(5) {
  clear: both;
  padding-top: 24px;
}
span.v-chip__content {
  color: #fff !important;
}
</style>
