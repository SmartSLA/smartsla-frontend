<template>
  <v-container fluid>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap mb-3>
        <v-flex d-flex xs12 md12 lg12 mb-3>
          <open-tickets-widget />
        </v-flex>
        <v-flex d-flex xs12 md12 lg12 mb-3>
          <criticality-widget />
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
// widgets
import OpenTicketsWidget from "@/components/dashboard/widgets/open-tickets/components/openTicketsWidget.vue";
import CriticalityWidget from "@/components/dashboard/widgets/criticality-tickets/components/criticalityWidget.vue";

export default {
  name: "DashboardGrid",
  components: {
    OpenTicketsWidget,
    CriticalityWidget
  }
};
</script>
