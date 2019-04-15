<template>
  <v-container grid-list-md>
    <v-card-text>
      <a href="#" disabled class="text-lg-left action-links">
        <v-icon class="mr-2">format_line_spacing</v-icon>
        {{ $t("CONTRIBUTIONS") }}
      </a>
      <a href="#" class="action-links right">
        <v-icon class="mr-2">backup</v-icon>
        {{ $t("EXPORT SHEET (CSV)") }}
      </a>
      <a href="#" class="action-links mr-5 right">
        <v-icon class="mr-2">print</v-icon>
        {{ $t("PRINT SHEET") }}
      </a>
    </v-card-text>
    <v-layout row wrap justify-space-between>
      <v-flex xs7 pr-4>
        <v-card light color="white">
          <v-layout justify-center row fill-height wrap ml-3>
            <v-flex xs6>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Contributor") }} :</strong>
                {{ contribution.contributor }}
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Software") }} :</strong>
                {{ contribution.software }}
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("Client version") }} :</strong>
                {{ contribution.clientVersion }}
              </v-card-text>
            </v-flex>
            <v-flex xs6>
              <v-card-text class="px-0 information">
                <div>
                  <strong>{{ $t("Ticket #") }} :</strong>
                  {{ contribution.ticketNumber }}
                </div>
              </v-card-text>
              <v-card-text class="px-0">
                <strong>{{ $t("Proposition date") }} :</strong>
                {{ contribution.patchDate }}
              </v-card-text>
              <v-card-text class="px-0 information">
                <strong>{{ $t("patch integrated from version") }} :</strong>
                {{ contribution.patchVersion }}
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-divider class="mx-3"></v-divider>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ contribution.patchTitle }}</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>subject</v-icon>
                </v-flex>
                <v-flex xs11 class="pt-0 pl-0">
                  <div class="subject-text">{{ contribution.patchBody }}</div>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("Patch link") }}</b> :
                  <a href="#" class="pr-2">{{ contribution.patchLink }}</a>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("binary link of the software integrating the patch") }}</b> :
                  <br />
                  <a class="pr-2">{{ contribution.softwareLink }}</a>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-text>
              <v-layout>
                <v-flex xs1>
                  <v-icon>insert_link</v-icon>
                </v-flex>
                <v-flex xs11>
                  <b>{{ $t("exchanges with communities about the contribution") }}</b> :
                  <br />
                  <a class="pr-2" :href="contribution.communityPatchLink">{{ $t("see here") }}</a>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-card>
      </v-flex>
      <v-flex xs5 pt-0>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card light color="white" class="pb-3">
              <v-card-title primary-title class="px-4 text-capitalize">
                <div>
                  <h3 class="headline mb-0">
                    {{ $t("otherSoftwareContributions.message", { software: contribution.software }) }}
                  </h3>
                </div>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <v-list two-line>
                <v-list-tile
                  v-for="otherContribution in contribution.otherContributionsList"
                  :key="otherContribution.title"
                  class="related-contributions-list"
                >
                  <v-list-tile-avatar class="mt-0">
                    <v-icon color="black">format_line_spacing</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content class="pl-0">
                    <v-list-tile-title>
                      <strong>{{ otherContribution.title }}</strong>
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card light color="white">
              <v-card light color="white pb-2">
                <v-card-title primary-title class="px-4 text-capitalize">
                  <div>
                    <h3 class="headline mb-0">{{ $t("Community contribution progress") }}</h3>
                  </div>
                </v-card-title>
                <v-divider class="mx-4"></v-divider>
                <v-layout class="mb-1 mx-4">
                  <v-flex class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" color="green">label_important</v-icon>
                    <small>{{ $t("Dev") }}</small>
                    <br />
                    <small class="grey--text">12/01/2018</small>
                  </v-flex>
                  <v-flex class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" color="green">label_important</v-icon>
                    <small>{{ $t("Reversed") }}</small>
                    <br />
                    <small class="grey--text">12/01/2018</small>
                  </v-flex>
                  <v-flex class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" color="green">label_important</v-icon>
                    <small>{{ $t("Integrated") }}</small>
                    <br />
                    <small class="grey--text">12/01/2018</small>
                  </v-flex>
                  <v-flex class="green--text font-weight-bold">
                    <v-icon class="progress-arrow" color="green">label_important</v-icon>
                    <small>{{ $t("published") }}</small>
                    <br />
                    <small class="grey--text">12/01/2018</small>
                  </v-flex>
                  <v-flex class="font-weight-bold grey--text">
                    <v-icon class="progress-arrow">label_important</v-icon>
                    <small>{{ $t("Rejected") }}</small>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
var contributions = require("@/assets/data/contributions.json");
export default {
  data() {
    return {
      currentContribution: null,
      contribution: {},
      latestContributions: []
    };
  },
  created() {
    this.latestContributions = contributions;
    this.$store.dispatch("sidebar/setSidebarComponent", "contributions-side-bar");
    this.currentContribution = this.$store.getters["sidebar/getActiveContribution"];
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters["sidebar/getActiveContribution"],
      newActiveContribution => {
        this.currentContribution = newActiveContribution;
      }
    );
  },
  watch: {
    currentContribution: function(value) {
      this.contribution =
        this.latestContributions.filter(contribution => contribution.contributionId == value).shift() || {};
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  }
};
</script>

<style lang="stylus" scoped>
.action-links
  text-decoration: none;
  color: grey;
.progress-arrow
  font-size: 3.5em;
  display: block;
.information
  padding: 0px;
.subject-text
  white-space: pre-line;
.related-contributions-list
  height: 35px !important;
.container
  max-width: 100% !important;
  padding: 0px;
.flex.xs8.pr-5
  padding-right: 10px !important;
.container.grid-list-md .layout .flex
  padding: 15px;
</style>