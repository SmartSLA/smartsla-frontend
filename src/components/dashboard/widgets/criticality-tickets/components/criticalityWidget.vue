<template>
  <v-card class="rounded-card">
    <v-card-title primary-title class="pl-0">
      <v-spacer></v-spacer>
      <time-duration-changer-dropdown @setDuration="setInterval" :selectedInterval="interval" />
    </v-card-title>
    <v-card-text v-if="requests.length">
      <criticality-chart :datasets="requests" v-if="requests.length"></criticality-chart>
    </v-card-text>
    <v-card-text v-else>
      {{ $t("No data available") }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import CriticalityChart from "@/components/dashboard/widgets/criticality-tickets/components/criticalityChart.vue";
import TimeDurationChangerDropdown from "@/components/dashboard/base/TimeDurationChangerDropdown.vue";

export default {
  components: {
    CriticalityChart,
    TimeDurationChangerDropdown
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
