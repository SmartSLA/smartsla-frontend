<template>
  <div class="requests-list">
    <div class="page-title">
      <span>Requests list (TICKETS)</span>
    </div>

    <div class="tickets-search">
      <v-btn-toggle v-model="toggle_multiple" class="transparent">
        <v-btn value="1" flat>{{ $t("Opened") }}</v-btn>
        <v-btn value="2" flat>{{ $t("In progress") }}</v-btn>
        <v-btn value="3" flat>{{ $t("Closed") }}</v-btn>
      </v-btn-toggle>
      <v-spacer class="mx-2"></v-spacer>
      <v-select
        solo
        :items="teams"
        v-model="teamsFilter"
        hide-details
        class="scoped-requests-search"
        label="All teams"
        @input="$emit('input')"
      ></v-select>
      <v-spacer class="mx-2"></v-spacer>
      <v-text-field
        v-model="search"
        :placeholder="$t('Search')"
        single-line
        hide-details
        solo
        class="scoped-requests-search"
      >
        <template v-slot:append class="appended-select-scope">
          <v-divider vertical></v-divider>
          <v-select :items="filterGroups" v-model="searchCriteria" dense single-line hide-details solo flat></v-select>
          <v-divider vertical></v-divider>
          <v-icon @click="resetRequestSearch" outline class="pl-2">close</v-icon>
        </template>
      </v-text-field>
    </div>

    <v-layout>
      <v-data-table
        :headers="headers"
        :items="requests"
        class="elevation-1"
        :search="search"
        :custom-filter="requestsFilter"
        :filter="requestFilterByGroup"
        :pagination.sync="pagination"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
            <router-link :to="{ name: 'Request', params: { id: props.item.number } }">{{
              props.item.number
            }}</router-link>
          </td>
          <td>
            <router-link :to="{ name: 'Request', params: { id: props.item.ticket_number } }">{{
              props.item.ticket_number
            }}</router-link>
          </td>
          <td class="text-xs-center">
            <v-badge v-if="props.item.id_ossa == 1" color="#5bc0de">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
            <v-badge v-if="props.item.id_ossa == 2" color="#f0ad4e">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
            <v-badge v-if="props.item.id_ossa == 3" color="#d9534f">
              <template v-slot:badge>
                <span>{{ props.item.id_ossa }}</span>
              </template>
            </v-badge>
          </td>
          <td class="text-xs-center">{{ props.item.severity }}</td>
          <td class="text-xs-center">
            <v-progress-linear
              v-if="props.item.conf.color == 'error'"
              color="error"
              height="20"
              value="30"
            >
              {{ props.item.remaining_time }}
            </v-progress-linear>
            <v-progress-linear
              v-if="props.item.conf.color == 'warning'"
              color="warning"
              height="20"
              value="50"
            >
              {{ props.item.remaining_time }}
            </v-progress-linear>
            <v-progress-linear
              v-if="props.item.conf.color == 'info'"
              color="info"
              height="20"
              value="80"
            >
              {{ props.item.remaining_time }}
            </v-progress-linear>
          </td>
          <td class="text-xs-center">{{ props.item.status }}</td>
          <td class="text-xs-center">{{ props.item.responsible }}</td>
          <td class="text-xs-center">{{ props.item.transmitter }}</td>
          <td class="text-xs-center">{{ props.item.type }}</td>
          <td class="text-xs-center">
            <a href="#">{{ props.item.client_contrat }}</a>
          </td>
          <td class="text-xs-center">
            <span v-if="props.item.software == 'LibreOffice'" class="major-criticality">{{ props.item.software }}</span>
            <span v-else class="minor-criticality">{{ props.item.software }}</span>
          </td>
          <td class="text-xs-center">{{ props.item.incident_wording }}</td>
          <td class="text-xs-center">{{ props.item.maj }}</td>
          <td class="text-xs-center">{{ props.item.created }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </div>
</template>

<script>
var requests = require("@/assets/data/requests.json");
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      filterGroups: ["Ticket", "Client / Contract", "Responsible", "Software"],
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
      search: null,
      toggle_multiple: "2",
      teamsFilter: {
        text: "All Teams",
        value: ""
      },
      isMobile: false,
      headers: [
        { text: "#", value: "number" },
        { text: "Ticket N°", value: "ticket_number" },
        { text: "ID OSSA", value: "id_ossa" },
        { text: "Severity", value: "severity" },
        { text: "Remaining time", value: "remaining_time" },
        { text: "Status", value: "status" },
        { text: "Responsible", value: "responsible" },
        { text: "Transmitter", value: "transmitter" },
        { text: "Type", value: "type" },
        { text: "Client / Contrat", value: "client_contrat" },
        { text: "Software", value: "software" },
        { text: "Incident wording", value: "incident_wording" },
        { text: "MAJ", value: "maj" },
        { text: "Created", value: "created" }
      ],
      requests: []
    };
  },
  mounted() {
    this.$http.getTickets(this.email).then(response => (this.requests = response.data));
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
  methods: {
    resetRequestSearch() {
      this.search = null;
      this.teamsFilter = "";
      this.searchCriteria = this.filterGroups[0];
    },

    requestsFilter(items, search, Filter) {
      if (this.teamsFilter.length) {
        items = items.filter(item => item.team.toLowerCase() == this.teamsFilter);
      }
      return items.filter(item => Filter(item, search.toLowerCase()));
    },

    requestFilterByGroup(item, search) {
      switch (this.searchCriteria) {
        case "Ticket":
          return item.incident_wording.toLowerCase().includes(search);
        case "Client / Contract":
          return item.client_contract.toLowerCase().includes(search);
        case "Responsible":
          return item.incident_wording.toLowerCase().includes(search);
        case "Software":
          return item.software.toLowerCase().includes(search);
        default:
          return false;
      }
    }
  }
};
</script>
<style type="stylus" scoped>
.elevation-1 {
  width: 100% !important;
  padding-bottom: 50px;
  background-color: #ffffff;
}
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
  background-color: #2196f3;
  color: #fff;
}
.v-item-group.transparent.theme--light.v-btn-toggle {
  margin-top: 10px;
}
.v-input.pa-0.v-text-field.v-text-field--single-line.v-select.v-select--is-menu-active.v-autocomplete.v-overflow-btn.v-input--hide-details.v-input--is-focused.theme--light.primary--text,
.v-input.pa-0.v-text-field.v-text-field--single-line.v-select.v-autocomplete.v-overflow-btn.v-input--hide-details.theme--light {
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
  padding: 2px !important;
  text-align: center;
}
th.column.sortable.text-xs-left {
  padding: 2px !important;
  text-align: center !important;
}
.scoped-requests-search {
  padding-top: 10px !important;
}

div.v-input.scoped-requests-search.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-text-field--placeholder.v-input--hide-details.theme--light
  > div
  > div
  > div.v-input__append-inner
  > div,
div.v-input.scoped-requests-search.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--enclosed.v-select.v-input--hide-details.theme--light {
  max-width: 150px;
}
.major-criticality {
  background-color: #d9534f;
  color: #ffffff;
  font-weight: bold;
  padding: 2px;
  border-radius: 5px;
}
</style>
