<template>
  <v-layout row wrap v-if="currentCnsValue">
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-progress-linear
              height="18"
              :value="currentCnsValue.percentageElapsed"
              :color="currentCnsValueColor"
              class="my-0 white--text font-weight-bold"
            >
              <span>
                {{ currentCnsValueInMHD | humanizeHoursDurationFilter(!currentCnsValue.isNonBusinessHours) }}
                <span v-if="!hideClock">
                  / {{ currentCnsValueEngagement | humanizeHoursDurationFilter(!currentCnsValue.isNonBusinessHours) }}
                </span>
              </span>
            </v-progress-linear>
          </span>
        </template>
        <span>
          {{ $t("Time spent") + ": " }}
          {{ currentCnsValueInMHD | humanizeHoursDurationFilter(currentCnsValue.isNonBusinessHours) }}
          /
          {{ currentCnsValueEngagement | humanizeHoursDurationFilter(currentCnsValue.isNonBusinessHours) }}
          ({{ currentCnsValue && `${Math.trunc(currentCnsValue.percentageElapsed)}%` }})
        </span>
      </v-tooltip>
    </v-flex>
    <v-flex v-if="!hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon v-if="isCurrentStep && !isTicketSuspended" color="info">
        access_time
      </v-icon>
      <v-tooltip v-if="isCurrentStep && isTicketSuspended" top>
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-icon color="warning">
              pause
            </v-icon>
          </span>
        </template>
        <span>
          {{ $t("Ticket suspended assigned to the beneficiary") }}
        </span>
      </v-tooltip>
      <v-icon v-else-if="isPreviousStep" :color="currentCnsValueColor">
        {{ currentCnsValueLabel }}
      </v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import { convertIsoDurationInDaysHoursMinutes, convertCnsValueInDaysHoursMinutes } from "@/services/helpers/duration";

export default {
  name: "cns-progress-bar",
  props: { ticket: Object, cnsType: String, hideClock: Boolean },
  data() {
    return {
      cns: {},
      currentCnsValue: {},
      nonBusinessHoursDefined: true
    };
  },
  computed: {
    isCurrentStep() {
      return (
        (this.cnsType === "supported" && this.ticket.status === "new") ||
        (this.cnsType === "bypassed" && this.ticket.status === "supported") ||
        (this.cnsType === "resolved" && this.ticket.status === "bypassed")
      );
    },
    isPreviousStep() {
      return (
        (this.ticket.status === "supported" && this.cnsType === "supported") ||
        (this.ticket.status === "bypassed" && (this.cnsType === "supported" || this.cnsType === "bypassed")) ||
        (this.ticket.status === "resolved" &&
          (this.cnsType === "supported" || this.cnsType === "bypassed" || this.cnsType === "resolved")) ||
        this.ticket.status === "closed"
      );
    },
    currentCnsValueInMHD() {
      return convertCnsValueInDaysHoursMinutes(this.currentCnsValue);
    },
    currentCnsValueColor() {
      if (this.isPreviousStep || this.isCurrentStep) {
        return this.isCurrentEngagementFulfilled() ? "success" : "error";
      }

      return "grey";
    },
    currentCnsValueLabel() {
      return this.isCurrentEngagementFulfilled() ? "done" : "clear";
    },
    currentCnsValueEngagement() {
      return convertIsoDurationInDaysHoursMinutes(this.currentCnsValue.engagement);
    },
    isTicketSuspended() {
      return this.ticket.assignedTo && this.ticket.assignedTo.type === "beneficiary";
    }
  },
  methods: {
    isCurrentEngagementFulfilled() {
      return !this.currentCnsValue.percentageElapsed || this.currentCnsValue.percentageElapsed < 100;
    }
  },
  created() {
    this.currentCnsValue = this.ticket.cns[this.cnsType];
  }
};
</script>
