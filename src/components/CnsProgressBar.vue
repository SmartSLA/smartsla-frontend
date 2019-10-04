<template>
  <v-layout row wrap>
    <v-flex px-1 pt-0 pb-0 text-xs-center :class="{ xs12: hideClock, xs11: !hideClock }">
      <v-progress-linear
        height="18"
        :value="percentage(cns[cnsType], duration)"
        :color="getEngagementColor(cns[cnsType], duration)"
        class="mt-0 white--text font-weight-bold"
      >{{ cns[cnsType] }} HO / {{ duration }} HO</v-progress-linear>
    </v-flex>
    <v-flex v-if="clockDisplay && !hideClock" xs1 px-1 pt-0 pb-0>
      <v-icon color="#249CC7">access_time</v-icon>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from "moment";

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
      let workingInterval = {
        start: 9,
        end: 18
      };
      const startDate = moment(this.ticket.timestamps.createdAt);
      let currentDate = moment();
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


      // Calculate time spent between creation and supported status.
      const supportedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "supported");
      if (supportedActions.length) {
        const firstSupportedAction = supportedActions[0];
        let supportedMinutesCount = 0;
        if (noStop) {
          supportedMinutesCount = this.hoursBetween(startDate, firstSupportedAction.date) * 60;
        } else {
          supportedMinutesCount = this.calculateWorkingMinutes(
            startDate,
            firstSupportedAction.date,
            workingInterval.start,
            workingInterval.end
          );
          supportedMinutesCount =
            supportedMinutesCount -
            this.holidaysBetween(startDate, firstSupportedAction.date) *
              (workingInterval.end - workingInterval.start) *
              60;
          supportedMinutesCount =
            supportedMinutesCount -
            this.calculateTimeSuspended(this.ticket.logs, "new", workingInterval.start, workingInterval.end);
        }
        
        this.cns.supported = +moment.duration({minutes: supportedMinutesCount}).asHours().toFixed(2);

        // Calculate time spent between supported and bypassed
        const bypassedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "bypassed");
        if (bypassedActions.length) {
          const firstBypassedAction = bypassedActions[0];
          let bypassedMinutes = 0;
          if (noStop) {
            bypassedMinutes =
              this.hoursBetween(firstSupportedAction.date, firstBypassedAction.date) * 60;
          } else {
            bypassedMinutes = this.calculateWorkingMinutes(
              firstSupportedAction.date,
              firstBypassedAction.date,
              workingInterval.start,
              workingInterval.end
            );
            bypassedMinutes -=
              this.holidaysBetween(firstSupportedAction.date, firstBypassedAction.date) *
                (workingInterval.end - workingInterval.start) *
                60;
            bypassedMinutes -=
              this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          }
          this.cns.bypassed = +moment.duration({minutes: bypassedMinutes}).asHours().toFixed(2);

          let resolvedActions = this.ticket.logs.filter(log => log.action.toLowerCase() == "resolved");
          if (resolvedActions.length) {
            let firstResolvedAction = resolvedActions[0];
            let resolvedMinutes = 0;
            if (noStop) {
              resolvedMinutes =
                this.hoursBetween(firstBypassedAction.date, firstResolvedAction.date) * 60;
            } else {
              resolvedMinutes = this.calculateWorkingMinutes(
                firstBypassedAction.date,
                firstResolvedAction.date,
                workingInterval.start,
                workingInterval.end
              );
              resolvedMinutes =
                resolvedMinutes -
                this.holidaysBetween(firstBypassedAction.date, firstResolvedAction.date) *
                  (workingInterval.end - workingInterval.start) *
                  60;
              resolvedMinutes =
                resolvedMinutes -
                this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            }
            this.cns.resolved = +moment.duration({minutes: resolvedMinutes}).asHours().toFixed(2);
          } else {
            let resolvedMinutes = this.calculateWorkingMinutes(
              firstBypassedAction.date,
              moment(),
              workingInterval.start,
              workingInterval.end
            );
            resolvedMinutes =
              resolvedMinutes -
              this.calculateTimeSuspended(this.ticket.logs, "bypassed", workingInterval.start, workingInterval.end);
            this.cns.resolved = +moment.duration({minutes: resolvedMinutes}).asHours().toFixed(2);
          }
        } else {
          let bypassedMinutes = 0;
          if (noStop) {
            bypassedMinutes =
              this.hoursBetween(firstSupportedAction.date, moment()) * 60;
          } else {
            bypassedMinutes = this.calculateWorkingMinutes(
            firstSupportedAction.date,
            moment(),
            workingInterval.start,
            workingInterval.end
          );
          bypassedMinutes =
            bypassedMinutes -
            this.calculateTimeSuspended(this.ticket.logs, "supported", workingInterval.start, workingInterval.end);
          }
          this.cns.bypassed = +moment.duration({minutes: bypassedMinutes}).asHours().toFixed(2);
        }
      } else {
        let startsDate = moment(this.ticket.timestamps.createdAt);
        if (noStop) {
          this.cns.supported = this.hoursBetween(startDate, currentDate).toFixed(2);
        } else {
          let holidaysCount = this.holidaysBetween(startDate, currentDate);
          let minutesCount = this.calculateWorkingMinutes(
            startsDate,
            moment(),
            workingInterval.start,
            workingInterval.end
          );
          let hoursCount = minutesCount / 60;
          hoursCount = hoursCount - holidaysCount * (workingInterval.end - workingInterval.start);
          this.cns.supported = +hoursCount.toFixed(2);
        }
      }
    },
    hoursBetween(start, end) {
      const startDate = moment(start);
      const endDate = moment(end);
      const duration = moment.duration(endDate.diff(startDate));

      return duration.asHours();
    },

    holidaysBetween(from, to) {
      let allHolidays = [];
      let startYear = moment(from).year();
      let endYear = moment(to).year();
      allHolidays = this.getHolidays(startYear);
      if (startYear !== endYear) {
        allHolidays.concat(this.getHolidays(endYear));
      }

      let holidaysDates = allHolidays.map(date => moment(date));
      let holidays = holidaysDates.filter(date => {
        if (date.valueOf() <= to.valueOf() && date.valueOf() >= from.valueOf()) {
          if (date.weekday() == 6 || date.weekday() == 0) {
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

    calculateWorkingMinutes(startingDate, endingDate, startingHour, endingHour) {
      var startWrapper = moment.utc(startingDate);
      const endWrapper = moment.utc(endingDate);
      let minutes = 0;
      while (startWrapper.valueOf() < endWrapper.valueOf()) {
        if (startWrapper.day() !== 0 && startWrapper.day() !== 6) {
          if (startWrapper.hour() >= startingHour && startWrapper.hour() < endingHour) {
            ++minutes;
          }
        }
        startWrapper.add(1, "minutes");
      }
  
      return minutes;
    },

    calculateTimeSuspended(logs, actionType, startingHour, endHour) {
      let suspendedTime = 0;
      let expertActions = [];
      let nextStageActions = [];
      let nextActionDate = moment();
      let actions = logs.filter(log => log.action.toLowerCase() == actionType);
      let suspendActions = actions.filter(log => {
        let assignedTo = log.assignedTo;
        if (assignedTo.type && assignedTo.type === "beneficiary") {
          return true;
        } else {
          return false;
        }
      });

      for (var i = 0; i < suspendActions.length; i++) {
        expertActions = actions.filter(
          action =>
            moment(action.date).isAfter(moment(suspendActions[i].date)) &&
            action.assignedTo &&
            action.assignedTo.type !== "beneficiary"
        );

        if (expertActions && expertActions.length) {
          for (var j = 0; j < expertActions.length; j++) {
            suspendedTime += this.calculateWorkingMinutes(
              moment(suspendActions[i].date),
              moment(expertActions[j].date),
              startingHour,
              endHour
            );
            break;
          }
        } else {
          nextStageActions = logs.filter(
            log =>
              log.action !== actionType && moment(log.date).isAfter(moment(suspendActions[i].date))
          );

          if (nextStageActions && nextStageActions.length) {
            nextActionDate = moment(nextStageActions[0].date);
          } else {
            nextActionDate = moment();
          }

          suspendedTime += this.calculateWorkingMinutes(
            suspendActions[i].date,
            nextActionDate,
            startingHour,
            endHour
          );
          break;
        }
      }

      return suspendedTime;
    },
    parseEngagementDuration(durationString, workHours = 9) {
      const parsedDuration = moment.duration(durationString);
      var duration = parsedDuration.hours();

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
