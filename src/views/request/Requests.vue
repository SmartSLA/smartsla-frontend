<template>
  <div class="requests-list">
    <v-layout align-center justify-space-between row mb-2>
      <v-flex xs6>
        <v-layout align-center row>
          <span class="action-links">
            <v-icon class="mr-2">format_list_numbered</v-icon>
            <span>{{ pageTitle }}</span>
          </span>
          <v-btn flat small
            color="error" 
            @click="deleteDialog = true"
            v-show="showDeleteBtn"
          >
            <v-icon class="mr-2">delete_outline</v-icon> {{ $t("Delete filter") }}
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <v-layout justify-end row>
          <div>
            <download-excel :data="requests" >
              <v-btn flat small color="default">
                <v-icon class="mr-2">backup</v-icon> {{ $t("Export sheet") }}
              </v-btn>
            </download-excel>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout column mb-2 mt-4 class="filter_layout">
      <v-flex xs12 md4 mb-2>
        <v-toolbar flat dense>
          <v-toolbar-title class="pl-2 pr-2 grey--text hidden-sm-and-down">{{ $t("Filter by:") }}</v-toolbar-title>
          <v-divider vertical></v-divider>
          <v-overflow-btn
            :items="categories"
            :label="$i18n.t('Categories')"
            class="py-0"
            hide-details
            flat
            overflow
            item-text="value"
            item-value="key"
            v-model="categoriesFilter"
          ></v-overflow-btn>
          <v-divider vertical></v-divider>
        </v-toolbar>
      </v-flex>
      <v-flex xs12 md4 mb-4>
        <v-toolbar flat dense>
          <v-layout align-center justify-end>
            <v-overflow-btn
              v-if="translatedFilter"
              :items="values"
              :label="$i18n.t('Values')"
              v-model="valuesFilter"
              class="pa-0"
              overflow
              flat
              item-text="value"
              item-value="key"
              hide-details
              hide-selected
            ></v-overflow-btn>
            <v-overflow-btn
              v-else
              :items="values"
              :label="$i18n.t('Values')"
              v-model="valuesFilter"
              flat
              hide-details
              hide-selected
              class="pa-0"
              overflow
            ></v-overflow-btn>
            <v-toolbar-side-icon @click="addNewFilter">
              <v-icon dark>add</v-icon>
            </v-toolbar-side-icon>
          </v-layout>
        </v-toolbar>
      </v-flex>
      <v-flex md1 mb-4 class="hidden-sm-and-down"></v-flex>
      <v-flex xs12 md4 mb-4>
        <v-toolbar flat dense>
          <v-toolbar-title class="pl-2 pr-2 grey--text">{{ $t("And") }}</v-toolbar-title>
          <v-divider vertical></v-divider>
          <v-layout align-center justify-end>
            <v-overflow-btn
              :items="savedFilters"
              :label="$i18n.t('Stored selections')"
              v-model="storedSelectionsFilterHolder"
              hide-selected
              hide-details
              class="pa-0"
              overflow
              flat
              return-object
              item-text="name"
            ></v-overflow-btn>
            <v-divider vertical></v-divider>
            <v-toolbar-side-icon @click="loadFilter">
              <v-icon dark>add</v-icon>
            </v-toolbar-side-icon>
          </v-layout>
        </v-toolbar>
      </v-flex>
      <v-flex md1 mb-4 class="hidden-sm-and-down"></v-flex>
      <v-flex xs12 md4>
        <v-toolbar flat dense>
          <v-layout align-center justify-end>
            <v-text-field
              v-model="search"
              prepend-inner-icon="search"
              :placeholder="$i18n.t('Search')"
              clearable
              solo
              class="mt-2"
              flat
            ></v-text-field>
          </v-layout>
        </v-toolbar>
      </v-flex>
    </v-layout>
  
    <v-layout justify-space-between row class="actions_filters">
      <div>
        <ul>
          <li v-for="(filter, key) in customFilters" :key="key" class="chips-elements">
            <v-chip @input="removeFilter(filter)" close>{{ filter.category }} : {{ filter.value }}</v-chip>
          </li>
        </ul>
      </div>
      <div v-if="customFilters.length > 0" class="filter-save mt-2">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on }">
            <v-layout align-center justify-space-between row>
              <div>
                <v-btn flat small color="default" v-on="on" v-show="isNewFilter || updateBtn">
                  <v-icon class="mr-2">playlist_add</v-icon>  {{ $i18n.t("Create new filter") }}
                </v-btn>
                <a
                  href="#"
                  @click="updateCurrectFilter"
                  v-show="updateBtn"
                  class="font-italic action-links warning--text ml-2"
                >
                  <v-icon class="mr-2 warning--text">save_alt</v-icon>
                  {{ $i18n.t("save") }}
                </a>
              </div>
              <div>
                <v-btn flat small color="default" @click="resetFilters" v-on="on">
                  <v-icon class="mr-2">refresh</v-icon> {{ $i18n.t("reset") }}
                </v-btn>
              </div>
            </v-layout>
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
    </v-layout>

    <v-dialog v-model="deleteDialog" persistent max-width="290" v-if="storedSelectionsFilter.name">
      <v-card class="px-4 pt-2">
        <v-card-text>
          <span
            class="body-2"
          >{{ $t("are you sure you want to remove the filter") }} "{{ storedSelectionsFilter.name }}"?</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteCurrentFilter">{{ $t("confirm") }}</v-btn>
          <v-btn color="error" @click="deleteDialog = false">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-layout>
      <v-data-table
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalRequests"
        :items="requestsAsDataTable"
        :headers="headers"
        class="elevation-1"
        :search="centralSearch"
        :custom-filter="requestsFilter"
        :filter="requestFilterByGroup"
        :rows-per-page-items="rowsPerPageItems"
        :rows-per-page-text="$t('Rows per page:')"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
        item-key="_id"
        ref="requestsTable"
      >
        <template slot="items" slot-scope="props">
          <td>
            <router-link
              :to="{ name: 'Request', params: { id: props.item._id } }"
              class="blue-color"
            >{{ props.item._id }}</router-link>
          </td>
          <td class="text-xs-center">
            <v-chip
              v-if="props.item.request.assignedTo && props.item.request.assignedTo.type == 'beneficiary'"
              color="#174dc5"
              class="ma-2"
              label
              text-color="white"
              >{{ props.item.request.contract.client[0] }}
            </v-chip>
            <v-chip v-else color="#d32f2f" class="ma-2" label text-color="white">L</v-chip>
          </td>
          <td class="text-xs-center" v-if="$auth.check('admin')">
            <v-avatar :color="getOssaConfById(props.item.id_ossa || 1).color" size="25">
              <span class="white--text">{{ props.item.id_ossa || 1 }}</span>
            </v-avatar>
          </td>
          <td class="text-xs-center">{{ $t(props.item.type) }}</td>
          <td class="text-xs-center">
            <software-list-detail :request="props.item.request"></software-list-detail>
          </td>
          <td class="text-xs-center">
            <v-tooltip top v-if="props.item.request.software && props.item.request.software.software">
              <template v-slot:activator="{ on }">
                <span v-bind:class="['criticality', props.item.request.software.critical]" v-on="on">
                  {{ props.item.softwareName }}
                </span>
              </template>
              <span>{{
                $t("Version : " + props.item.request.software.version + " / Criticité : " + props.item.request.software.critical)
              }}</span>
            </v-tooltip>
          </td>
          <td class="text-xs-center">{{ props.item.title | striphtml }}</td>
          <td class="text-xs-center">{{ props.item.assignedTo }}</td>
          <td class="text-xs-center">{{ props.item.responsible }}</td>
          <td class="text-xs-center">{{ props.item.author }}</td>
          <td class="text-xs-center">
            <router-link
              v-if="$auth.check('admin')"
              :to="{ name: 'Client', params: { id: props.item.request.contract.clientId } }"
              target="_blank"
            >
              <span class="blue-color"> {{ props.item.request.contract.client }} </span>
            </router-link>
            <span v-else>{{ props.item.request.contract.client }}</span>
            /
            <router-link
              v-if="$auth.check('admin')"
              :to="{name: 'Contract', params: {id: props.item.request.contract._id}}"
              target="_blank"
            >
              <span class="blue-color"> {{ props.item.request.contract.name }} </span>
            </router-link>
            <span v-else>{{ props.item.request.contract.name }}</span>
          </td>
          <td class="text-xs-center">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <span v-on="on">{{ props.item.updatedAt | relativeTime }}</span>
                </template>
                <span>{{ props.item.updatedAt | formatDateFilter('llll')  }}</span>
              </v-tooltip>
          </td>
          <td class="text-xs-center">{{ props.item.createdAt | formatDateFilter('ll') }}</td>
          <td class="text-xs-center">{{ $t(capitalize(props.item.status)) }}</td>
          <td class="text-xs-center">
            <span>{{ $t(cnsWording(props.item.status)) }}</span>
            <cns-progress-bar
              v-if="displayCnsProgressBar(props.item.status)"
              :ticket="props.item.request"
              :cnsType="props.item.cnsType"
              :hideClock="true"
              @cns-calculated="collectCNS"
            ></cns-progress-bar>
          </td>
        </template>
      </v-data-table>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, createNamespacedHelpers } from "vuex";
