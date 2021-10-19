<template>
  <v-card class="rounded-card" height="100%" id="ticket-priority-anomalies-widget">
    <v-card-title primary-title>
      <div class="title">{{ $t("titleWidgetTicketsClassificationPriority") }}</div>
      <v-spacer></v-spacer>
      <image-download-btn type="table" :name="$t('titleWidgetTicketsClassificationPriority')"></image-download-btn>
    </v-card-title>
    <v-card-text>
      <div class="body">
        <v-data-table
          hide-actions
          :loading="loading"
          :items="normalizeTicketsList"
          :headers="headers"
          :no-data-text="$t('No data available')"
        >
          <template v-slot:items="props">
            <td class="text-xs-center">{{ $t(props.item.anomaly) }}</td>
            <td class="text-xs-center">{{ props.item.blockingCritical }}</td>
            <td class="text-xs-center">{{ props.item.blockingNotCritical }}</td>
            <td class="text-xs-center">
              <v-chip color="primary" outline>{{ props.item.total }}</v-chip>
            </td>
          </template>
          <template v-slot:footer>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length"></td>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length">
              <v-chip color="primary" outline>{{ footer.totalCritical }}</v-chip>
            </td>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length">
              <v-chip color="primary" outline>{{ footer.totalNotCritical }}</v-chip>
            </td>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length">
              <v-chip color="primary" outline>{{ footer.totalAll }}</v-chip>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import ImageDownloadBtn from "@/components/dashboard/base/ImageDownloadBtn.vue";

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: this.$i18n.t("Anomalie"), value: "anomaly" },
        { text: this.$i18n.t("Critical"), value: "blockingCritical" },
        { text: this.$i18n.t("notCritical"), value: "blockingNotCritical" },
        { text: this.$i18n.t("ticketCount"), value: "total" }
      ]
    };
  },
  components: {
    ImageDownloadBtn
  },
  computed: {
    ...mapGetters({
      ticketsList: "ticketsPrioritieAnomalies/getData",
      interval: "ticketsPrioritieAnomalies/getInterval"
    }),
    normalizeTicketsList() {
      if (this.ticketsList) {
        const items = [];

        for (const [key, value] of Object.entries(this.ticketsList)) {
          items.push({ anomaly: key, ...value });
        }
        return items;
      }
    },
    footer() {
      return Object.values(this.ticketsList || {}).reduce(
        (acc, current) => {
          acc.totalCritical += current.blockingCritical;
          acc.totalNotCritical += current.blockingNotCritical;
          acc.totalAll += current.blockingCritical + current.blockingNotCritical;
          return acc;
        },
        { totalCritical: 0, totalNotCritical: 0, totalAll: 0 }
      );
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch("ticketsPrioritieAnomalies/fetchData").then(() => (this.loading = false));
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("ticketsPrioritieAnomalies/updateInterval", interval);
    }
  }
};
</script>

<style lang="stylus">
.rounded-card {
  border-radius: 10px;
}
</style>
