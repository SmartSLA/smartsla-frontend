<template>
  <v-card class="rounded-card" height="100%">
    <v-card-title primary-title class="title">
      {{ $t("chartTitle") }}
    </v-card-title>
    <v-card-text v-if="requests.length">
      <criticality-chart :datasets="requests" v-if="requests.length"></criticality-chart>
    </v-card-text>
    <v-card-text v-else class="text-md-center">
      {{ $t("No data available") }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import CriticalityChart from "@/components/dashboard/widgets/criticality-tickets/components/criticalityChart.vue";

export default {
  components: {
    CriticalityChart
  },
  computed: {
    ...mapGetters({
      requests: "criticalityTickets/getData",
      interval: "criticalityTickets/getInterval"
    })
  },
  created() {
    this.$store.dispatch("criticalityTickets/fetchData");
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("criticalityTickets/updateInterval", interval);
    }
  }
};
</script>

<style scoped lang="stylus"></style>
