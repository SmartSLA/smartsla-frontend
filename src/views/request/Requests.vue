<template>
  <div class="requests-list">
    <v-layout align-center justify-space-between row mb-2>
      <v-flex xs4 pt-4>
        <request-filter-list></request-filter-list>
      </v-flex>
      <v-flex xs6 class="ml-auto">
        <additionalFilters
          :categories="categoriesRequestsFilters"
          :values="values"
          :categoriesFilter="categoriesFilter"
          @filterCategoryChanged="changeFilterCategory"
          @submitFilter="submitFilter"
          @filterSearchInputChanged="changeSearchTerm"
          @filterReset="filterReset"
          :customFilters="customFiltersByType"
          objectType="REQUEST"
        ></additionalFilters>
      </v-flex>
      <ExportCsvButton></ExportCsvButton>
    </v-layout>
    <v-container grid-list-md class="pa-0">
      <v-data-table
        :loading="loading"
        :total-items="requestsPaginationItems"
        :pagination.sync="pagination"
        :items="requestsAsDataTable"
        :headers="headers"
        class="elevation-1 pb-0"
        :search="centralSearch"
        :custom-filter="requestsFilter"
        :filter="requestFilterByGroup"
        :rows-per-page-items="rowsPerPageItems"
        :rows-per-page-text="$t('Rows per page:')"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
        item-key="_id"
        ref="requestsTable"
        :no-results-text="$i18n.t('No results text')"
        :no-data-text="$i18n.t('Loading')"
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              <router-link :to="{ name: 'Request', params: { id: props.item._id } }" class="blue-color item-id">
                <text-highlight :queries="highlightSearch">{{ props.item.request._id }}</text-highlight>
              </router-link>
            </td>
            <td class="text-xs-center">
              <text-highlight :queries="highlightSearch">{{ $t(props.item.request.type) }}</text-highlight>
            </td>
            <td class="text-xs-center">
              <software-list-detail :request="props.item.request" :query="highlightSearch"></software-list-detail>
            </td>
            <td class="text-xs-center">
              <v-tooltip top v-if="props.item.request.software && props.item.request.software.software">
                <template v-slot:activator="{ on }">
                  <span v-bind:class="['criticality', props.item.request.software.critical]" v-on="on">
                    <text-highlight :queries="highlightSearch">{{ props.item.softwareName }}</text-highlight>
                  </span>
                </template>
                <span>{{
                  $t(
                    "Version : " +
                      props.item.request.software.version +
                      " / Criticité : " +
                      props.item.request.software.critical
                  )
                }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-left">
              <text-highlight :queries="highlightSearch">{{ props.item.request.title | striphtml }}</text-highlight>
            </td>
            <td class="text-xs-center">
              <v-layout align-center justify-center fill-height>
                <organization-label
                  :contractId="props.item.request.contract"
                  :user="props.item.request.assignedTo"
                ></organization-label>
                <text-highlight :queries="highlightSearch">{{ props.item.request.assignedToName }}</text-highlight>
              </v-layout>
            </td>
            <td class="text-xs-center">
              <text-highlight :queries="highlightSearch">{{ props.item.request.responsibleName }}</text-highlight>
            </td>
            <td class="text-xs-center">
              <text-highlight :queries="highlightSearch">{{ props.item.request.authorName }}</text-highlight>
            </td>
            <td class="text-xs-center">
              <client-contract-links
                :contractId="props.item.request.contract"
                :query="highlightSearch"
              ></client-contract-links>
            </td>
            <td class="text-xs-center">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ props.item.updatedAt | relativeTime(userLanguage) }}</span>
                </template>
                <span>{{ props.item.updatedAt | formatDateFilter("llll", userLanguage) }}</span>
              </v-tooltip>
            </td>
            <td class="text-xs-center">{{ props.item.createdAt | formatDateFilter("ll", userLanguage) }}</td>
            <td class="text-xs-center">
              <text-highlight :queries="highlightSearch">{{ $t(capitalize(props.item.status)) }}</text-highlight>
            </td>
            <td class="text-xs-center">
              <span>{{ $t(capitalize(cnsWording(props.item))) }}</span>
              <cns-progress-bar
                v-if="displayCnsProgressBar(props.item)"
                :ticket="props.item.request"
                :cnsType="props.item.cnsType"
                :hideClock="true"
              ></cns-progress-bar>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-layout justify-center v-if="!loading">
            <span v-if="!userContracts.length">
              {{
                $t(
                  "You are not registered in any contract, " +
                    "you should get in touch with someone in charge of the platform in your company"
                )
              }}
            </span>
            <span v-else>
              {{
                $t("You are registered in the contract {contract} but there are no published tickets at the moment", {
                  contract: displayUserContracts
                })
              }}
              <v-btn color="info" :to="{ name: 'New issue' }" small>{{ $t("You can create a new issue") }}</v-btn>
            </span>
          </v-layout>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from "vuex";
