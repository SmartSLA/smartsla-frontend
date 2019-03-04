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
      requests: [
        {
          number: 1,
          software: "USPL PILE ICASSO",
          date: "10/04/2016_09/04/2017",
          status: "In progress",
          voir: "VOIR"
        },
        {
          number: 2,
          software: "USL STANDARD LIMESURVEY",
          date: "21/03/2015_20/03/2016",
          status: "Done",
          voir: "VOIR"
        },
        {
          number: 3,
          software: "USP CRITIQUE PAQUET SYSTEME CENTOS",
          date: "11/05/2016_10/05/2017",
          status: "In progress",
          voir: "VOIR"
        },
        {
          number: 4,
          software: "USP STANDARD PAQUET NOSQL",
          date: "11/05/2016_10/05/2017",
          status: "In progress",
          voir: "VOIR"
        },
        {
          number: 5,
          software: "USL CRITIQUE DRUPAL",
          date: "11/02/2016_10/05/2017",
          status: "In progress",
          voir: "VOIR"
        }
      ]
    };
  },
  created() {
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
