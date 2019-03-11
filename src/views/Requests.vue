<template>
  <div class="requests-list">
    <div class="page-title">
      <span>Requests list (TICKETS)</span>
    </div>
    <v-data-table :headers="headers" :items="requests" class="elevation-1" hide-actions>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.number }}</td>
        <td class="text-xs-left">{{ props.item.date }}</td>
        <td class="text-xs-left">{{ props.item.software }}</td>
        <td class="text-xs-left">{{ props.item.criticality }}</td>
        <td class="text-xs-left">{{ props.item.incident_wording }}</td>
        <td class="text-xs-left">{{ props.item.severity }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="text-xs-left">{{ props.item.transmitter }}</td>
        <td class="text-xs-left">{{ props.item.responsible }}</td>
        <td class="text-xs-left">
          <v-btn color="info" :to="{ name: 'Request', params: { id: props.item.number } }" class="view-request">{{
            $t("VOIR")
          }}</v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
var requests = require("@/jsondata/requests.json");
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
        { text: "Responsible", value: "responsible" },
        { text: "voir", value: "voir" }
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
</style>
