<template>
  <v-layout row align-center>
    <strong class="hidden-sm-and-down ml-5 mb-3">{{ $t("Status") }}:</strong>
    <v-flex xs12 sm12 md12 lg12 xl12 pb-2>
      <v-stepper class="noshadow" alt-labels>
        <v-stepper-header>
          <ticket-status-step
            v-for="(statusName, index) in ticketStatusList"
            :key="index"
            :statusName="statusName"
            :ticketStatusId="ticketStatusId"
            :bypassable="isAnomaly"
          >
          </ticket-status-step>
        </v-stepper-header>
      </v-stepper>
    </v-flex>
  </v-layout>
</template>

<script>
import { TICKET_STATUS, TICKET_STATUS_ID, REQUEST_TYPE } from "@/constants";
import { findKey } from "lodash";
import TicketStatusStep from "@/components/request/TicketStatusStep";

export default {
  name: "ticket-status",
  props: {
    status: String,
    type: String
  },

  computed: {
    ticketStatusId() {
      if (this.status) {
        const statusKey = findKey(TICKET_STATUS, status => status === this.status);

        return TICKET_STATUS_ID[statusKey];
      }

      return 0;
    },

    isAnomaly() {
      return this.type === REQUEST_TYPE.ANOMALY;
    },

    ticketStatusList() {
      return TICKET_STATUS;
    }
  },
  components: {
    TicketStatusStep
  }
};
</script>
<style lang="stylus" scoped>
.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}

@media screen and (max-width: 780px) {

  .v-stepper__step {
    padding: 24px 0 !important;
    flex-basis: 10px !important;
  }

  .v-stepper__header {
    height: 82px !important;
  }
}

@media only screen and (max-width: 959px) {
  .v-stepper__label {
    display: block !important;
  }
}
</style>
