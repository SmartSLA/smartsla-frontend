<template>
  <v-container class="pt-0 px-0 contributions-bar">
    <v-layout row wrap>
      <v-flex xs12>
        <v-subheader inset class="text-uppercase blue white--text title ml-0">{{
          $t("recently accepted contributions")
        }}</v-subheader>
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
              <v-list-tile-title class="text-capitalize title"
                >{{ contribution.software }} ({{ contribution.date }})</v-list-tile-title
              >
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
        <div class="see-all-link text-md-right pr-2">
          <a href="#" class="white--text">{{ $t("See all") }}</a>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "contributions-side-bar",
  data() {
    return {
      currentActiveContributionId: 3,
      recentContributions: [
        {
          software: "LibreOffice",
          date: "12/01/2018",
          contributionId: 1
        },
        {
          software: "OpenPaas",
          date: "12/01/2017",
          contributionId: 2
        },
        {
          software: "OpenLdap",
          date: "12/01/2016",
          contributionId: 3
        },
        {
          software: "HUAWAEI",
          date: "12/01/2015",
          contributionId: 4
        },
        {
          software: "Sympa",
          date: "12/01/2019",
          contributionId: 5
        },
        {
          software: "JaspePort",
          date: "12/01/2016",
          contributionId: 6
        },
        {
          software: "OpenLdap",
          date: "12/01/2016",
          contributionId: 7
        }
      ]
    };
  },
  methods: {
    switchContribution(contributionId) {
      this.$store.dispatch("sidebar/setActiveContribution", contributionId);
    }
  },
  created() {
    this.$store.dispatch("sidebar/setActiveContribution", this.currentActiveContributionId);
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
<style lang="css" scoped>
.contributions-bar {
  background-color: #2b303c;
  height: 100%;
}
.see-all-link {
  width: 100%;
}
</style>
