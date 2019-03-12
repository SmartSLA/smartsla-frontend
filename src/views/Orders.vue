<template>
  <div class="requests-list">
    <div class="page-title">
      <span>ETAT DE TOUTES LES COMMANDES PASSEES EN EN COURS</span>
    </div>
    <v-data-table :headers="headers" :items="requests" class="elevation-1" hide-actions>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.number }}</td>
        <td class="text-xs-left">{{ props.item.software }}</td>
        <td class="text-xs-left">{{ props.item.date }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="text-xs-left">
          <v-btn color="info" class="view-request">{{ $t("VOIR") }}</v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script>
var requests = require("@/assets/data/orders.json");
export default {
  data() {
    return {
      headers: [
        { text: "N°", value: "number" },
        { text: "UO", value: "software" },
        { text: "Validity Dates", value: "date" },
        { text: "Status", value: "status" },
        { text: "voir", value: "voir" }
      ],
      requests: []
    };
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
<style type="text/css" scoped>
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
.requests-list {
  width: 100%;
}
</style>
