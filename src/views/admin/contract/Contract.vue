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
                  <v-flex xs10>
                    <h3 class="headline">{{ contract.name }}</h3>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        dark
                        :to="{
                          name: 'Edit Contract',
                          params: { id: contract._id, section: 'information', type: 'information' }
                        }"
                      >
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
                  <v-flex xs8>{{ contract.client }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Name") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.name }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Commercial contact") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <router-link to="#" class="font-weight-bold">{{ contract.contact.commercial }}</router-link>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Technical Contact") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <router-link to="#" class="font-weight-bold">{{ contract.contact.technical }}</router-link>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Internal mailing list") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.mailingList.internal.join(", ") }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("External mailing list") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.mailingList.external.join(", ") }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Business hours") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <div class="subheading font-weight-medium" v-if="contract.businessHours">
                      {{ contract.businessHours.start }} H - {{ contract.businessHours.end }} H
                    </div>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("24h/7 option") }} :</div>
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Start") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ new Date(contract.startDate).toString() }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("End") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ new Date(contract.endDate).toString() }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Status") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ $t(contract.status) ? $t("active") : $t("not active") }}</v-flex>
                </v-layout>
              </v-card-text>
              <v-layout row wrap align-end>
                <v-flex xs12 text-xs-center align-end>
                  <div>
                    <v-btn primary color="primary">{{ $t("Renew this contract") }}</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs10>
                    <h3 class="headline">{{ $t("Supported software") }}</h3>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        dark
                        :to="{
                          name: 'Edit Contract',
                          params: { id: contract._id, section: 'software', type: 'software' }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table :items="contract.software" :headers="softwareHeaders" hide-actions>
                  <template v-slot:items="props">
                    <td class="text-xs-center">
                      <router-link to="#">{{ props.item.software.name }}</router-link>
                    </td>
                    <td class="text-xs-center">{{ props.item.version }}</td>
                    <td class="text-xs-center">{{ props.item.os }}</td>
                    <td
                      class="text-xs-center"
                      v-if="props.item.SupportDate.start.length && props.item.SupportDate.start.length"
                    >
                      {{ $t("S") }}: {{ props.item.SupportDate.start }}
                      <br />
                      {{ $t("E") }}: {{ props.item.SupportDate.end }}
                    </td>
                    <td v-else class="text-xs-center">{{ $t("contract in progress") }}</td>
                    <td class="text-xs-center">
                      <v-chip
                        :color="critColor(props.item.critical)"
                        :text-color="critTextColor(props.item.critical)"
                        label
                        >{{ $t(props.item.critical) }}</v-chip
                      >
                    </td>
                    <td class="text-xs-center">
                      <span v-if="props.item.generic == 'yes'">{{ $t(props.item.generic) }}</span>
                      <router-link v-else to="#">repo</router-link>
                    </td>
                    <td class="text-xs-center">{{ props.item.technicalReferent }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card class="contractual-commitments">
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs10>
                    <h4 class="headline">
                      {{ $t("Contractual commitments") }}
                      <v-chip
                        :color="critColor('critical')"
                        :text-color="critTextColor('critical')"
                        label
                      >
                        {{ $t("critical") }}
                      </v-chip>
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        dark
                        :to="{
                          name: 'Edit Contract',
                          params: { id: contract._id, section: 'engagements', type: 'critical' }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table
                  :items="criticalContractualCommitments()"
                  :headers="contractualCommitmentsHeaders"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <td class="text-xs-center">{{ $t(props.item.request) }}</td>
                    <td class="text-xs-center text-capitalize">{{ $t(props.item.severity) }}</td>
                    <td class="text-xs-center text-capitalize">{{ $t(props.item.idOssa) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.supported)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.bypassed)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.resolved)) }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card class="contractual-commitments">
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs10>
                    <h4 class="headline">
                      {{ $t("Contractual commitments") }}
                      <v-chip 
                        :color="critColor('sensible')"
                        :text-color="critTextColor('sensible')"
                        label
                      >
                        {{ $t("sensible") }}
                      </v-chip>
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        dark
                        :to="{
                          name: 'Edit Contract',
                          params: { id: contract._id, section: 'engagements', type: 'sensible' }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table
                  :items="sensibleContractualCommitments()"
                  :headers="contractualCommitmentsHeaders"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <td class="text-xs-center">{{ $t(props.item.request) }}</td>
                    <td class="text-xs-center text-capitalize">{{ $t(props.item.severity) }}</td>
                    <td class="text-xs-center text-capitalize">{{ $t(props.item.idOssa) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.supported)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.bypassed)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.resolved)) }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card class="contractual-commitments">
              <v-card-title primary-title>
                <v-layout>
                  <v-flex xs10>
                    <h4 class="headline">
                      {{ $t("Contractual commitments") }}
                      <v-chip
                        :color="critColor('standard')"
                        :text-color="critTextColor('standard')"
                        label
                      >
                        {{ $t("standard") }}
                      </v-chip>
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        dark
                        :to="{
                          name: 'Edit Contract',
                          params: { id: contract._id, section: 'engagements', type: 'standard' }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table
                  :items="standardContractualCommitment()"
                  :headers="contractualCommitmentsHeaders"
                  hide-actions
                >
                  <template v-slot:items="props">
                    <td class="text-xs-center">{{ $t(props.item.request) }}</td>
                    <td class="text-xs-center text-capitalize">{{ $t(props.item.severity) }}</td>
                    <td class="text-xs-center text-capitalize">
                      <span>
                        <v-avatar :color="getOssaByKey(props.item.idOssa).color" size="25">
                          <span class="white--text">{{ getOssaByKey(props.item.idOssa).id }}</span>
                        </v-avatar>
                        <span class="pl-2"> {{ $t(getOssaByKey(props.item.idOssa).key) }}  </span>
                      </span>
                    </td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.supported)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.bypassed)) }}</td>
                    <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.resolved)) }}</td>
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
              <v-flex xs10>
                <h3 class="headline">{{ $t("Human resources") }}</h3>
              </v-flex>
              <v-flex xs2>
                <div class="text-xs-right grey--text">
                  <v-btn
                    color="primary"
                    disabled
                    fab
                    small
                    dark
                    :to="{ name: 'Edit Contract', params: { id: contract._id, section: 'hr', type: 'hr' } }"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-list two-line dense>
            <template v-if="customers.length">
              <v-subheader>
                {{ $t("Beneficiaries") }}
              </v-subheader>
              <users-list :users="customers"/>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { OSSA_IDS } from '@/constants.js';
