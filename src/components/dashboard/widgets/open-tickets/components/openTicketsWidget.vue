<template>
  <v-card class="rounded-card" id="open-tickets">
    <v-card-title primary-title class="title">
      {{ $t("chartTitleOpenTickets") }}
      <v-spacer></v-spacer>
      <image-download-btn :name="$t('chartTitleOpenTickets')"></image-download-btn>
    </v-card-title>
    <v-card-text v-if="requests.length">
      <open-tickets-chart :datasets="requests"></open-tickets-chart>
    </v-card-text>
    <v-card-text v-else class="text-md-center">
      {{ $t("No data available") }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import OpenTicketsChart from "@/components/dashboard/widgets/open-tickets/components/openTicketsChart.vue";
import ImageDownloadBtn from "@/components/dashboard/base/ImageDownloadBtn.vue";

export default {
  data: () => ({}),
  components: {
    OpenTicketsChart,
    ImageDownloadBtn
  },
  computed: {
    ...mapGetters({
      requests: "openTickets/getData",
      interval: "openTickets/getInterval"
    })
  },
  created() {
    this.$store.dispatch("openTickets/fetchData");
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("openTickets/updateInterval", interval);
    }
  }
};
</script>

<style lang="stylus">
.rounded-card {
  border-radius: 10px;
}
</style>
