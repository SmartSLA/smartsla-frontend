<template>
  <v-container grid-list-md class="pt-0 pl-0 mx-4 mt-4 mb-4">
    <router-link class="text-lg-left action-links" :to="{ name: 'Softwares' }"
      >&lt; {{ $t("Return to software list") }}</router-link
    >
    <v-layout row wrap justify-space-between>
      <v-flex xs12 sm12 md12 xl6 lg6 pr-4>
        <v-card class="px-0 mt-4 pb-4 pl-4 pr-2">
          <v-card-title primary-title>
            <v-layout row wrap>
              <v-flex xs7>
                <v-card-title primary-title class="px-0">
                  <div>
                    <h3 class="title font-weight-medium mb-0">{{ software.name }}</h3>
                  </div>
                </v-card-title>
              </v-flex>
              <v-flex xs4>
                <div class="text-xs-right grey--text pt-3">
                  <v-btn
                    :to="{ name: 'EditSoftware', params: { id: this.$route.params.id } }"
                    color="primary"
                    fab
                    small
                    dark
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap pt-2>
            <v-flex xs8 pr-2>
              <v-layout row wrap>
                <v-flex xs12>
                  <strong>{{ $t("Name") }} :</strong>
                  {{ software.name }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Summary") }} :</strong>
                  {{ software.summary }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Description") }} :</strong>
                  {{ software.description }}
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Licence") }} :</strong>
                  {{ software.licence }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <strong>{{ $t("Technologies") }} :</strong>
                    </v-flex>
                    <v-flex xs6>
                      <ul>
                        <li v-for="(techno, index) in software.technologies" :key="index">{{ techno }}</li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <strong>{{ $t("Versions") }} :</strong>
                    </v-flex>
                    <v-flex xs6>
                      <ul>
                        <li v-for="(version, index) in software.versions" :key="index">
                          <router-link to="#" class="blue-color">{{ version }}</router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <strong>{{ $t("Groups") }} :</strong>
                  {{ software.group }}
                </v-flex>
                <v-flex xs12>
                  <v-layout row wrap>
                    <v-flex xs4>
                      <strong>{{ $t("Links") }} :</strong>
                    </v-flex>
                    <v-flex xs6>
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
            <v-flex xs4 pr-2 v-if="software.logo">
              <img :src="software.logo" height="150" />
            </v-flex>
          </v-layout>
        </v-card>
        <v-card class="px-1 mt-4 pb-4 pl-4">
          <v-card-title primary-title class="px-0">
            <div>
              <h3 class="title font-weight-medium mb-0">{{ $t("Contributions") }}</h3>
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
      <v-flex xs12 md12 sm12 xl6 lg6 pl-4>
        <v-card class="px-1 ml-0 mt-3 pb-3 pl-4">
          <v-card-title primary-title class="px-0">
            <h3 class="title">{{ $t("Contractual informations") }}</h3>
          </v-card-title>
          <v-divider class="mx-2"></v-divider>
          <v-layout row wrap>
            <v-flex xs8>
              <strong>{{ $t("Contracts") }}:</strong>
            </v-flex>
            <v-flex xs8>
              <ul>
                <li v-for="(contract, index) in software.contracts" :key="index">
                  <router-link to="#" class="blue-color">{{ contract }}</router-link>
                </li>
              </ul>
            </v-flex>
            <v-flex xs8>
              <strong>{{ $t("Requests") }}:</strong>
            </v-flex>
            <v-flex xs6>
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
      software: {}
    };
  },
  created() {
    if (this.$route.params.id) {
      this.$http
        .getSoftwareById(this.$route.params.id)
        .then(response => {
          this.software = response.data;
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: "Failed to fetch software",
            color: "error"
          });
        });
    }
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

/*div.px-1:nth-child(1) {
  margin-left: 24px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  margin-top: 24px;
}*/
.container {
  max-width: 100% !important;
  padding: 0px;
}
@media only screen and (min-width: 1264px) {
  .container {
  max-width: 100% !important;
  padding-right: 24px;
}
}
</style>