import { capitalize } from "lodash";
import { routeNames } from "@/router";
import cnsProgressBar from "@/components/CnsProgressBar";
import SoftwareListDetail from "@/components/request/SoftwareListDetail";
import {
  ANOMALY_CNS_STATUS,
  CNS_STATUS,
  REQUEST_TYPE,
  TICKET_STATUS,
  CNS_TYPES,
  CATEGORIES_REQUESTS_FILTERS,
  TYPES_REQUESTS_FILTERS,
  SEVERITIES_REQUESTS_FILTERS,
  STATUS_REQUESTS_FILTERS
} from "@/constants.js";
import ClientContractLinks from "@/components/request/ClientContractLinks";
import OrganizationLabel from "@/components/request/OrganizationLabel";
import ExportCsvButton from "@/components/request/ExportCsvButton";
const { mapState } = createNamespacedHelpers("ticket");
import { LOCALE } from "@/i18n/constants";
import RequestFilterList from "@/components/request/RequestFilterList";
import additionalFilters from "@/components/filter/AdditionalFilters";

export default {
  data() {
    return {
      loading: true,
      dialog: false,
      pageTitle: this.$i18n.t("All requests"),
      search: null,
      ticketsFilter: {
        text: this.$i18n.t("All tickets"),
        value: ""
      },
      isMobile: false,
      headers: [
        { text: this.$i18n.t("Ticket N°"), value: "_id" },
        { text: this.$i18n.t("Type"), value: "type" },
        { text: this.$i18n.t("Severity"), value: "severity" },
        { text: this.$i18n.t("Software"), value: "softwareName" },
        { text: this.$i18n.t("Title"), value: "title", width: "20%" },
        { text: this.$i18n.t("Assigned to"), value: "assignedToName" },
        { text: this.$i18n.t("Responsible"), value: "responsibleName" },
        { text: this.$i18n.t("Author"), value: "authorName" },
        { text: this.$i18n.t("Client / Contract"), value: "clientContract" },
        { text: this.$i18n.t("MAJ"), value: "updatedAt" },
        { text: this.$i18n.t("Created"), value: "createdAt" },
        { text: this.$i18n.t("Status"), value: "status" },
        { text: this.$i18n.t("Time before next step"), value: "cns_type", sortable: false }
      ],
      categoriesFilter: "",
      valuesFilter: "",
      values: [],
      selections: [],
      keyValueFilter: false,
      customFilters: [],
      newFilterName: "",
      savedFilters: [],
      collectedCNS: []
    };
  },
  mounted() {
    this.$store.dispatch("contract/fetchContracts");
    this.$store.dispatch("software/fetchSoftwareList");
    this.$store.dispatch("users/fetchUsers");

    this.fetchUserFilters();
  },
  computed: {
    ...mapGetters({
      email: "currentUser/getEmail",
      requests: "ticket/getCurrentPageRequests",
      requestsPaginationItems: "ticket/getPaginationTotalItems",
      allRequests: "ticket/getTickets",
      userContracts: "currentUser/getContracts",
      contractsList: "contract/getContracts",
      software: "software/getSoftwareList",
      userList: "users/getUsers",
      getUserLanguage: "configuration/getUserLanguage",
      getQueryAdditionalFilters: "filter/queryAdditionalFilters",
      clientList: "client/getClients"
    }),

    clientsListFilter() {
      return (this.clientList || []).map(({ _id, name }) => ({ id: _id, name }));
    },

    contractsListFilter() {
      return (this.contractsList || []).map(({ _id, name, client }) => ({ id: _id, name, client }));
    },

    customFiltersByType() {
      return this.$store.getters["filter/customFiltersByType"]("REQUEST");
    },

    categoriesRequestsFilters() {
      let categories = Object.keys(CATEGORIES_REQUESTS_FILTERS).map(category => ({
        key: category,
        value: this.$i18n.t(CATEGORIES_REQUESTS_FILTERS[category])
      }));

      if (this.customFiltersByType) {
        categories.unshift({ key: "custom_filters", value: this.$i18n.t("Stored selections") });
      }

      return categories;
    },

    typesRequestsFilters() {
      return Object.keys(TYPES_REQUESTS_FILTERS).map(type => ({
        id: this.capitalize(type),
        name: this.$i18n.t(TYPES_REQUESTS_FILTERS[type])
      }));
    },

    severitiesRequestsFilters() {
      return Object.keys(SEVERITIES_REQUESTS_FILTERS).map(severity => ({
        id: this.capitalize(severity),
        name: this.$i18n.t(SEVERITIES_REQUESTS_FILTERS[severity])
      }));
    },

    statusRequestsFilters() {
      return Object.keys(STATUS_REQUESTS_FILTERS).map(status => ({
        id: this.capitalize(status),
        name: this.$i18n.t(STATUS_REQUESTS_FILTERS[status])
      }));
    },

    softwareList() {
      return (this.software || []).map(({ _id, name }) => ({ id: _id, name }));
    },

    highlightSearch() {
      return this.search ? this.search : "";
    },

    displayUserContracts() {
      return this.userContracts.map(userContract => userContract.contract.name).join(", ");
    },

    requestsAsDataTable() {
      return this.requests.map(request => ({
        _id: request._id,
        author: request.author && request.author.name,
        type: request.type,
        severity: request.severity,
        software: request.software,
        softwareName: request.software && request.software.software && request.software.software.name,
        title: request.title,
        assignedTo: request.assignedTo && request.assignedTo.name,
        responsible: request.responsible && request.responsible.name,
        customer: request.customer,
        updatedAt: request.timestamps.updatedAt,
        createdAt: request.timestamps.createdAt,
        status: request.status,
        cnsType: this.calculateCnsType(request),
        request
      }));
    },
    ...mapState({
      rowsPerPageItems: state => state.pagination.rowsPerPageItems
    }),

    pagination: {
      get: function() {
        return this.$store.getters["ticket/pagination"];
      },
      set: function(value) {
        this.$store.dispatch("ticket/setPagination", value);
      }
    },

    centralSearch: {
      get: function() {
        return this.$store.getters["ticket/getSearch"];
      },

      set: function(value) {
        this.$store.dispatch("ticket/setSearch", value || "");
      }
    },

    isSearching() {
      return !!this.centralSearch;
    },
    userLanguage() {
      return this.getUserLanguage || LOCALE;
    }
  },
  watch: {
    categoriesFilter: function() {
      try {
        switch (this.categoriesFilter) {
          case "type":
            this.values = this.typesRequestsFilters;
            break;
          case "severity":
            this.values = this.severitiesRequestsFilters;
            break;
          case "software":
            this.values = [...this.softwareList];
            break;
          case "assignto":
            this.keyValueFilter = false;
            this.values = [...this.userList].map(user => ({ name: user.name, id: user.user }));
            break;
          case "responsible":
            this.values = [...this.userList]
              .filter(user => user.type != "beneficiary")
              .map(user => ({ name: user.name, id: user.user }));
            break;
          case "author":
            this.values = [...this.userList].map(user => ({ name: user.name, id: user.user }));
            break;
          case "client":
            this.values = [...this.clientsListFilter];
            break;
          case "contract":
            this.values = [...this.contractsListFilter];
            break;
          case "status":
            this.values = this.statusRequestsFilters;
            break;
        }
      } catch (err) {
        // continue regardless of error
      }
    },
    pagination: {
      handler() {
        if (this.isSearching) {
          return;
        }
        this.loadTickets();
      },
      deep: true
    }
  },
  methods: {
    loadTickets() {
      this.loading = true;
      this.$store
        .dispatch("ticket/fetchTickets")
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Error while loading tickets"),
            color: "error"
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },

    requestsFilter(items, search, Filter) {
      if (this.ticketsFilter.length) {
        items = items.filter(item => item.request.team.toLowerCase() == this.ticketsFilter);
      }
      return items.filter(item => Filter(item, search.toLowerCase()));
    },

    requestFilterByGroup(item) {
      const request = item.request;
      let match = false;
      let typesFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "type");
      let severityFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "severity");
      let softwareFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "software");
      let assignedFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "assignto");
      let responsibleFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "responsible");
      let transmitterFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "author");
      let clientFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "contract");
      let statusFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "status");

      let typesFilterMatch = true;
      let severityFilterMatch = true;
      let softwareFilterMatch = true;
      let assignedFilterMatch = true;
      let responsibleFilterMatch = true;
      let transmitterFilterMatch = true;
      let clientFilterMatch = true;
      let statusFilterMatch = true;

      if (typesFilter.length) {
        typesFilterMatch = false;

        typesFilter.forEach(currentFilter => {
          if (request.type.toLowerCase() == currentFilter.value.toLowerCase()) {
            typesFilterMatch = true;
          }
        });
      }

      if (severityFilter.length) {
        severityFilterMatch = false;

        severityFilter.forEach(currentFilter => {
          if (request.severity && request.severity.toLowerCase() == currentFilter.value.toLowerCase()) {
            severityFilterMatch = true;
          }
        });
      }

      if (softwareFilter.length) {
        softwareFilterMatch = false;

        softwareFilter.forEach(currentFilter => {
          if (
            request.software &&
            request.software.software &&
            request.software.software.name &&
            request.software.software.name.toLowerCase() == currentFilter.value.toLowerCase()
          ) {
            softwareFilterMatch = true;
          }
        });
      }

      if (responsibleFilter.length) {
        responsibleFilterMatch = false;

        responsibleFilter.forEach(currentFilter => {
          if (request.responsible) {
            responsibleFilterMatch = request.responsible.name.toLowerCase() === currentFilter.value.toLowerCase();
          }
        });
      }

      if (assignedFilter.length) {
        assignedFilterMatch = false;

        assignedFilter.forEach(currentFilter => {
          if (request.assignedTo && request.assignedTo.name) {
            assignedFilterMatch = request.assignedTo.name.toLowerCase() === currentFilter.value.toLowerCase();
          }
        });
      }

      if (transmitterFilter.length) {
        transmitterFilterMatch = false;

        transmitterFilter.forEach(currentFilter => {
          if (request.author) {
            if (request.author.name && request.author.name.toLowerCase() == currentFilter.value.toLowerCase()) {
              transmitterFilterMatch = true;
            } else if (
              request.author.displayName &&
              request.author.displayName.toLowerCase() == currentFilter.value.toLowerCase()
            ) {
              transmitterFilterMatch = true;
            }
          }
        });
      }

      if (clientFilter.length) {
        clientFilterMatch = false;

        clientFilter.forEach(currentFilter => {
          if (request.contractName && request.contractName.toLowerCase() == currentFilter.value.toLowerCase()) {
            clientFilterMatch = true;
          }
        });
      }

      if (statusFilter.length) {
        statusFilterMatch = false;

        statusFilter.forEach(currentFilter => {
          if (request.status.toLowerCase() == currentFilter.value.toLowerCase()) {
            statusFilterMatch = true;
          }
        });
      }

      match =
        typesFilterMatch &&
        severityFilterMatch &&
        softwareFilterMatch &&
        assignedFilterMatch &&
        responsibleFilterMatch &&
        transmitterFilterMatch &&
        clientFilterMatch &&
        statusFilterMatch;

      if (match && this.search) {
        return (
          request._id.toString().includes(this.search) ||
          (request.softwareName && request.softwareName.toLowerCase().includes(this.search)) ||
          request.description.toLowerCase().includes(this.search) ||
          request.title.toLowerCase().includes(this.search) ||
          (request.clientName && request.clientName.toLowerCase().includes(this.search)) ||
          (request.contractName && request.contractName.toLowerCase().includes(this.search)) ||
          request.status.toLowerCase().includes(this.search) ||
          (request.assignedToName && request.assignedToName.toLowerCase().includes(this.search)) ||
          (request.responsibleName && request.responsibleName.toLowerCase().includes(this.search)) ||
          (request.authorName && request.authorName.toLowerCase().includes(this.search)) ||
          (request.type && request.type.toLowerCase().includes(this.search)) ||
          (request.severity && request.severity.toLowerCase().includes(this.search))
        );
      }

      return match;
    },

    calculateCnsType({ status, type }) {
      if (!status) return TICKET_STATUS.NEW;
      if (type !== REQUEST_TYPE.ANOMALY && status === TICKET_STATUS.SUPPORTED) {
        return CNS_TYPES.RESOLUTION;
      }
      if (status === TICKET_STATUS.SUPPORTED) return CNS_TYPES.BYPASS;
      if (status === TICKET_STATUS.NEW) return CNS_TYPES.SUPPORT;
      if (status === TICKET_STATUS.BYPASSED) return CNS_TYPES.RESOLUTION;
      else return "";
    },

    displayCnsProgressBar(item) {
      return item.status !== "closed" && item.status !== "resolved" && item.request.cns.bypassed;
    },
    cnsWording({ status, type }) {
      const wording = type === REQUEST_TYPE.ANOMALY ? ANOMALY_CNS_STATUS[status] : CNS_STATUS[status];
      if (wording === ANOMALY_CNS_STATUS.closed) return;
      return this.$i18n.t(wording || status);
    },
    capitalize(value) {
      return capitalize(value);
    },

    changeFilterCategory(category) {
      this.categoriesFilter = category;
    },

    changeSearchTerm(searchTerm) {
      this.search = searchTerm;
      this.centralSearch = searchTerm;
    },

    filterReset() {
      this.customFilters = [];
      this.centralSearch = "";
      this.categoriesFilter = "";
      this.valuesFilter = "";
      this.search = "";
      this.pageTitle = this.$i18n.t("All requests");
    },

    updateCustomFilters(customFilters) {
      this.customFilters = customFilters;
      if (this.customFilters.length) {
        this.centralSearch = this.customFilters[0].value;
      } else {
        this.centralSearch = "";
        this.pageTitle = this.$i18n.t("All requests");
      }
    },

    changePageTitle(newTitle) {
      this.pageTitle = newTitle;
    },

    fetchUserFilters() {
      this.$http.listCustomFilters().then(({ data }) => {
        this.savedFilters = data;
      });
    },

    submitFilter() {
      const query = {};

      if (this.$route.query.filter) {
        query.filter = this.$route.query.filter;
      }

      query.a = this.getQueryAdditionalFilters;
      this.$store.dispatch("ticket/resetTickets");
      this.$router.push({ name: routeNames.REQUESTS, query });
    }
  },
  created() {
    this.$auth.ready(() => {
      this.$store.dispatch("currentUser/fetchUser");
    });
    this.$store.dispatch("client/fetchClients");
    this.$store.dispatch("ticket/setFilter", this.$route.query.filter);

    if (this.$route.query.a) {
      const filtersParams = JSON.parse(this.$route.query.a);
      const filters = Object.entries(filtersParams).reduce((filtersList, [category, filters]) => {
        filtersList = [...filtersList, ...filters.map(filter => ({ category, value: filter }))];
        return filtersList;
      }, []);

      this.$store.dispatch("filter/resetAdditionalFilter");
      filters.map(filter => this.$store.dispatch("filter/addAdditionalFilter", filter));
    } else {
      this.$store.dispatch("filter/resetAdditionalFilter");
    }
  },
  components: {
    ExportCsvButton,
    "cns-progress-bar": cnsProgressBar,
    SoftwareListDetail,
    ClientContractLinks,
    OrganizationLabel,
    RequestFilterList,
    additionalFilters
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

.v-input.pa-0.v-text-field.v-select.v-select--is-menu-active.v-autocomplete.v-input--is-focused.primary--text,
.v-input.pa-0.v-text-field.v-select {
  width: 200px !important;
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
  padding: 0px 5px !important;
  text-align: center;
}

th.column.sortable.text-xs-left {
  padding: 0px 15px !important;
  text-align: center !important;
}

div.v-input.scoped-requests-searchv-text-field--enclosed.v-text-field--placeholder,
> div, > div, > div.v-input__append-inner,
> div,
div.v-input.scoped-requests-searchv-text-field--enclosed.v-select {
  max-width: 250px;
}

.criticality {
  font-weight: bold;
  padding: 5px;
  border-radius: 2px;
}

.criticality.standard {
  background-color: #e0e0e0;
  color: black;
}

.criticality.sensible {
  background-color: #ffa000;
  color: white;
}

.criticality.critical {
  background-color: #d32f2f;
  color: white;
}

.action-links {
  text-decoration: none;
  color: grey;
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

div.layout:nth-child(5) {
  clear: both;
  padding-top: 24px;
}

span.v-chip__content {
  color: #fff !important;
}

table.v-table tbody td {
  font-size: 12px;
}

nav.v-toolbar .v-toolbar__content {
  height: auto;
}

.v-toolbar__title {
  font-size: 15px;
}

@media only screen and (max-width: 768px) {
  .actions_filters {
    flex-direction: column !important;
  }
}

.item-id {
  font-size: 13px;
  font-weight: 500;
}

.truncated &::v-deep div.v-select__selection--comma{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
&::v-deep table.v-table  tr:nth-child(1) td {
padding: 0 5px;
font-size: 12px;
}
</style>
