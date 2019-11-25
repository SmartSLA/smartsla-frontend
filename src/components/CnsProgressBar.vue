<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="percentage(cns[cnsType], duration)"
        :color="getEngagementColor(cns[cnsType], duration)"
        class="mt-0 white--text font-weight-bold"
      >
        <span v-if="duration">{{ cns[cnsType] | humanizeHoursDurationFilter }} / {{ durationDisplay | humanizeHoursDurationFilter }}</span>
        <span v-else>{{ cns[cnsType] | humanizeHoursDurationFilter }}</span>
      </v-progress-linear
      >
    </v-flex>
    <v-flex v-if="!hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon
        v-if="isCurrentStep"
        color="info"
      >
        access_time
      </v-icon>
      <v-icon
        v-else-if="isPreviousStep"
        :color="getEngagementColor(cns[cnsType], duration)"
      >
        {{ duration === 0 ? 'done' : (percentage(cns[cnsType], duration) < 100 ? 'done' : 'clear') }}
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
      cns: {
        supported: {},
        bypassed: {},
        resolved: {}
      },
      cnsDurations: {
        supported: 0,
        bypassed: 0,
        resolved: 0
      },
      duration: 0,
      commitmentDuration: {}
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
        this.ticket.status == "supported" && this.cnsType === "supported" ||
        this.ticket.status == "bypassed" && (this.cnsType === "supported" || this.cnsType === "bypassed") ||
        this.ticket.status == "resolved" && (this.cnsType === "supported" || this.cnsType === "bypassed" || this.cnsType === "resolved" ) ||
        this.ticket.status == "closed"
      );
    },
    
    durationDisplay() {
      const duration = {
        days: this.commitmentDuration.days(),
        hours: this.commitmentDuration.hours(),
        minutes: this.commitmentDuration.minutes()
      };

      return duration;
    }

  },
  methods: {
    percentage({hours}, totalValue) {
      let value = (100 * hours) / totalValue;

      if (!totalValue) {
        return 100;
      }

      return value < 100 ? value : 100;
    },
    getEngagementColor({hours}, totalValue) {
      if (this.isPreviousStep || this.isCurrentStep) {
        if (!this.duration) {
          return "success";
        }

        return this.percentage(hours, totalValue) < 100 ? "success" : "error";
      }

      return "grey";
    },
    calculateCNS() {
      this.cns = computeCns(this.ticket);
    },
    parseEngagementDuration(durationString, workHours = 9) {
      const commitmentDuration = this.moment.duration(durationString);
      let duration = commitmentDuration.hours();

      duration += commitmentDuration.days() * workHours;

      return duration;
    },
    computeDuration() {
      if (this.ticket.software && this.ticket.software.software) {
        const criticality = this.ticket.software.critical;
        const currentEngagements = [...this.ticket.contract.Engagements[criticality].engagements];

        if (currentEngagements.length) {
          let engagements = currentEngagements.filter(engagement => {
            let engagementCheck = engagement.request.toLowerCase() === this.ticket.type.toLowerCase();

            if (this.ticket.severity && this.ticket.severity.length) {
              engagementCheck = engagement.severity.toLowerCase() === this.ticket.severity.toLowerCase();
            }

            return engagementCheck;
          });

          if (engagements.length) {
            const engagement = engagements[0];
            this.commitmentDuration = this.moment.duration(engagement[this.cnsType]);
            this.duration = this.parseEngagementDuration(engagement[this.cnsType]);
            this.cnsDurations = {
              supported: this.parseEngagementDuration(engagement.supported),
              bypassed: this.parseEngagementDuration(engagement.bypassed),
              resolved: this.parseEngagementDuration(engagement.resolved)
            }
          }
        }
      }
    }
  },
  created() {
    this.calculateCNS();
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
