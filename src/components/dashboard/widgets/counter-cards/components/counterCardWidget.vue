<template>
  <v-layout row wrap v-if="datasets">
    <v-flex xs4 sm4 md2>
      <counter-card color-card="total" :title="$t('totalTickets')" :value="datasets.totalTickets" />
    </v-flex>

    <v-flex xs4 sm4 md2>
      <counter-card color-card="primary" :title="$t('openedTicketsLabel')" :value="datasets.openTickets" />
    </v-flex>

    <v-flex xs4 sm4 md2>
      <counter-card color-card="info" :title="$t('closedTicketsLabel')" :value="datasets.closedTickets" />
    </v-flex>

    <v-flex xs4 sm4 md2>
      <counter-card
        color-card="secondary"
        :title="$t('supportAssignedTicketsLabel')"
        :value="datasets.supportAssignedTickets"
      />
    </v-flex>

    <v-flex xs4 sm4 md2>
      <counter-card color-card="not-critical" :title="$t('notCriticalTickets')" :value="datasets.notCriticalTickets" />
    </v-flex>

    <v-flex xs4 sm4 md2>
      <counter-card color-card="critical" :title="$t('criticalTicketsLabel')" :value="datasets.criticalTickets" />
    </v-flex>
  </v-layout>
</template>

<script>
import CounterCard from "@/components/dashboard/widgets/counter-cards/components/counterCard.vue";

export default {
  name: "CounterCardGrid",
  computed: {
    datasets() {
      return this.$store.getters["counterCards/getData"][0];
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
