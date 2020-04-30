<template>
  <v-navigation-drawer
    app
    clipped
    :fixed="!isMobile ? true : false"
    :permanent="isMobile ? true : false"
    :temporary="isMobile ? true : false"
    light
    width="270"
    :mini-variant="drawer.mini"
    mini-variant-width="60"
    mobile-break-point="450"
    right
  >
    <v-list>
      <v-list-tile v-if="!isMobile" @click="drawer.mini = !drawer.mini">
        <v-list-tile-content v-if="!drawer.mini">
          <v-list-tile-title class="pl-2 body-1">{{ $t("Collapse menu") }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>{{ drawer.mini ? "chevron_left" : "chevron_right" }}</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile v-else @click="emitSidebarStatus">
        <v-list-tile-content>
          <v-list-tile-title class="pl-2 ml-1 body-1">{{ $t("Collapse menu") }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>chevron_right</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider :class="drawer.mini || !request.responsible ? 'd-block' : 'mx-3 mb-2'"></v-divider>
    </v-list>
    <v-list two-line subheader>
      <v-layout column>
        <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" class="my-2" size="24">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-img
                v-if="request.responsible"
                v-on="on"
                :src="`${apiUrl}/api/users/${request.responsible.id}/profile/avatar`"
              ></v-img>
              <v-icon v-else large>person</v-icon>
            </template>

            <span>
              <b>{{ $t("Interlocutor") }}</b>
              <br />
              {{ request.responsible && request.responsible.name }}
            </span>
          </v-tooltip>
        </v-list-tile-avatar>
        <v-list-tile v-if="!drawer.mini" class="ml-2">
          <v-layout column align-center px-0>
            <v-list-tile-title class="body-1 ml-4">
              {{ $t("Interlocutor") }}
            </v-list-tile-title>
            <v-layout mr-5>
              <v-list-tile-avatar v-if="request.responsible">
                <v-avatar size="30">
                  <v-img :src="`${apiUrl}/api/users/${request.responsible.id}/profile/avatar`"></v-img>
                </v-avatar>
              </v-list-tile-avatar>

              <v-list-tile-content v-if="request.responsible">
                <v-list-tile-title class="body-1">
                  {{ request.responsible && request.responsible.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="request.responsible.email" class="caption">
                  <a
                    :href="`mailto:${request.responsible.email}?subject=[${getUser.name}] - ${request.title}`"
                    class="grey--text text--darken-1"
                  >
                    {{ request.responsible.email }}
                  </a>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-sub-title class="caption">
                  {{ $t("No interlocutor in charge") }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-layout>
          </v-layout>
        </v-list-tile>
      </v-layout>
      <v-divider class="mx-3 mt-2" :class="request.reponsible ? 'mt-2 mb-0' : ''"></v-divider>

      <v-layout column :class="drawer.mini ? '' : 'my-2'">
        <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" class="my-2" size="24">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-img
                v-if="request.beneficiary"
                v-on="on"
                :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"
              ></v-img>
              <v-icon v-else large>person</v-icon>
            </template>

            <span>
              <b>{{ $t("Beneficiary") }}</b>
              <br />
              {{ request.beneficiary && request.beneficiary.name }}
            </span>
          </v-tooltip>
        </v-list-tile-avatar>
        <v-list-tile v-if="!drawer.mini" class="ml-2">
          <v-layout column align-center px-0>
            <v-list-tile-title class="body-1 ml-4">
              {{ $t("Beneficiary") }}
            </v-list-tile-title>
            <v-layout mr-5>
              <v-list-tile-avatar v-if="request.beneficiary">
                <v-avatar size="30">
                  <v-img :src="`${apiUrl}/api/users/${request.beneficiary.id}/profile/avatar`"></v-img>
                </v-avatar>
              </v-list-tile-avatar>

              <v-list-tile-content v-if="request.beneficiary">
                <v-list-tile-title class="body-1">
                  {{ request.beneficiary && request.beneficiary.name }}
                </v-list-tile-title>
                <v-list-tile-sub-title v-if="request.beneficiary.email" class="caption">
                  <a
                    :href="`mailto:${request.beneficiary.email}?subject=[${getUser.name}] - ${request.title}`"
                    class="grey--text text--darken-1"
                  >
                    {{ request.beneficiary.email }}
                  </a>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>
                  {{ $t("No beneficiary in charge") }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-layout>
          </v-layout>
        </v-list-tile>
        <v-container py-0 mt-2 ml-4 v-if="!drawer.mini">
          <v-layout row align-center justify-center>
            <v-flex v-if="request.beneficiary.phone || request.callNumber" class="caption">
              <v-icon small class="mr-1">phone</v-icon>
              <a :href="`tel:${request.beneficiary.phone || request.callNumber}`">{{
                request.beneficiary.phone || request.callNumber
              }}</a>
            </v-flex>
            <v-flex v-if="request.meetingId" class="caption">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="mr-1">duo</v-icon>
                </template>
                <b>Meeting ID</b>
              </v-tooltip>
              {{ request.meetingId }}
            </v-flex>
          </v-layout>
          <v-flex v-if="request.contract" class="caption">
            <client-contract-links :contractId="request.contract" />
          </v-flex>
        </v-container>
      </v-layout>
      <v-divider class="mx-3 mt-2" :class="request.cns.bypassed ? 'mb-5 pb-2' : ''"></v-divider>

      <v-layout column>
        <v-list-tile-avatar v-if="drawer.mini" @click="drawer.mini = false" class="my-2" size="24">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" medium>schedule</v-icon>
            </template>
            <span>
              <b>{{ $t("Service deadlines") }}</b>
              <br />
              {{ $t(capitalize(calculateCnsType(request))) }}
              <br />
              <cns-progress-bar
                :ticket="request"
                :cnsType="calculateCnsType(request)"
                :hideClock="true"
              ></cns-progress-bar>
            </span>
          </v-tooltip>
        </v-list-tile-avatar>
        <v-list-tile v-if="!drawer.mini">
          <v-layout column px-0 v-if="request.cns.bypassed">
            <v-list-tile-title class="ml-4 body-1">{{ $t("Service deadlines") }}</v-list-tile-title>

            <v-list-tile-sub-title class="ml-4 caption">{{ $t("cns.state.support") }} </v-list-tile-sub-title>
            <cns-progress-bar :ticket="request" :cnsType="'supported'" class="mx-4"></cns-progress-bar>

            <v-list-tile-sub-title class="ml-4 caption">{{ $t("cns.state.bypass") }}</v-list-tile-sub-title>
            <cns-progress-bar :ticket="request" :cnsType="'bypassed'" class="mx-4"></cns-progress-bar>

            <v-list-tile-sub-title class="ml-4 caption">{{ $t("cns.state.resolution") }}</v-list-tile-sub-title>
            <cns-progress-bar :ticket="request" :cnsType="'resolved'" class="mx-4"></cns-progress-bar>
          </v-layout>
          <v-layout column v-else>
            <v-list-tile-title class="ml-4 body-1">{{ $t("Service deadlines") }}</v-list-tile-title>
            <v-list-tile-sub-title class="ml-4 caption"
              >{{ $t("There is no service deadline for this ticket") }}
            </v-list-tile-sub-title>
          </v-layout>
        </v-list-tile>
      </v-layout>
      <v-divider class="mx-3" :class="request.cns.bypassed ? 'pt-5 mt-5' : ''"></v-divider>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { REQUEST_TYPE, TICKET_STATUS, CNS_TYPES } from "@/constants.js";
import { capitalize } from "lodash";
import ClientContractLinks from "@/components/request/ClientContractLinks";
import cnsProgressBar from "@/components/CnsProgressBar";
import RelatedContributions from "@/components/request/RelatedContributions";

export default {
  props: ["request", "apiUrl", "contributions", "fetchTicket", "isMobile", "getUser"],
  components: {
    ClientContractLinks,
    cnsProgressBar,
    RelatedContributions
  },
  data() {
    return {
      drawer: {
        mini: this.isMobile ? false : true
      },
      showBeneficiaryInfo: false,
      showInterlocutorInfo: false
    };
  },
  methods: {
    calculateCnsType({ status, type }) {
      if (!status) return TICKET_STATUS.NEW;
      if (type !== REQUEST_TYPE.ANOMALY && status === TICKET_STATUS.SUPPORTED) {
        return CNS_TYPES.RESOLUTION;
      }
      if (status === TICKET_STATUS.SUPPORTED) return CNS_TYPES.BYPASS;
      if (status === TICKET_STATUS.NEW) return CNS_TYPES.SUPPORT;
      if (status === TICKET_STATUS.BYPASSED) return CNS_TYPES.RESOLUTION;
      else return "";
    },

    capitalize(value) {
      return capitalize(value);
    },

    emitSidebarStatus() {
      return this.$emit("update-sidebar-status");
    }
  },
  computed: {
    beneficiaryNumber() {
      if (this.request.callNumber) {
        return this.request.callNumber;
      }
      if (this.request.beneficiary && this.request.beneficiary.phone) {
        return this.request.beneficiary.phone;
      }
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
.small-icon-width {
  width: 16px;
}
</style>
