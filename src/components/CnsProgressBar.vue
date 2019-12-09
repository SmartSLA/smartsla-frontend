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
          {{ cns[cnsType] | humanizeHoursDurationFilter(createdInNonBusinessHours) }}
          <span v-if="!hideClock">
            / {{ durationDisplay | humanizeHoursDurationFilter(createdInNonBusinessHours) }}
          </span>
          </span>
        <span v-else>{{ cns[cnsType] | humanizeHoursDurationFilter(createdInNonBusinessHours) }}</span>
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
      const days = this.commitmentDuration.clone().subtract({
        hours: this.commitmentDuration.hours(),
        minutes: this.commitmentDuration.minutes()
      }).asDays();

      const hours = this.commitmentDuration.clone().subtract({
        minutes: this.commitmentDuration.minutes()
      }).asHours();

      const duration = {
        days,
        hours,
        minutes: this.commitmentDuration.minutes()
      };

      return duration;
    },

    createdInNonBusinessHours() {
      if (this.ticket && this.ticket.createdDuringBusinessHours) {
        return this.ticket.createdDuringBusinessHours;
      }

      return false;
    }

  },
  methods: {
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
          workHours = (this.ticket.contract.businessHours && 
          (this.ticket.contract.businessHours.end - this.ticket.contract.businessHours.start)) || 9;
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

    getEngagementColor(cns, totalValue) {
      var hours = this.getCnsHours(cns);
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
        workHours = (this.ticket.contract.businessHours && 
        (this.ticket.contract.businessHours.end - this.ticket.contract.businessHours.start)) || 9;
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
              this.commitmentDuration = this.moment.duration(createdInNonBusinessHours ? engagement[this.cnsType].nonBusinessHours : engagement[this.cnsType].businessHours);
              this.duration = this.parseEngagementDuration(createdInNonBusinessHours ? engagement[this.cnsType].nonBusinessHours :  engagement[this.cnsType].businessHours);
              this.cnsDurations = {
                supported: this.parseEngagementDuration(createdInNonBusinessHours ? engagement.supported.nonBusinessHours : engagement.supported.businessHours),
                bypassed: this.parseEngagementDuration(createdInNonBusinessHours ? engagement.bypassed.nonBusinessHours : engagement.bypassed.businessHours),
                resolved: this.parseEngagementDuration(createdInNonBusinessHours ? engagement.resolved.nonBusinessHours : engagement.resolved.businessHours)
              }
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
