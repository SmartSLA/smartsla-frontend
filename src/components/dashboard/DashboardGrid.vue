<template>
  <v-container fluid grid-list-md>
    <v-layout mb-3 id="dashboard_filters">
      <global-filters />
    </v-layout>

    <v-layout row wrap mb-3 id="counter_cards">
      <counter-card-widget />
    </v-layout>

    <v-layout row wrap mb-3 class="widget">
      <v-flex xs12 md12 mb-3>
        <open-tickets-widget />
      </v-flex>
    </v-layout>

    <v-layout row wrap class="widget">
      <v-flex xs12 md6>
        <criticality-widget />
      </v-flex>
      <v-flex xs12 md6>
        <software-widget />
      </v-flex>
    </v-layout>

    <v-layout row wrap class="widget">
      <v-flex xs12>
        <open-tickets-software-widget class="widget_tickets_software_widget" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import GlobalFilters from "@/components/dashboard/filters/globalFilters.vue";
import OpenTicketsWidget from "@/components/dashboard/widgets/open-tickets/components/openTicketsWidget.vue";
import CriticalityWidget from "@/components/dashboard/widgets/criticality-tickets/components/criticalityWidget.vue";
import CounterCardWidget from "@/components/dashboard/widgets/counter-cards/components/counterCardWidget.vue";
import SoftwareWidget from "@/components/dashboard/widgets/software/components/softwareWidget.vue";
// eslint-disable-next-line max-len
import OpenTicketsSoftwareWidget from "@/components/dashboard/widgets/open-tickets-software/components/openTicketsSoftwareWidget.vue";

export default {
  name: "DashboardGrid",
  components: {
    GlobalFilters,
    OpenTicketsWidget,
    CriticalityWidget,
    CounterCardWidget,
    SoftwareWidget,
    OpenTicketsSoftwareWidget
  }
};
</script>

<style lang="stylus" scoped>
.widget_tickets_software_widget { width: 50%; margin: 0 auto; }
</style>
