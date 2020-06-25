<template>
  <v-container id="dashboard-card-grid">
    <v-layout row wrap>
      <v-flex xs6 sm6 md3>
        <counter-card
          color-card="primary"
          icon="mdi-bookmark-outline"
          :title="$t('openedTicketsLabel')"
          :value="datasets.openTickets"
        />
      </v-flex>

      <v-flex xs6 sm6 md3>
        <counter-card
          color-card="info"
          icon="mdi-bookmark-off"
          :title="$t('closedTicketsLabel')"
          :value="datasets.closedTickets"
        />
      </v-flex>

      <v-flex xs6 sm6 md3>
        <counter-card
          color-card="secondary"
          icon="mdi-book-open"
          :title="$t('contractsCounterLabel')"
          :value="datasets.contracts"
        />
      </v-flex>

      <v-flex xs6 sm6 md3>
        <counter-card
          color-card="critical"
          icon="mdi-alert"
          :title="$t('criticalTicketsLabel')"
          :value="datasets.criticalTickets"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import CounterCard from "@/components/dashboard/widgets/counter-cards/components/counterCard.vue";

export default {
  name: "CounterCardGrid",
  computed: {
    datasets() {
      return this.$store.getters["counterCards/getData"];
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
        case "md":
        case "lg":
        case "xl":
          return false;
      }
    }
  },
  created() {
    this.$store.dispatch("counterCards/fetchData");
  },
  components: {
    CounterCard
  }
};
</script>