import UsersList from "@/components/user/UsersList.vue";
import moment from "moment";

export default {
  data() {
    return {
      contract: {},
      contractUsers: null
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
        {
          text: this.$i18n.t("Support"),
          value: "supported",
          sortable: false
        },
        { text: this.$i18n.t("Bypassed"), value: "bypassed", sortable: false },
        { text: this.$i18n.t("Resolved"), value: "resolved", sortable: false }
      ];
    },
    customers() {
      return this.getUsersWithRole("customer");
    }
  },
  created() {
    var contractId = this.$route.params.id || "";
    this.$http
      .getContractById(contractId)
      .then(response => {
        this.contract = response.data;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contract"),
          color: "error"
        });
      });

      this.$http.getContractUsers(contractId)
        .then(users => this.contractUsers = users)
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Failed to fetch users"),
            color: "error"
          });
        });

  },
  methods: {
    getOssaByKey(key) {
      return OSSA_IDS.find(ossaId => ossaId.key == key);
    },
    edit() {
      return;
    },

    getUsersWithRole(role) {
      return (this.contractUsers || [])
        .filter(contractUsers => contractUsers.role === role)
        .map(reader => (reader.user));
    },

    critColor(critLevel) {
      switch (critLevel) {
        case "critical":
          return "#d32f2f";
        case "sensible":
          return "#ffa000";
        case "standard":
          return "#e0e0e0";
        default:
          return "";
      }
    },

    critTextColor(critLevel) {
      switch (critLevel) {
        case "critical":
        case "sensible":
          return "white";
        default:
          return "black";
      }
    },

    criticalContractualCommitments() {
      return this.contract.Engagements.critical.engagements || [];
    },

    sensibleContractualCommitments() {
      return this.contract.Engagements.sensible.engagements || [];
    },

    standardContractualCommitment() {
      return this.contract.Engagements.standard.engagements || [];
    },

    parseDuration(duration) {
      const parsedDuration = moment.duration(duration);

      return {
        days: parsedDuration.days(),
        hours: parsedDuration.hours()
      };
    }
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },
  components: {
    UsersList
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

div.v-card__text:nth-child(1) {
  padding-left: 0px;
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 24px;
}

div.pt-0:nth-child(1) > div:nth-child(2) {
  margin-left: 0px;
  margin-right: 0px;
}

.xs7 {
  padding-left: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}

div.justify-space-between:nth-child(1) {
  margin-top: 0px;
  margin-right: 0px;
  margin-left: 0px;
  margin-bottom: 0px;
}

div.justify-space-between:nth-child(1) > div:nth-child(1) {
  padding-top: 0px;
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
}

div.pt-0:nth-child(2) {
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
}

div.xs12:nth-child(2) {
  padding-top: 24px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
}

div.layout:nth-child(3) {
  margin-bottom: 0px;
  margin-left: 0px;
  margin-right: 0px;
}

div.xs12:nth-child(3) {
  padding-top: 24px !important;
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 0px !important;
}

.contractual-commitments {
  margin-top: 24px;
}

td, th.column.text-xs-center {
  padding: 0px 5px !important;
}

.contractual-commitments .v-card__text {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
