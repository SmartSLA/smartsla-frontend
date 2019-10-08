<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="percentage(cns[cnsType], duration)"
        :color="getEngagementColor(cns[cnsType], duration)"
        class="mt-0 white--text font-weight-bold"
        >{{ cns[cnsType] }} HO / {{ duration }} HO</v-progress-linear
      >
    </v-flex>
    <v-flex v-if="clockDisplay && !hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon color="#249CC7">access_time</v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";
import { computeCns } from "@/services/cns";

export default {
  name: "cns-progress-bar",
  props: { ticket: Object, cnsType: String, hideClock: Boolean },
  data() {
    return {
      cns: {
        supported: 0,
        bypassed: 0,
        resolved: 0
      },
      duration: 0,
      currentStatus: ""
    };
  },
  computed: {
    clockDisplay() {
      return (
        (this.cnsType === "supported" && this.ticket.status === "new") ||
        (this.cnsType === "bypassed" && this.ticket.status === "supported") ||
        (this.cnsType === "resolved" && this.ticket.status === "bypassed")
      );
    }
  },
  methods: {
    percentage(partialValue, totalValue) {
      let value = (100 * partialValue) / totalValue;

      return value < 100 ? value : 100;
    },
    getEngagementColor(currentValue, totalValue) {
      return this.percentage(currentValue, totalValue) < 100 ? "success" : "error";
    },
    calculateCNS() {
      this.cns = computeCns(this.ticket);
    },
    parseEngagementDuration(durationString, workHours = 9) {
      const parsedDuration = moment.duration(durationString);
      let duration = parsedDuration.hours();

      duration += parsedDuration.days() * workHours;

      return duration;
    },
    computeDuration() {
      const criticality = this.ticket.software.critical;
      const currentEngagements = [...this.ticket.contract.Engagements[criticality].engagements];

      if (currentEngagements.length) {
        const engagement = currentEngagements[0];

        this.duration = this.parseEngagementDuration(engagement[this.cnsType]);
      }
    }
  },
  created() {
    this.calculateCNS();
    this.computeDuration();
  }
};
</script>

<style></style>
