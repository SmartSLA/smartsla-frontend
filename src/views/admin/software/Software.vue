<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Softwares' }"
      >&lt; {{ $i18n.t("Return to software list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <v-card class="px-0 mt-4 pb-4 pl-4">
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs10>
                <v-card-title primary-title class="px-4">
                  <div>
                    <h3 class="title font-weight-medium mb-0">{{ software.name }}</h3>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs2>
                <div class="text-xs-right grey--text pt-3">
                  <v-btn color="primary" fab small dark :to="{ name: 'EditSoftware', params: { id: 15 } }">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs2>
              <img src="@/assets/angular.png" height="150" />
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs9>
              <v-layout row wrap>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Name") }} :</strong>
                  {{ software.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Summary") }} :</strong>
                  {{ software.summary }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Description") }} :</strong>
                  {{ software.description }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Licence") }} :</strong>
                  {{ software.licence }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Private") }} :</strong>
                  {{ software.private ? $i18n.t("Yes") : $i18n.t("No") }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs3>
                      <strong>{{ $i18n.t("Technologies") }} :</strong>
                    </v-flex>
                    <v-flex xs8>
                      <ul>
                        <li v-for="(techno, index) in software.technologies" :key="index">{{ techno }}</li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs3>
                      <strong>{{ $i18n.t("Versions") }} :</strong>
                    </v-flex>
                    <v-flex xs8>
                      <ul>
                        <li v-for="(version, index) in software.versions" :key="index">
                          <router-link to="#" class="blue-color">{{ version }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $i18n.t("Groups") }} :</strong>
                  {{ software.group }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <strong>{{ $i18n.t("Links") }} :</strong>
                    </v-flex>
                    <v-flex xs8>
                      <ul>
                        <li v-for="(link, index) in software.links" :key="index">
                          <router-link to="#" class="blue-color">{{ link }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <div>
              <h3 class="title font-weight-medium mb-0">{{ $i18n.t("Contributions") }}</h3>
            </div>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>

          <v-data-table :items="software.contributions" :headers="contributionsHeaders" hide-actions>
            <template v-slot:items="props">
              <td class="text-xs-center">{{ props.item.date }}</td>
              <td class="text-xs-center text-capitalize">
                <router-link to="#" class="blue-color">{{ props.item.version }}</router-link>
              </td>
              <td class="text-xs-center text-capitalize">
                <router-link to="#" class="blue-color">{{ props.item.summary }}</router-link>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs4>
        <v-card class="px-1 ml-3 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-4">
            <h3 class="title">{{ $i18n.t("Contractual informations") }}</h3>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs4>
              <strong>{{ $i18n.t("Contracts") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <ul>
                <li v-for="(contract, index) in software.contracts" :key="index">
                  <router-link to="#" class="blue-color">{{ contract }}</router-link>
                </li>
              </ul>
            </v-flex>
            <v-flex xs4>
              <strong>{{ $i18n.t("Requests") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <ul>
                <li v-for="(request, index) in software.requests" :key="index">
                  <router-link to="#" class="blue-color">{{ request }}</router-link>
                </li>
              </ul>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      software: {
        name: "Angular",
        contracts: ["contract1", "contract2", "contract3", "contract4", "contract5", "contract6"],
        requests: ["request1", "request2", "request3", "request4"],
        summary:
          "Angular is a TypeScript-based open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS.",
        licence: "MIT",
        technologies: ["JAVA", "WEB"],
        versions: ["1.4", "1.5", "1.6", "1.7"],
        group: "Developpment framework",
        links: ["www.angular.com", "angular.org"],
        contributions: [
          {
            date: "12/04/2020",
            version: "1.4",
            summary: "Amélioration du module angular"
          },
          {
            date: "13/02/2019",
            version: "1.7",
            summary: "Amélioration du gestion de cache"
          },
          {
            date: "24/03/2018",
            version: "1.3",
            summary: "Amélioration continues"
          }
        ]
      }
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "software");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");

    next();
  },
  computed: {
    contributionsHeaders() {
      return [
        { text: this.$i18n.t("Date"), value: "date" },
        { text: this.$i18n.t("Version"), value: "version" },
        { text: this.$i18n.t("Summary"), value: "summary" }
      ];
    }
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}

.pt-0 {
  margin: 0px !important;
  padding-right: 0px;
}

div.xs8:nth-child(1) {
  padding: 0px;
}

div.xs8:nth-child(1) > div:nth-child(1) {
  padding-left: 0px !important;
}

div.px-1:nth-child(2) {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

div.xs4:nth-child(2) {
  padding: 0px;
}

div.px-1:nth-child(1) {
  margin-left: 24px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  margin-top: 24px;
}
</style>
