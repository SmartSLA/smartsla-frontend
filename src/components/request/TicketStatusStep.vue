<template>
  <v-menu v-if="canBeDisplayed">
    <template v-slot:activator="{}">
      <v-stepper-step
        v-if="ticketStatusId < stepKey"
        step
        :complete="nextStatus === stepKey"
        color="primary"
        complete-icon="access_time"
        class="current_step"
        >{{ $t(statusNameDisplay) }}</v-stepper-step
      >
      <v-stepper-step v-else step complete color="success">{{ $t(statusNameDisplay) }}</v-stepper-step>
      <v-divider v-if="!isClosed" :class="{ success: ticketStatusId > stepKey }"></v-divider>
    </template>
  </v-menu>
</template>

<script>
import { capitalize, findKey } from "lodash";
import { TICKET_STATUS_ID, TICKET_STATUS } from "@/constants";

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
