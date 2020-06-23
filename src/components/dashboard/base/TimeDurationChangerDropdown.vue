<template>
  <div>
    <v-menu transition="slide-y-transition" :nudge-width="100" offset-x>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" fab flat small>
          <v-icon>mdi-calendar-range</v-icon>
        </v-btn>
        <span v-if="interval">{{ periodLabel }}</span>
      </template>

      <v-card>
        <v-list>
          <v-list-tile @click="setIntervalType('LAST_WEEK')">
            <v-list-tile-title>{{ $t("Last week") }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="setIntervalType('LAST_TWO_WEEK')">
            <v-list-tile-title>{{ $t("Last two weeks") }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="setIntervalType('LAST_MONTH')">
            <v-list-tile-title>{{ $t("Last month") }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click="setIntervalType('LAST_YEAR')">
            <v-list-tile-title>{{ $t("Last year") }}</v-list-tile-title>
          </v-list-tile>

          <v-list-tile @click.prevent="showDatePickerModal = true">
            <v-list-tile-title>{{ $t("Choose a period") }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>
    <v-dialog v-model="showDatePickerModal" scrollable :fullscreen="$vuetify.breakpoint.xs" max-width="600px">
      <v-card class="px-4 pt-2">
        <v-card-title class="headline">{{ $t("Choose a period") }}</v-card-title>
        <v-card-text>
          <v-layout row>
            <v-flex xs12 sm6 md6>
              <v-menu lazy transition="scale-transition" offset-y full-width min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="filters.start"
                    :label="$t('From date')"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="filters.start" no-title scrollable :max="maxDate">
                  <v-spacer></v-spacer>
                </v-date-picker>
              </v-menu>
            </v-flex>

            <v-flex xs12 sm6 md6>
              <v-menu lazy transition="scale-transition" offset-y full-width min-width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="filters.end"
                    :label="$t('To date')"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="filters.end" no-title scrollable :max="maxDate">
                  <v-spacer></v-spacer>
                </v-date-picker>
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
  </div>
</template>

<script>
import moment from "moment-timezone";
import { mapGetters } from "vuex";

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
    ...mapGetters({
      interval: "main/getInterval"
    }),
    periodLabel() {
      switch (this.interval) {
        case "LAST_WEEK":
          return `${this.$t("Last week")}`;
        case "LAST_TWO_WEEK":
          return `${this.$t("Last two weeks")}`;
        case "LAST_MONTH":
          return `${this.$t("Last month")}`;
        case "LAST_YEAR":
          return `${this.$t("Last year")}`;
        default:
          return `${this.$t("From date")}: ${this.filters.start} ${this.$t("To date")}: ${this.filters.end}`;
      }
    }
  }
};
</script>
