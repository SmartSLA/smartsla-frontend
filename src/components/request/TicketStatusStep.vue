<template>
  <v-menu v-if="canBeDisplayed">
    <template v-slot:activator="{}">
      <v-flex v-if="ticketStatusId < stepKey" xs1 sm4 md3 lg3>
        <v-stepper-step
          step
          :complete="nextStatus === stepKey"
          color="primary"
          complete-icon="access_time"
          class="px-0 caption"
          >{{ nextStatusNameDisplay }}</v-stepper-step
        >
      </v-flex>
      <v-flex v-else xs1 sm4 md3 lg3>
        <v-stepper-step step complete color="success" class="px-0 ml-2 caption">
          {{ $t(statusNameDisplay) }}
        </v-stepper-step>
      </v-flex>
      <v-divider v-if="!isClosed" :class="{ success: ticketStatusId > stepKey }" class="hidden-xs-only"></v-divider>
    </template>
  </v-menu>
</template>

<script>
import { capitalize, findKey } from "lodash";
import { TICKET_STATUS_ID, TICKET_STATUS, ANOMALY_CNS_STATUS } from "@/constants";

export default {
  name: "ticket-status-step",
  props: {
    statusName: String,
    ticketStatusId: Number,
    bypassable: Boolean
  },
  computed: {
    statusNameDisplay() {
      return capitalize(this.statusName);
    },
    nextStatusNameDisplay() {
      let keys = Object.keys(ANOMALY_CNS_STATUS);
      let idx = keys.indexOf(this.statusName);
      let currentState = keys[idx - 1];

      return capitalize(this.$i18n.t(ANOMALY_CNS_STATUS[currentState]));
    },
    stepKey() {
      if (this.statusName) {
        const statusKey = findKey(TICKET_STATUS, status => status === this.statusName);

        return TICKET_STATUS_ID[statusKey];
      }

      return 0;
    },

    canBeDisplayed() {
      if (this.statusName === TICKET_STATUS.BYPASSED) {
        return this.bypassable;
      }

      return true;
    },

    nextStatus() {
      if (this.ticketStatusId === TICKET_STATUS_ID.SUPPORTED && !this.bypassable) {
        return TICKET_STATUS_ID.RESOLVED;
      }

      return this.ticketStatusId + 1;
    },

    isClosed() {
      return this.stepKey === TICKET_STATUS_ID.CLOSED;
    }
  }
};
</script>
