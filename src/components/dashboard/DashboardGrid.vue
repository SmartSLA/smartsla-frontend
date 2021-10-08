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
        <tickets-volume-type-widget />
      </v-flex>
      <v-flex xs12 md6>
        <tickets-priority-anomalies-widget />
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
        <open-tickets-software-widget />
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
// eslint-disable-next-line max-len
import TicketsVolumeTypeWidget from "@/components/dashboard/widgets/tickets-volume-type/components/ticketsVolumeTypeWidget.vue";
// eslint-disable-next-line max-len
import TicketsPriorityAnomaliesWidget from "@/components/dashboard/widgets/tickets-priority-anomalies/components/ticketsPriorityAnomaliesWidget.vue";

import "chartjs-plugin-datalabels";

export default {
  name: "DashboardGrid",
  components: {
    GlobalFilters,
    OpenTicketsWidget,
    CriticalityWidget,
    CounterCardWidget,
    SoftwareWidget,
    OpenTicketsSoftwareWidget,
    TicketsVolumeTypeWidget,
    TicketsPriorityAnomaliesWidget
  }
};
</script>
