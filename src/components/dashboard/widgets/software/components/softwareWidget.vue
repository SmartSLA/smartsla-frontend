<template>
  <v-card class="rounded-card">
    <v-card-title primary-title>
      <div class="title">{{ $t("titleWidgetSoftware") }}</div>
      <v-spacer></v-spacer>
      <time-duration-changer-dropdown @setDuration="setInterval" :selectedInterval="interval" />
    </v-card-title>
    <v-card-text>
      <div class="body">
        <v-data-table hide-actions :items="software" :headers="headers">
          <template v-slot:items="props">
            <td class="text-xs-center">{{ props.item.softwareName }}</td>
            <td class="text-xs-center">{{ props.item.anomaly }}</td>
            <td class="text-xs-center">{{ props.item.information }}</td>
            <td class="text-xs-center">{{ props.item.administration }}</td>
            <td class="text-xs-center">
              <v-chip color="primary" outline>{{ props.item.total }}</v-chip>
            </td>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import TimeDurationChangerDropdown from "@/components/dashboard/base/TimeDurationChangerDropdown.vue";

export default {
  data() {
    return {
      loading: false,
      headers: [
        { text: this.$i18n.t("software"), value: "name" },
        { text: this.$i18n.t("anomaly"), value: "anomaly" },
        { text: this.$i18n.t("information"), value: "information" },
        { text: this.$i18n.t("administration"), value: "administration" },
        { text: this.$i18n.t("ticketCount"), value: "ticketCount" }
      ]
    };
  },
  components: {
    TimeDurationChangerDropdown
  },
  computed: {
    ...mapGetters({
      software: "topTenSoftware/getData",
      interval: "topTenSoftware/getInterval"
    })
  },
  created() {
    this.$store.dispatch("topTenSoftware/fetchData");
  },
  methods: {
    setInterval(interval) {
      this.$store.dispatch("topTenSoftware/updateInterval", interval);
    }
  }
};
</script>

<style lang="stylus">
.rounded-card {
  border-radius: 10px;
}
</style>
