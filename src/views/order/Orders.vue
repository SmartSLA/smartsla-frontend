<template>
  <div class="orders-list">
    <div class="page-title">
      <span>ETAT DE TOUTES LES COMMANDES PASSEES EN EN COURS</span>
    </div>
    <v-data-table :headers="headers" :items="requests" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.number }}</td>
        <td class="text-xs-left">{{ props.item.software }}</td>
        <td class="text-xs-left">{{ props.item.date }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="text-xs-left">
          <v-btn color="info" class="view-request">{{ $t("View") }}</v-btn>
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
        { text: this.$i18n.t("N°"), value: "number" },
        { text: this.$i18n.t("UO"), value: "software" },
        { text: this.$i18n.t("Validity Dates"), value: "date" },
        { text: this.$i18n.t("Status"), value: "status" },
        { text: this.$i18n.t("View"), value: "voir" }
      ],
      requests: []
    };
  }
};
</script>

<style lang="stylus" scoped>
.page-title {
  color: #777777;
  margin-bottom: 20px;
}

.elevation-1 th {
  color: #000000;
}

.orders-list {
  width: 100% !important;
}
</style>