import Vue from "vue";
import { capitalize } from "lodash";
import moment from "moment";
import JsonExcel from "vue-json-excel";
import cnsProgressBar from "@/components/CnsProgressBar";
import SoftwareListDetail from "@/components/request/SoftwareListDetail";
import { OSSA_IDS } from '@/constants.js';

const { mapState } = createNamespacedHelpers("ticket")

Vue.component("downloadExcel", JsonExcel);

const CNS_STATUS = {
  new: "cns.state.support",
  supported: "cns.state.bypass",
  bypassed: "cns.state.resolution",
  resolved: "cns.state.closure"
};

export default {
  data() {
    return {
      loading: true,
      dialog: false,
      deleteDialog: false,
      pageTitle: this.$i18n.t("All requests"),
      storedFilterUpdated: false,
      filterGroups: ["Ticket", "Client / Contract", "Software"],
      tickets: [
        {
          text: this.$i18n.t("All tickets"),
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
      search: null,
      toggle_multiple: "2",
      ticketsFilter: {
        text: this.$i18n.t("All tickets"),
        value: ""
      },
      isMobile: false,
      headers: [
        { text: this.$i18n.t("Ticket N°"), value: "_id" },
        { text: this.$i18n.t("Organization"), value: "organization" },
        { text: this.$i18n.t("ID OSSA"), value: "id_ossa" },
        { text: this.$i18n.t("Type"), value: "type" },
        { text: this.$i18n.t("Severity"), value: "severity", sortable: false },
        { text: this.$i18n.t("Software"), value: "softwareName" },
        { text: this.$i18n.t("Title"), value: "title" },
        { text: this.$i18n.t("Assigned to"), value: "assignedTo" },
        { text: this.$i18n.t("Responsible"), value: "responsible" },
        { text: this.$i18n.t("Author"), value: "author" },
        { text: this.$i18n.t("Client / Contrat"), value: "client_contrat", sortable: false },
        { text: this.$i18n.t("MAJ"), value: "updatedAt" },
        { text: this.$i18n.t("Created"), value: "createdAt" },
        { text: this.$i18n.t("Status"), value: "status" },
        { text: this.$i18n.t("In process of being"), value: "cns_type" }
      ],
      categories: [
        {
          key: "Type",
          value: this.$i18n.t("Type")
        },
        {
          key: "Severity",
          value: this.$i18n.t("Severity")
        },
        {
          key: "Software",
          value: this.$i18n.t("Software")
        },
        {
          key: "Assign To",
          value: this.$i18n.t("Assigned to")
        },
        {
          key: "Responsible",
          value: this.$i18n.t("Responsible")
        },
        {
          key: "Transmitter",
          value: this.$i18n.t("Author")
        },
        {
          key: "Client / Contract",
          value: this.$i18n.t("Client / Contract")
        },
        {
          key: "Status",
          value: this.$i18n.t("Status")
        }
      ],
      categoriesFilter: "",
      valuesFilter: "",
      values: [],
      selections: [],
      types: [
        {
          key: "Information",
          value: this.$i18n.t("Information")
        },
        {
          key: "Anomaly",
          value: this.$i18n.t("Software anomaly")
        },
        {
          key: "Other",
          value: this.$i18n.t("Other")
        }
      ],
      severities: [
        {
          key: "Blocking",
          value: this.$i18n.t("Blocking")
        },
        {
          key: "Non-blocking",
          value: this.$i18n.t("Non blocking")
        }
      ],
      status: [
        {
          key: "new",
          value: this.$i18n.t("New")
        },
        {
          key: "supported",
          value: this.$i18n.t("Supported")
        },
        {
          key: "bypassed",
          value: this.$i18n.t("Bypassed")
        },
        {
          key: "resolved",
          value: this.$i18n.t("Resolved")
        },
        {
          key: "closed",
          value: this.$i18n.t("Closed")
        }
      ],
      translatedFilter: false,
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
      updateBtn: false,
      collectedCNS: []
    };
  },
  mounted() {
    if (this.$auth.ready() && !this.$auth.check("admin")) {
      this.headers = this.headers.filter(header => header.value != "id_ossa");
    }
    this.$http.listSoftware({}).then(({data}) => {
      data.map(software => {
        this.softwareList.push(software.name);
      });
    });
    this.$http.listUsers().then(response => {
      response.data.forEach(user => {
        this.userList.push(user);
      });
    });
    this.$http.getContracts().then(response => {
      response.data.forEach(contract => {
        this.contractClientList.push(contract.name);
      });
    });
    this.$http.listFilters().then(response => {
      this.savedFilters = response.data;
    });
  },
  computed: {
    ...mapGetters({
      email: "user/getEmail",
      requests: "ticket/getCurrentPageRequests",
      totalRequests: "ticket/getNbOfTickets"
    }),

    requestsAsDataTable() {
      return this.requests.map(request => ({
        _id: request._id,
        id_ossa: request.idOssa.id,
        organization: request.organization,
        author: request.author && request.author.name,
        type: request.type,
        severity: request.severety,
        software: request.software,
        softwareName: request.software && request.software.software && request.software.software.name,
        title: request.title,
        assignedTo: request.assignedTo && request.assignedTo.name,
        responsible: request.responsible && request.responsible.name,
        author: request.author && request.author.name,
        customer: request.customer,
        updatedAt: request.timestamps.updatedAt,
        createdAt: request.timestamps.createdAt,
        status: request.status,
        cnsType: this.calculateCnsType(request.status),
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
        this.$store.dispatch("ticket/setSearch", value);
      }
    },

    isSearching() {
      return !!this.centralSearch;
    },

    isNewFilter() {
      return Object.keys(this.storedSelectionsFilter).length === 0;
    },

    showDeleteBtn() {
      return this.deleteBtn;
    },

    exportData() {
      return this.requests.map(request => ({
        [this.$i18n.t("Id")]: request._id,
        [this.$i18n.t("ID OSSA")]: this.$i18n.t(request.idOssa.id),
        [this.$i18n.t("Type")]: this.$i18n.t(request.type),
        [this.$i18n.t("Severity")]: this.$i18n.t(request.severity),
        [this.$i18n.t("Software")]: request.software.software.name,
        [this.$i18n.t("Version")]: request.software.version,
        [this.$i18n.t("OS")]: request.software.os,
        [this.$i18n.t("Title")]: request.title,
        [this.$i18n.t("Description")]: request.description,
        [this.$i18n.t("Assigned to")]: request.assignedTo && request.assignedTo.name || this.$i18n.t("Not assigned yet"),
        [this.$i18n.t("Created by")]: request.author.name,
        [this.$i18n.t("Contract")]: request.contract.client,
        [this.$i18n.t("Beneficiary")]: request.beneficiary.name,
        [this.$i18n.t("Last update")]: moment(request.timestamps.updatedAt).lang(this.$i18n.locale).format('L'),
        [this.$i18n.t("Created at")]: moment(request.timestamps.createdAt).lang(this.$i18n.locale).format('L'),
        [this.$i18n.t("Status")]: this.$i18n.t(capitalize(request.status)),
        [this.$i18n.t("SLA support")]: this.cns(request._id, "supported"),
        [this.$i18n.t("SLA bypass")]: this.cns(request._id, "bypassed"),
        [this.$i18n.t("SLA resolution")]: this.cns(request._id, "resolved")
      }));
    },
  },
  watch: {
    categoriesFilter: function(newCategory, oldCategory) {
      try {
        switch (this.categoriesFilter) {
          case "Type":
            this.translatedFilter = true;
            this.values = [...this.types];
            break;
          case "Severity":
            this.translatedFilter = true;
            this.values = [...this.severities];
            break;
          case "Software":
            this.translatedFilter = false;
            this.values = [...this.softwareList];
            break;
          case "Assign To":
            this.translatedFilter = false;
            this.values = [...this.userList].map(user => user.name);
            break;
          case "Responsible":
            this.translatedFilter = false;
            this.values = [...this.userList].filter(user => user.type != "beneficiary").map(user => user.name);
            break;
          case "Transmitter":
            this.translatedFilter = false;
            this.values = [...this.userList].map(user => user.name);
            break;
          case "Client / Contract":
            this.translatedFilter = false;
            this.values = [...this.contractClientList];
            break;
          case "Status":
            this.translatedFilter = true;
            this.values = [...this.status];
            break;
        }
      } catch (err) {
        // continue regardless of error
      } finally {
        let selectedValues = this.customFilters.filter(filter => filter.category == this.categoriesFilter);
        this.values = this.values.filter(value => {
          return selectedValues.filter(filter => filter.value == value).length == 0;
        });
      }
    },
    search: function(newValue) {
      this.centralSearch = newValue;
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
      const request = item.request;
      let match = false;
      let typesFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "type");
      let severityFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "severity");
      let softwareFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "software");
      let assignedFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "assign to");
      let responsibleFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "responsible");
      let transmitterFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "transmitter");
      let clientFilter = this.customFilters.filter(filter => filter.category.toLowerCase() == "client / contract");
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
          if (request.severity.toLowerCase() == currentFilter.value.toLowerCase()) {
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
            responsibleFilterMatch = request.responsible.name.toLowerCase() === currentFilter.value.toLowerCase()
          }
        });
      }

      if (assignedFilter.length) {
        assignedFilterMatch = false;

        assignedFilter.forEach(currentFilter => {
          if (request.assignedTo) {
            assignedFilterMatch = request.assignedTo.name.toLowerCase() === currentFilter.value.toLowerCase()
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
          if (
            request.contract &&
            request.contract.name &&
            request.contract.name.toLowerCase() == currentFilter.value.toLowerCase()
          ) {
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
          (request.software && request.software.name && request.software.name.toLowerCase().includes(this.search)) ||
          request.description.toLowerCase().includes(this.search) ||
          request.title.toLowerCase().includes(this.search) ||
          request.contract.client.toLowerCase().includes(this.search) ||
          request.contract.name.toLowerCase().includes(this.search)
        );
      }

      return match;
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
        .then(() => {
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
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Filter updated")
          });
          this.updateBtn = false;
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
        .then(() => {
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
        return JSON.stringify(customFilter) !== JSON.stringify(filter);
      });
      if (this.customFilters.length == 0) {
        this.pageTitle = this.$i18n.t("All requests");
        this.deleteBtn = false;
        this.storedSelectionsFilter = {};
        this.centralSearch = "";
      } else {
        this.centralSearch = this.customFilters[0].value;
      }
      this.checkStoredFilterUpdate();
    },
    resetFilters() {
      this.customFilters = [];
      this.centralSearch = "";
      this.categoriesFilter = "";
      this.valuesFilter = "";
      this.search = "";
      this.pageTitle = this.$i18n.t("All requests");
      this.storedSelectionsFilterHolder = {};
      this.deleteBtn = false;
    },
    calculateCnsType(status) {
      if (!status) return "new";
      if (status === "new") return "supported";
      if (status === "supported") return "bypassed";
      if (status === "bypassed") return "resolved";
      else return "";
    },
    displayCnsProgressBar(status) {
      return !(status === "closed" || status === "resolved");
    },
    getOssaConfById(ossaId) {
      return OSSA_IDS.find(ossa => ossa.id === ossaId);
    },

    cnsWording(status) {
      return CNS_STATUS[status] || status;
    },
    cns(ticketId, type) {
      if (this.collectedCNS[ticketId]) {
        return this.$i18n.t("{hours}WH / {duration}WH", {
          hours: this.collectedCNS[ticketId].cns[type],
          duration: this.collectedCNS[ticketId].durations[type]
        });
      }

      return "";
    },
    collectCNS(value) {
      this.collectedCNS[value.ticketId] = value;
    },
    capitalize(value) {
      return capitalize(value)
    }
  },
  created() {
    this.$auth.ready(() => {
      this.$store.dispatch("user/fetchUser");
    });
  },
  components: {
    "cns-progress-bar": cnsProgressBar,
    SoftwareListDetail
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
  padding: 0px 5px !important;
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
  cursor: pointer;
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

@media only screen and (min-width: 1263px) {
  .filter_layout {
    flex-direction: row !important;
  }
}
</style>
