<template>
  <v-container grid-list-md class="pt-0 pl-0">
    <v-card-text>
      <router-link class="text-lg-left action-links" :to="{ name: 'Contracts' }">
        <v-icon class="mr-2">arrow_back_ios</v-icon>
        {{ $t("Return to contracts list") }}
      </router-link>
    </v-card-text>
    <v-layout row wrap justify-space-between>
      <v-flex xs7 pr-4>
        <v-layout row wrap justify-space-between>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title class="pb-0">
                <v-layout>
                  <v-flex xs6>
                    <h3 class="headline">{{ contract.name }}</h3>
                  </v-flex>
                  <v-flex xs6>
                    <div class="text-xs-right grey--text">
                      <v-btn color="primary" fab small dark>
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider></v-divider>
                <v-layout row wrap justify-space-between>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Client") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <v-icon>help</v-icon>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("name") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.client.name }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Commercial Contact") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <router-link to="#" class="font-weight-bold">{{ contract.contacts.commercial.name }}</router-link>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("technical Contact") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <router-link to="#" class="font-weight-bold">{{ contract.contacts.technical.name }}</router-link>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Internal mailing list") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.mailingLists.internal.join(", ") }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("External mailing list") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.mailingLists.external.join(", ") }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Start") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.startDate }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("End") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.endDate }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Status") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ $t(contract.status) }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("schedule") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.schedule }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">
                      {{ $t("requests shared among the beneficiaries") }} :
                    </div>
                  </v-flex>
                  <v-flex xs8>{{ contract.sharedRequests ? $t("yes") : $t("no") }}</v-flex>
                </v-layout>
              </v-card-text>
              <v-layout row wrap align-end>
                <v-flex xs12 text-xs-right align-end>
                  <div>
                    <v-btn primary color="primary">{{ $t("renew this contract") }}</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs6>
                    <h3 class="headline">{{ $t("Supported software") }}</h3>
                  </v-flex>
                  <v-flex xs6>
                    <div class="text-xs-right grey--text" @click="edit">
                      <v-btn color="primary" fab small dark>
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table :items="contract.relatedSoftware" :headers="softwareHeaders" hide-actions>
                  <template v-slot:items="props">
                    <td class="text-xs-left">
                      <router-link to="#">{{ props.item.name }}</router-link>
                    </td>
                    <td class="text-xs-center">{{ props.item.version }}</td>
                    <td class="text-xs-center">{{ props.item.os }}</td>
                    <td class="text-xs-left">
                      {{ $t("S") }}: {{ props.item.SupportDate.start }}
                      <br />
                      {{ $t("E") }}: {{ props.item.SupportDate.start }}
                    </td>
                    <td class="text-xs-left">
                      <v-chip color="red" text-color="white" label v-if="props.item.critical">{{ $t("Yes") }}</v-chip>
                      <v-chip label v-else>{{ $t("No") }}</v-chip>
                    </td>
                    <td class="text-xs-center">
                      <v-icon v-if="props.item.generic">check</v-icon>
                    </td>
                    <td class="text-xs-center">{{ props.item.technicalReferent }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs6>
                    <h3 class="headline">{{ $t("Contractual commitments") }}</h3>
                  </v-flex>
                  <v-flex xs6>
                    <div class="text-xs-right grey--text">
                      <v-btn color="primary" fab small dark>
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table
                  :items="contract.contractualCommitments"
                  :headers="contractualCommitmentsHeaders"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <td class="text-xs-left">{{ $t(props.item.request) }}</td>
                    <td class="text-xs-left text-capitalize">{{ $t(props.item.severity) }}</td>
                    <td class="text-xs-left text-capitalize">{{ $t(props.item.idOssa) }}</td>
                    <td class="text-xs-center">{{ $t(props.item.bypassed) }}</td>
                    <td class="text-xs-center">{{ $t(props.item.fix) }}</td>
                    <td class="text-xs-center">{{ props.item.description }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs5 pt-0>
        <v-card>
          <v-card-title primary-title>
            <v-layout>
              <v-flex xs6>
                <h3 class="headline">{{ $t("Human resources") }}</h3>
              </v-flex>
              <v-flex xs6>
                <div class="text-xs-right grey--text">
                  <v-btn color="primary" fab small dark>
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text>
            <div class="subheading font-weight-regular pb-2">{{ $t("beneficiaries") }} :</div>
            <ul class="pb-2 grey--text">
              <li v-for="beneficiary in contract.beneficiaries" :key="beneficiary.id">
                <router-link to="#">{{ beneficiary.name }}</router-link>
              </li>
            </ul>
            <v-divider class="ml-1 mr-1 pb-2"></v-divider>
            <div class="subheading font-weight-regular">{{ $t("Teams") }} :</div>
            <ul ul class="pb-2 grey--text">
              <li v-for="team in contract.teams" :key="team.id">
                <router-link to="#">{{ team.name }}</router-link>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
var contract = require("@/assets/data/contract.json");
export default {
  data() {
    return {
      contract: {}
    };
  },
  computed: {
    softwareHeaders() {
      return [
        { text: this.$i18n.t("Software"), value: "software", sortable: false },
        { text: this.$i18n.t("Version"), value: "version", sortable: false },
        { text: this.$i18n.t("OS"), value: "os", sortable: false },
        {
          text: this.$i18n.t("Support date"),
          value: "supportDate",
          sortable: false
        },
        { text: this.$i18n.t("Critical"), value: "critical", sortable: false },
        { text: this.$i18n.t("Generic"), value: "generic", sortable: false },
        {
          text: this.$i18n.t("Tech. referent"),
          value: "technicalReferent",
          sortable: false
        }
      ];
    },

    contractualCommitmentsHeaders() {
      return [
        { text: this.$i18n.t("Request"), value: "request", sortable: false },
        { text: this.$i18n.t("Severity"), value: "severity", sortable: false },
        { text: this.$i18n.t("Id OSSA"), value: "idOssa", sortable: false },
        { text: this.$i18n.t("Bypassed"), value: "bypassed", sortable: false },
        { text: this.$i18n.t("Fix"), value: "fix", sortable: false },
        {
          text: this.$i18n.t("Description"),
          value: "description",
          sortable: false
        }
      ];
    }
  },
  created() {
    this.contract = contract;
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contracts");
  },
  methods: {
    edit() {
      return;
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>
<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
}
.container {
  max-width: 100% !important;
  padding: 0px;
}
</style>
