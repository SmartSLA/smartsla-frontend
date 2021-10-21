<template>
  <v-card class="rounded-card" height="100%" id="tickets-volume-type-widget">
    <v-card-title primary-title>
      <div class="title">{{ $t("titleWidgetTicketsVolume") }}</div>
      <v-spacer></v-spacer>
      <image-download-btn type="table" :name="$t('titleWidgetTicketsVolume')"></image-download-btn>
    </v-card-title>
    <v-card-text>
      <div class="body">
        <v-data-table
          :loading="loading"
          hide-actions
          :items="normalizeTicketsList"
          :headers="headers"
          :no-data-text="$t('No data available')"
        >
          <template v-slot:items="props">
            <td class="text-xs-center">{{ $t(props.item.type) }}</td>
            <td class="text-xs-center">{{ props.item.open }}</td>
            <td class="text-xs-center">{{ props.item.closed }}</td>
            <td class="text-xs-center">
              <v-chip color="primary" outline>{{ props.item.total }}</v-chip>
            </td>
          </template>
          <template v-slot:footer>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length"></td>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length">
              <v-chip color="primary" outline>{{ footer.totalOpened }}</v-chip>
            </td>
            <td class="text-xs-center" v-if="!!normalizeTicketsList.length">
              <v-chip color="primary" outline>{{ footer.totalClosed }}</v-chip>
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
        { text: this.$i18n.t("type"), value: "type" },
        { text: this.$i18n.t("ticketopen"), value: "open" },
        { text: this.$i18n.t("ticketclosed"), value: "closed" },
        { text: this.$i18n.t("ticketCount"), value: "total" }
      ]
    };
  },
  components: {
    ImageDownloadBtn
  },
  computed: {
    ...mapGetters({
      ticketsData: "ticketsVolumeByType/getData",
      interval: "ticketsVolumeByType/getInterval"
    }),
    normalizeTicketsList() {
      const items = [];

      for (const [key, value] of Object.entries(this.ticketsData || {})) {
        items.push({ type: key, ...value });
      }
      return items;
    },
    footer() {
      return Object.values(this.ticketsData || {}).reduce(
        (acc, current) => {
          acc.totalOpened += current.open;
          acc.totalClosed += current.closed;
          acc.totalAll += current.closed + current.open;
          return acc;
        },
        { totalOpened: 0, totalClosed: 0, totalAll: 0 }
      );
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch("ticketsVolumeByType/fetchData").then(() => (this.loading = false));
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("ticketsVolumeByType/updateInterval", interval);
    }
  }
};
</script>

<style lang="stylus">
.rounded-card {
  border-radius: 10px;
}
</style>
