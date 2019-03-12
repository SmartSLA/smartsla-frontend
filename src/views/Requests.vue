<template>
  <div class="requests-list">
    <div class="page-title">
      <span>Requests list (TICKETS)</span>
    </div>

    <div class="tickets-search">
      <v-btn-toggle v-model="toggle_multiple" class="transparent">
        <v-btn :value="1" flat>
          {{ $t("Opened") }}
        </v-btn>

        <v-btn :value="2" flat>
          {{ $t("In progress") }}
        </v-btn>

        <v-btn :value="3" flat>
          {{ $t("Closed") }}
        </v-btn>
      </v-btn-toggle>
      <v-divider class="mx-2" vertical></v-divider>
      <v-overflow-btn :items="dropdown_items" label="All Teams" hide-details class="pa-0"></v-overflow-btn>
    </div>

    <v-layout v-resize="onResize">
      <v-data-table
        :headers="headers"
        :items="requests"
        class="elevation-1"
        :search="search"
        :pagination.sync="pagination"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
      >
        <template slot="items" slot-scope="props">
          <td>
            <router-link :to="{ name: 'Request', params: { id: props.item.number } }">
              {{ props.item.number }}
            </router-link>
          </td>
          <td class="text-xs-left">{{ props.item.date }}</td>
          <td class="text-xs-left">{{ props.item.software }}</td>
          <td class="text-xs-left">{{ props.item.criticality }}</td>
          <td class="text-xs-left">{{ props.item.incident_wording }}</td>
          <td class="text-xs-left">{{ props.item.severity }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
          <td class="text-xs-left">{{ props.item.transmitter }}</td>
          <td class="text-xs-left">{{ props.item.responsible }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: "N°", value: "number" },
        { text: "Date", value: "date" },
        { text: "Software", value: "software" },
        { text: "Criticality", value: "criticality" },
        { text: "Incident wording", value: "incident_wording" },
        { text: "Severity", value: "severity" },
        { text: "Status", value: "status" },
        { text: "Transmitter", value: "transmitter" },
        { text: "Responsible", value: "responsible" }
      ],
      requests: [
        {
          number: "00001",
          date: "10/03/2018",
          software: "Elastic search",
          criticality: "Standard",
          incident_wording: "Dysfonctionnement facettes",
          severity: "Bloquant",
          status: "Contournement",
          transmitter: "Dupon",
          responsible: "Vromin"
        },
        {
          number: "00002",
          date: "12/03/2018",
          software: "GLPI",
          criticality: "Standard",
          incident_wording: "Infos manquantes Formulaire de création",
          severity: "Non Bloquant",
          status: "Rappel Utilisateur",
          transmitter: "Martin",
          responsible: "Dufon"
        },
        {
          number: "00003",
          date: "10/04/2018",
          software: "Redis",
          criticality: "Critique",
          incident_wording: "problème de lock",
          severity: "Bloquant",
          status: "Solution définitive",
          transmitter: "Bernas",
          responsible: "Maudu"
        },
        {
          number: "00004",
          date: "10/05/2018",
          software: "AngularJS",
          criticality: "standard",
          incident_wording: "Fuite mémoire",
          severity: "Bloquant",
          status: "Réponse demande",
          transmitter: "Bacron",
          responsible: "Chapy"
        },
        {
          number: "00005",
          date: "22/05/2018",
          software: "NPM",
          criticality: "standard",
          incident_wording: "Problème de droits",
          severity: "Bloquant",
          status: "Contournement",
          transmitter: "Jorac",
          responsible: "Moutou"
        }
      ],
      dropdown_items: [
        { text: "All Teams" },
        { text: "Team 1" },
        { text: "Team 2" },
        { text: "Team 3" },
        { text: "Team 4" }
      ]
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
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  methods: {
    mounted() {
      this.$http.getTickets(this.email).then(response => (this.requests = response.data));
    },
    computed: {
      ...mapGetters({
        email: "user/getEmail"
      })
    },
    created() {
      this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
    },
    beforeRouteLeave(to, from, next) {
      this.$store.dispatch("sidebar/resetCurrentSideBar");
      next();
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

@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid deeppink;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
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
  margin: 0px !important;
  padding: 0px !important;
  text-align: center;
}
.v-datatable thead th.column.sortable {
  padding: 0px;
  text-align: center !important;
}
</style>
