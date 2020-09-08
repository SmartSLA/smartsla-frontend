<template>
  <v-layout row>
    <v-flex xs10 sm6 md6>
      <v-menu transition="slide-y-transition" :nudge-width="100" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" fab flat small>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-calendar-range</v-icon>
              </template>
              <span>{{ $t("Choose a date") }}</span>
            </v-tooltip>
          </v-btn>
          <span v-if="interval">{{ periodLabel }}</span>
        </template>

        <v-card>
          <v-list>
            <v-list-tile
              ripple
              :class="{ current_interval: interval === 'ANY_TIME' }"
              @click="setIntervalType('ANY_TIME')"
            >
              <v-list-tile-title>{{ $t("Any time") }}</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              :class="{ current_interval: interval === 'LAST_WEEK' }"
              ripple
              @click="setIntervalType('LAST_WEEK')"
            >
              <v-list-tile-title>{{ $t("Last week") }}</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              :class="{ current_interval: interval === 'LAST_MONTH' }"
              ripple
              @click="setIntervalType('LAST_MONTH')"
            >
              <v-list-tile-title>{{ $t("Last month") }}</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              ripple
              :class="{ current_interval: interval === 'LAST_QUARTER' }"
              @click="setIntervalType('LAST_QUARTER')"
            >
              <v-list-tile-title>{{ $t("Last quarter") }}</v-list-tile-title>
            </v-list-tile>

            <v-list-tile
              :class="{ current_interval: interval === 'LAST_YEAR' }"
              ripple
              @click="setIntervalType('LAST_YEAR')"
            >
              <v-list-tile-title>{{ $t("Last year") }}</v-list-tile-title>
            </v-list-tile>

            <v-divider></v-divider>

            <v-list-tile
              :class="{ current_interval: interval === 'CUSTOM_PERIOD' }"
              ripple
              @click.prevent="showDatePickerModal = true"
            >
              <v-list-tile-title>{{ $t("Choose a period") }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-flex>
    <v-flex xs2 sm3 align-self-end>
      <v-menu transition="slide-y-transition" :nudge-width="100" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" fab flat small>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-sort</v-icon>
              </template>
              <span>{{ $t("Group by") }}</span>
            </v-tooltip>
          </v-btn>
          <span v-if="!isMobile">{{ $t(groupBy) }}</span>
        </template>

        <v-card>
          <v-list>
            <v-subheader>{{ $t("Group by") }}</v-subheader>
            <v-list-tile
              :class="{ current_interval: groupBy === item.group }"
              ripple
              v-for="item in groupByItems"
              :key="item.group"
              @click="groupBy = item.group"
            >
              <v-list-tile-title>{{ item.label }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-flex>
    <v-dialog v-model="showDatePickerModal" scrollable max-width="600px">
      <v-card class="px-4 pt-2">
        <v-card-title class="headline">{{ $t("Choose a period") }}</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs12 sm6 md6>
              <v-menu
                v-model="startMenu"
                :close-on-content-click="false"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="filters.start"
                    :label="$t('From date')"
                    prepend-icon="event"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.start"
                  no-title
                  :max="maxDate"
                  @input="startMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-menu
                :close-on-content-click="false"
                v-model="endMenu"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="filters.end"
                    :label="$t('To date')"
                    prepend-icon="event"
                    persistent-hint
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="filters.end" no-title :max="maxDate" @input="endMenu = false"></v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="savePeriod()">{{ $t("save") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from "moment-timezone";
import { mapGetters } from "vuex";
import { DASHBOARD_GROUP_BY_FILTER } from "@/constants";

export default {
  data: () => ({
    showDatePickerModal: false,
    startMenu: false,
    endMenu: false,
    maxDate: moment().format("YYYY-MM-DD"),
    filters: {
      start: moment().format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    }
  }),
  methods: {
    setIntervalType(interval) {
      this.$store.dispatch("main/setInterval", interval);
    },
    savePeriod() {
      this.showDatePickerModal = false;
      this.$store.dispatch("main/setPeriod", {
        start: this.filters.start,
        end: this.filters.end
      });
    }
  },
  computed: {
    groupBy: {
      get: function() {
        return this.$store.getters["main/getGroupBy"];
      },
      set: function(value) {
        this.$store.dispatch("main/setGroupBy", value);
      }
    },
    groupByItems() {
      return DASHBOARD_GROUP_BY_FILTER.map(group => ({
        group,
        label: this.$i18n.t(group)
      }));
    },
    ...mapGetters({
      interval: "main/getInterval"
    }),
    periodLabel() {
      switch (this.interval) {
        case "ANY_TIME":
          return `${this.$t("Any time")}`;
        case "LAST_WEEK":
          return `${this.$t("Last week")}`;
        case "LAST_MONTH":
          return `${this.$t("Last month")}`;
        case "LAST_QUARTER":
          return `${this.$t("Last quarter")}`;
        case "LAST_YEAR":
          return `${this.$t("Last year")}`;
        default:
          return `${this.$t("From date")}: ${this.filters.start} ${this.$t("To date")}: ${this.filters.end}`;
      }
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
        case "md":
        case "lg":
        case "xl":
          return false;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.current_interval {
  color: #2196f3
}
</style>
