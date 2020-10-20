<template>
  <v-card class="rounded-card" height="100%" id="criticality">
    <v-card-title primary-title class="title">
      {{ $t("chartTitle") }}
      <v-spacer></v-spacer>
      <image-download-btn :name="$t('chartTitle')"></image-download-btn>
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
import ImageDownloadBtn from "@/components/dashboard/base/ImageDownloadBtn.vue";

export default {
  components: {
    CriticalityChart,
    ImageDownloadBtn
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
