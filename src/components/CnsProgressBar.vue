<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="percentage(cns[cnsType], duration)"
        :color="getEngagementColor(cns[cnsType], duration)"
        class="mt-0 white--text font-weight-bold"
      >
        {{ cns[cnsType] }} HO / {{ duration }} HO
      </v-progress-linear>
    </v-flex>
    <v-flex v-if="clockDisplay && !hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon color="#249CC7">access_time</v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "cns-progress-bar",
  props: { ticket: Array, cnsType: String, hideClock: Boolean },
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
      let workingInterval = {
        start: 9,
        end: 18
      };
      let startDate = new Date(this.ticket.timestamps.createdAt);
      let currentDate = new Date();
      let criticalityLevel = this.ticket.software.critical;
      if (criticalityLevel == "critical") {
        workingInterval = this.ticket.contract.Engagements.critical.schedule;
      } else if (criticalityLevel == "sensible") {
        workingInterval = this.ticket.contract.Engagements.sensible.schedule;
      } else if (criticalityLevel == "standard") {
        workingInterval = this.ticket.contract.Engagements.standard.schedule;
      }
      let noStop = false;
      if (workingInterval) {
        noStop = workingInterval.end == "-" || workingInterval.start == "7d/7d";
      } else {
        workingInterval = {
          start: 9,
          end: 18
        };
      }

      if (this.ticket.status == "new") {
        if (noStop) {
          this.cns.supported = this.HoursBetween(startDate, currentDate).toPrecision(3);
        } else {
          let holidaysCount = this.holidaysBetween(startDate, currentDate);
          let startsDate = new Date(this.ticket.timestamps.createdAt);

          let minutesCount = this.calculateWorkingMinutes(
            startsDate,
            new Date(),
            workingInterval.start,
            workingInterval.end
          );
          let hoursCount = minutesCount / 60;
          hoursCount = hoursCount - holidaysCount * (18 - 9);
          this.cns.supported = hoursCount.toPrecision(3);
        }
      }

      // Calculate time spent between creation and supported status.
      let supportedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "supported");
      if (supportedActions.length) {
        let firstSupportedAction = supportedActions[0];
        let supportedMinutesCount = 0;
        if (noStop) {
          supportedMinutesCount = this.HoursBetween(startDate, new Date(firstSupportedAction.date)) * 60;
        } else {
          supportedMinutesCount = this.calculateWorkingMinutes(
            startDate,
            new Date(firstSupportedAction.date),
            workingInterval.start,
            workingInterval.end
          );
          supportedMinutesCount =
            supportedMinutesCount -
            this.holidaysBetween(startDate, new Date(firstSupportedAction.date)) *
              (workingInterval.end - workingInterval.start) *
              60;
          supportedMinutesCount =
            supportedMinutesCount -
            this.calculateTimeSuspended(this.ticket.logs, "new", workingInterval.start, workingInterval.end);
        }
        this.cns.supported = (supportedMinutesCount / 60.0).toFixed(2);

        // Calculate time spent between supported and bypassed
        let bypassedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "bypassed");
        if (bypassedActions.length) {
          let firstBypassedAction = bypassedActions[0];
          let bypassedMinutes = 0;
          if (noStop) {
            bypassedMinutes =
              this.HoursBetween(new Date(firstSupportedAction.date), new Date(firstBypassedAction.date)) * 60;
          } else {
            bypassedMinutes = this.calculateWorkingMinutes(
              new Date(firstSupportedAction.date),
              new Date(firstBypassedAction.date),
              workingInterval.start,
              workingInterval.end
            );
            bypassedMinutes =
              bypassedMinutes -
              this.holidaysBetween(new Date(firstSupportedAction.date), new Date(firstBypassedAction.date)) *
                (workingInterval.end - workingInterval.start) *
                60;
            bypassedMinutes =
              bypassedMinutes -
              this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          }
          this.cns.bypassed = (bypassedMinutes / 60).toFixed(2);

          let resolvedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "resolved");
          if (resolvedActions.length) {
            let firstResolvedAction = resolvedActions[0];
            let resolvedMinutes = 0;
            if (noStop) {
              resolvedMinutes =
                this.HoursBetween(new Date(firstBypassedAction.date), new Date(firstResolvedAction.date)) * 60;
            } else {
              resolvedMinutes = this.calculateWorkingMinutes(
                new Date(firstBypassedAction.date),
                new Date(firstResolvedAction.date),
                workingInterval.start,
                workingInterval.end
              );
              resolvedMinutes =
                resolvedMinutes -
                this.holidaysBetween(new Date(firstBypassedAction.date), new Date(firstResolvedAction.date)) *
                  (workingInterval.end - workingInterval.start) *
                  60;
              resolvedMinutes =
                resolvedMinutes -
                this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            }
            this.cns.resolved = (resolvedMinutes / 60).toFixed(2);
          } else {
            let resolvedMinutes = this.calculateWorkingMinutes(
              new Date(firstBypassedAction.date),
              new Date(),
              workingInterval.start,
              workingInterval.end
            );
            resolvedMinutes =
              resolvedMinutes -
              this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            this.cns.resolved = (resolvedMinutes / 60).toFixed(2);
          }
        } else {
          let bypassedMinutes = this.calculateWorkingMinutes(
            new Date(firstSupportedAction.date),
            new Date(),
            workingInterval.start,
            workingInterval.end
          );
          bypassedMinutes =
            bypassedMinutes -
            this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          this.cns.bypassed = (bypassedMinutes / 60).toFixed(2);
        }
      } else {
        let holidaysCount = this.holidaysBetween(startDate, currentDate);
        let startsDate = new Date(this.ticket.timestamps.createdAt);

        let minutesCount = this.calculateWorkingMinutes(
          startsDate,
          new Date(),
          workingInterval.start,
          workingInterval.end
        );
        let hoursCount = minutesCount / 60;
        hoursCount = hoursCount - holidaysCount * (18 - 9);
        this.cns.supported = hoursCount.toFixed(2);
      }
    },
    HoursBetween(start, end) {
      let diff = end.getTime() - start.getTime();
      let daysCount = diff / (1000 * 60 * 60 * 24);
      let hoursCount = daysCount * 24;
      return hoursCount.toFixed(2);
    },

    holidaysBetween(from, to) {
      let allHolidays = [];
      let startYear = from.getYear() + 1900;
      let endYear = to.getYear() + 1900;
      allHolidays = this.getHolidays(startYear);
      if (startYear !== endYear) {
        allHolidays.concat(this.getHolidays(endYear));
      }

      let holidaysDates = allHolidays.map(date => new Date(date));
      let holidays = holidaysDates.filter(date => {
        if (date.getTime() <= to.getTime() && date.getTime() >= from.getTime()) {
          if (date.getDay() == 6 || date.getDay() == 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });

      return holidays.length;
    },
    getHolidays() {
      let holidays = [];
      holidays = require("@/assets/data/holidays.json");
      if (!holidays.length) {
        holidays = this.$http.listHolidays();
      }

      return holidays;
    },
    calculateWorkingMinutes(startDate, endDate, startingHour, endHour) {
      let minutes = 0;
      while (startDate.getTime() < endDate.getTime()) {
        if (startDate.getDay() != 0 && startDate.getDay() != 6) {
          if (startDate.getHours() >= startingHour && startDate.getHours() < endHour) {
            minutes++;
          }
        }
        startDate.setMinutes(startDate.getMinutes() + 1);
      }

      return minutes;
    },
    calculateTimeSuspended(logs, actionType, startingHour, endHour) {
      let suspendedTime = 0;
      let actions = logs.filter(log => log.action.toLowerCase() == actionType);
      let suspendActions = actions.filter(log => {
        let assignedTo = log.assignedTo;
        if (assignedTo.type && assignedTo.type == "beneficiary") {
          return true;
        } else {
          return false;
        }
      });

      for (var i = 0; i < suspendActions.length; i++) {
        for (var j = 0; j < actions.length; j++) {
          if (new Date(actions[j].date).getTime() > new Date(suspendActions[i].date).getTime()) {
            if (actions[j].assignedTo && actions[j].assignedTo.type !== "beneficiary") {
              suspendedTime += this.calculateWorkingMinutes(
                new Date(suspendActions[i].date),
                new Date(actions[j].date),
                startingHour,
                endHour
              );
            }
          }
        }
      }

      return suspendedTime;
    },
    parseEngagementDuration(durationString, workHours = 9) {
      let duration = 0;
      let days = durationString.match(/(\d+)\s*(J|D|j|d)/);
      let hours = durationString.match(/(\d+)\s*(H|h)/);
      if (hours) {
        duration += parseInt(hours[1]);
      }
      if (days) {
        duration += days[1] * workHours;
      }
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
