<template>
  <v-card class="rounded-card" width="100%">
    <v-card-title primary-title class="title">
      {{ $t("chartTitleTicketsSoftware") }}
    </v-card-title>
    <v-card-text v-if="requests.length">
      <open-tickets-software-chart :datasets="requests"></open-tickets-software-chart>
    </v-card-text>
    <v-card-text v-else class="text-md-center">
      {{ $t("No data available") }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
// eslint-disable-next-line max-len
import OpenTicketsSoftwareChart from "@/components/dashboard/widgets/open-tickets-software/components/openTicketsSoftwareChart.vue";

export default {
  components: {
    OpenTicketsSoftwareChart
  },
  computed: {
    ...mapGetters({
      requests: "OpenTicketsBySoftware/getData",
      interval: "OpenTicketsBySoftware/getInterval"
    })
  },
  created() {
    this.$store.dispatch("OpenTicketsBySoftware/fetchData");
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("OpenTicketsBySoftware/updateInterval", interval);
    }
  }
};
</script>

<style lang="stylus">
.rounded-card {
  border-radius: 10px;
}
</style>
