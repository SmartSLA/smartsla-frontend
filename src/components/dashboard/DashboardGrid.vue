<template>
  <v-container fluid>
    <counter-card-widget />
    <v-layout row wrap mb-3>
      <v-flex d-flex xs12 md12 lg12 mb-3>
        <open-tickets-widget />
      </v-flex>
      <v-flex d-flex xs12 md12 lg12 mb-3>
        <criticality-widget />
      </v-flex>
      <v-flex d-flex xs12 md12 lg12 mb-3>
        <software-widget />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import OpenTicketsWidget from "@/components/dashboard/widgets/open-tickets/components/openTicketsWidget.vue";
import CriticalityWidget from "@/components/dashboard/widgets/criticality-tickets/components/criticalityWidget.vue";
import CounterCardWidget from "@/components/dashboard/widgets/counter-cards/components/counterCardWidget.vue";
import SoftwareWidget from "@/components/dashboard/widgets/software/components/softwareWidget.vue";

export default {
  name: "DashboardGrid",
  components: {
    OpenTicketsWidget,
    CriticalityWidget,
    CounterCardWidget,
    SoftwareWidget
  }
};
</script>
