<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="currentCnsValue.getPercentageElapsed()"
        :color="getEngagementColor(currentCnsValue)"
        class="mt-0 white--text font-weight-bold"
      >
        <span>
          {{ currentCnsValue | humanizeHoursDurationFilter(!currentCnsValue.isNonBusinessHours) }}
          <span v-if="!hideClock">
            / {{ currentCnsValueEngagement | humanizeHoursDurationFilter(!currentCnsValue.isNonBusinessHours) }}
          </span>
        </span>
      </v-progress-linear>
    </v-flex>
    <v-flex v-if="!hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon v-if="isCurrentStep" color="info">
        access_time
      </v-icon>
      <v-icon v-else-if="isPreviousStep" :color="getEngagementColor(currentCnsValue)">
        {{ getLabel(currentCnsValue) }}
      </v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import { computeCns } from "@/services/cns";

export default {
  name: "cns-progress-bar",
  props: { ticket: Object, cnsType: String, hideClock: Boolean },
  data() {
    return {
      cns: {},
      currentCnsValue: {},
      cnsDurations: {
        supported: 0,
        bypassed: 0,
        resolved: 0
      },
      currentCnsValueEngagement: {},
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
    }
  },
  methods: {
    getLabel(cnsValue) {
      return cnsValue.getEngagementInHours() === 0 ? "done" : cnsValue.getPercentageElapsed() < 100 ? "done" : "clear";
    },
    getEngagementColor(cnsValue) {
      if (this.isPreviousStep || this.isCurrentStep) {
        if (!cnsValue.getEngagementInHours()) {
          return "success";
        }

        return cnsValue.getPercentageElapsed() < 100 ? "success" : "error";
      }

      return "grey";
    },
    computeDuration() {
      const currentCnsValueEngagement = this.moment.duration(this.currentCnsValue.engagement);
      this.currentCnsValueEngagement = {
        days: Math.trunc(currentCnsValueEngagement.asDays()),
        hours: currentCnsValueEngagement.hours(),
        minutes: currentCnsValueEngagement.minutes()
      };
      this.cnsDurations = {
        supported: this.cns.supported.getEngagementInHours(),
        bypassed: this.cns.bypassed.getEngagementInHours(),
        resolved: this.cns.resolved.getEngagementInHours()
      };
    }
  },
  created() {
    this.cns = computeCns(this.ticket);
    this.currentCnsValue = this.cns[this.cnsType];
    this.computeDuration();
    this.$emit("cns-calculated", {
      ticketId: this.ticket._id,
      cns: this.cns,
      durations: this.cnsDurations
    });
  }
};
</script>

<style></style>
