<template>
  <v-container class="pt-0 px-0 contributions-bar">
    <v-layout row wrap>
      <v-flex xs12>
        <v-subheader inset class="text-uppercase blue white--text title ml-0">
          {{
          $i18n.t("recently accepted contributions")
          }}
        </v-subheader>
        <v-icon large color="blue" class="arrow-down pr-4">play_arrow</v-icon>

        <v-list two-line>
          <v-list-tile
            v-for="contribution in recentContributions"
            :key="contribution.contributionId"
            class="sidebar-list-item white--text pl-0"
            :class="{ primary: contribution.contributionId == currentActiveContributionId }"
            @click="switchContribution(contribution.contributionId)"
          >
            <v-list-tile-content>
              <v-list-tile-title
                class="text-capitalize title"
              >{{ contribution.software }} ({{ contribution.date }})</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
        <div class="see-all-link text-md-right pr-2">
          <a href="#" class="white--text">{{ $i18n.t("See all") }}</a>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
var latestContributionsList = require("@/assets/data/lastcontributions.json");
export default {
  name: "contributions-side-bar",
  data() {
    return {
      currentActiveContributionId: 3,
      recentContributions: []
    };
  },
  methods: {
    switchContribution(contributionId) {
      this.$store.dispatch("sidebar/setActiveContribution", contributionId);
    }
  },
  created() {
    this.recentContributions = latestContributionsList;
    this.$store.dispatch(
      "sidebar/setActiveContribution",
      this.currentActiveContributionId
    );
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters["sidebar/getActiveContribution"],
      newId => {
        this.currentActiveContributionId = newId;
      }
    );
  }
};
</script>

<style lang="stylus" scoped>
.contributions-bar {
  background-color: #2b303c;
  height: 100%;
}

.see-all-link {
  width: 100%;
}

.arrow-down {
  transform: rotate(90deg);
  position: absolute;
  left: 45%;
  width: 10%;
}

.v-list__tile__title.text-capitalize.title {
  font-size: 16px !important;
}
</style>
