<template>
  <v-menu transition="slide-y-transition" :nudge-width="100" offset-x>
    <template v-slot:activator="{ on }">
      <span>{{ duration }}</span>
      <v-btn v-on="on" fab flat small>
        <v-icon>settings</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-tile @click="setTimeDuration('LAST_WEEK')">
          <v-list-tile-title>Last 7 days</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="setTimeDuration('LAST_TWO_WEEK')">
          <v-list-tile-title>Last 14 days</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="setTimeDuration('LAST_MONTH')">
          <v-list-tile-title>Last Month</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="setTimeDuration('LAST_YEAR')">
          <v-list-tile-title>Year</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { WIDGET_DURATION_INTERVAL } from "@/constants";

export default {
  props: {
    selectedInterval: { type: String }
  },
  methods: {
    setTimeDuration(interval) {
      this.$emit("setDuration", interval);
    }
  },
  computed: {
    duration() {
      return WIDGET_DURATION_INTERVAL[this.selectedInterval];
    }
  }
};
</script>
