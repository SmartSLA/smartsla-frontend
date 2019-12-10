<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="percentage(cns[cnsType], duration)"
        :color="getEngagementColor(cns[cnsType], duration)"
        class="mt-0 white--text font-weight-bold"
      >
        <span v-if="duration">
          {{ cns[cnsType] | humanizeHoursDurationFilter(displayBusinessHoursFormat) }}
          <span v-if="!hideClock">
            / {{ durationDisplay | humanizeHoursDurationFilter(displayBusinessHoursFormat) }}
          </span>
        </span>
        <span v-else>{{ cns[cnsType] | humanizeHoursDurationFilter(displayBusinessHoursFormat) }}</span>
      </v-progress-linear>
    </v-flex>
    <v-flex v-if="!hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon v-if="isCurrentStep" color="info">
        access_time
      </v-icon>
      <v-icon v-else-if="isPreviousStep" :color="getEngagementColor(cns[cnsType], duration)">
        {{ getLabel(cns[cnsType], duration) }}
      </v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import { computeCns } from "@/services/cns";
import { UNDEFINED_DURATION } from "@/constants";

export default {
  name: "cns-progress-bar",
  props: { ticket: Object, cnsType: String, hideClock: Boolean },
  data() {
    return {
      cns: {},
      cnsDurations: {
        supported: 0,
        bypassed: 0,
        resolved: 0
      },
      duration: 0,
      commitmentDuration: {},
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
        (this.ticket.status == "supported" && this.cnsType === "supported") ||
        (this.ticket.status == "bypassed" && (this.cnsType === "supported" || this.cnsType === "bypassed")) ||
        (this.ticket.status == "resolved" &&
          (this.cnsType === "supported" || this.cnsType === "bypassed" || this.cnsType === "resolved")) ||
        this.ticket.status == "closed"
      );
    },

    durationDisplay() {
      const days = this.commitmentDuration
        .clone()
        .subtract({
          hours: this.commitmentDuration.hours(),
          minutes: this.commitmentDuration.minutes()
        })
        .asDays();

      const hours = this.commitmentDuration
        .clone()
        .subtract({
          days,
          minutes: this.commitmentDuration.minutes()
        })
        .asHours();

      const duration = {
        days,
        hours,
        minutes: this.commitmentDuration.minutes()
      };

      return duration;
    },

    createdInBusinessHours() {
      if (this.ticket && this.ticket.createdDuringBusinessHours) {
        return this.ticket.createdDuringBusinessHours;
      }

      return false;
    },

    displayBusinessHoursFormat() {
      return this.createdInBusinessHours || (!this.createdInBusinessHours && !this.nonBusinessHoursDefined);
    }
  },
  methods: {
    getLabel(cns, duration) {
      return duration === 0 ? "done" : this.percentage(cns, duration) < 100 ? "done" : "clear";
    },
    percentage(cns, totalValue) {
      var hours = this.getCnsHours(cns);
      let value = (100 * hours) / totalValue;

      if (!totalValue) {
        return 100;
      }

      return value < 100 ? value : 100;
    },

    getCnsHours(cns) {
      var workHours = 0;
      var hours = 0;
      if (cns) {
        hours += cns.hours;
        if (this.ticket.createdDuringBusinessHours) {
          workHours =
            (this.ticket.contract.businessHours &&
              this.ticket.contract.businessHours.end - this.ticket.contract.businessHours.start) ||
            9;
        } else {
          workHours = 24;
        }
        if (cns.days) {
          hours += cns.days * workHours;
        }
        if (cns.minutes) {
          hours += cns.minutes / 60;
        }
      }

      return hours;
    },

    getCommitment(commitment, inNonBusinessHours) {
      if (inNonBusinessHours && commitment.nonBusinessHours !== UNDEFINED_DURATION) {
        return this.moment.duration(commitment.nonBusinessHours);
      }

      return this.moment.duration(commitment.businessHours);
    },

    selectEngagement(engagement, inNonBusinessHours) {
      let parsedDuration = {};
      if (inNonBusinessHours) {
        parsedDuration = this.parseEngagementDuration(engagement.nonBusinessHours);
        if (!parsedDuration) {
          return this.parseEngagementDuration(engagement.businessHours);
        }
      } else {
        parsedDuration = this.parseEngagementDuration(engagement.businessHours);
      }

      return parsedDuration;
    },
    getEngagementColor(cns, totalValue) {
      if (this.isPreviousStep || this.isCurrentStep) {
        if (!this.duration) {
          return "success";
        }

        return this.percentage(cns, totalValue) < 100 ? "success" : "error";
      }

      return "grey";
    },
    calculateCNS() {
      this.cns = computeCns(this.ticket);
    },
    parseEngagementDuration(durationString) {
      var workHours = 0;
      if (this.ticket.createdDuringBusinessHours) {
        workHours =
          (this.ticket.contract.businessHours &&
            this.ticket.contract.businessHours.end - this.ticket.contract.businessHours.start) ||
          9;
      } else {
        workHours = 24;
      }
      const commitmentDuration = this.moment.duration(durationString);
      const commitmentDurationInDays = commitmentDuration.clone().subtract({
        hours: commitmentDuration.hours()
      });

      let duration = commitmentDuration.hours();

      duration += commitmentDurationInDays.asDays() * workHours;

      return duration;
    },
    computeDuration() {
      const createdInNonBusinessHours = !this.ticket.createdDuringBusinessHours || false;
      if (this.ticket.software && this.ticket.software.software && this.ticket.contract) {
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
            if (engagement[this.cnsType]) {
              this.commitmentDuration = this.getCommitment(engagement[this.cnsType], createdInNonBusinessHours);
              this.nonBusinessHoursDefined = engagement[this.cnsType].nonBusinessHours !== UNDEFINED_DURATION;
              this.duration = this.selectEngagement(engagement[this.cnsType], createdInNonBusinessHours);
              this.cnsDurations = {
                supported: this.selectEngagement(engagement.supported, createdInNonBusinessHours),
                bypassed: this.selectEngagement(engagement.bypassed, createdInNonBusinessHours),
                resolved: this.selectEngagement(engagement.resolved, createdInNonBusinessHours)
              };
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
