<template>
  <v-container grid-list-md class="pt-0 pl-0">
    <v-layout row wrap justify-space-between>
      <v-flex flex xs12 :class="canViewHumanResources() ? 'sm7' : 'sm12'">
        <v-layout row wrap justify-space-between>
          <v-flex xs12 mb-2>
            <v-card>
              <v-card-title primary-title class="pb-0">
                <v-layout>
                  <v-flex>
                    <h3 class="headline">{{ contract.name }}</h3>
                  </v-flex>
                  <v-flex>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        :disabled="!isAdmin"
                        fab
                        small
                        :dark="isAdmin"
                        :to="{
                          name: routeNames.EDITCONTRACTINFORMATION,
                          params: { id: contract._id }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-btn
                        color="primary"
                        :disabled="!isAdmin"
                        depressed
                        fab
                        small
                        :dark="isAdmin"
                        @click="editEngagment"
                      >
                        <v-icon>post_add</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                  <v-dialog v-model="formDialog" scrollable :fullscreen="$vuetify.breakpoint.xs" max-width="600px">
                    <copy-engagements-form
                      :isModalOpen="formDialog"
                      :contract="contract"
                      @submit="submit"
                      @closeFormModal="closeFormModal"
                    ></copy-engagements-form>
                  </v-dialog>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider></v-divider>
                <v-layout row wrap justify-space-between>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Client") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    <router-link
                      v-if="isAdmin"
                      :to="{ name: 'Client', params: { id: contract.clientId } }"
                      class="blue-color"
                      >{{ contract.client }}
                    </router-link>
                    <span v-else> {{ contract.client }} </span>
                  </v-flex>
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
                    <div class="subheading font-weight-medium">{{ $t("Vulnerability mailing list") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    {{
                      contract.mailingList &&
                        contract.mailingList.vulnerability &&
                        contract.mailingList.vulnerability.join(", ")
                    }}
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
                  <v-flex xs8>
                    {{ $t(contract.features && contract.features.nonBusinessHours) ? $t("active") : $t("Not active") }}
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("LinInfoSec option") }} :</div>
                  </v-flex>
                  <v-flex xs8>
                    {{ $t(contract.features && contract.features.linInfoSec) ? $t("active") : $t("Not active") }}
                  </v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Status") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ $t(contract.status) ? $t("active") : $t("Not active") }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Start") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.startDate | formatDateFilter("ll", userLanguage) }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("End") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ contract.endDate | formatDateFilter("ll", userLanguage) }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Timezone") }} :</div>
                  </v-flex>
                  <v-flex xs8>{{ timezone() }}</v-flex>
                  <v-flex xs4>
                    <div class="subheading font-weight-medium">{{ $t("Type") }} :</div>
                  </v-flex>
                  <v-flex xs8 v-if="contract.type === 'credit'">
                    <v-layout row wrap>
                      <v-flex xs6>{{ contract.type }}</v-flex>
                      <v-flex xs6>{{ contract.credits }}</v-flex>
                      <v-flex xs6>{{ $t("Consumed") }}</v-flex>
                      <v-flex xs6>{{ consumedCredits }}</v-flex>
                      <v-flex xs6>{{ $t("Remaining") }}</v-flex>
                      <v-flex xs6>{{ remaining }}</v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex v-else xs8>{{ contract.type }}</v-flex>
                  <v-flex v-if="contract.externalLinks && contract.externalLinks.length" xs4>
                    <div class="subheading font-weight-medium">{{ $t("External links") }} :</div>
                  </v-flex>
                  <v-flex v-if="contract.externalLinks && contract.externalLinks.length" xs8>
                    <li :key="index" v-for="(link, index) in contract.externalLinks">
                      <a :href="link.url" target="_blank">{{ link.name }}</a>
                    </li>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <v-layout row wrap>
                  <v-flex xs10>
                    <h3 class="headline">
                      {{ $t("Supported software") }} <v-chip>{{ software.length }} </v-chip>
                    </h3>
                  </v-flex>
                  <v-flex xs2>
                    <div class="text-xs-right grey--text">
                      <v-btn
                        color="primary"
                        fab
                        small
                        :disabled="!isAdmin"
                        :dark="isAdmin"
                        :to="{
                          name: routeNames.EDITCONTRACTSOFTWARES,
                          params: { id: contract._id }
                        }"
                      >
                        <v-icon>edit</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>

                  <v-flex xs12>
                    <v-chip :color="critColor('critical')" :text-color="critTextColor('critical')">
                      <v-avatar class="red darken-4">{{ softwareCounter.totalCritical }}</v-avatar>
                      <span>{{ $t("critical") }}</span>
                    </v-chip>
                    <v-chip right :color="critColor('sensible')" :text-color="critTextColor('sensible')">
                      <v-avatar class="orange darken-4">{{ softwareCounter.totalSensible }}</v-avatar>
                      {{ $t("sensible") }}
                    </v-chip>
                    <v-chip :color="critColor('standard')" :text-color="critTextColor('standard')">
                      <v-avatar class="grey darken-1">{{ softwareCounter.totalStandard }}</v-avatar>
                      {{ $t("standard") }}
                    </v-chip>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text>
                <v-divider class="ml-1 mr-1"></v-divider>
                <v-data-table :items="software" :headers="softwareHeaders" hide-actions>
                  <template v-slot:items="props">
                    <td class="text-xs-center">
                      <router-link
                        v-if="isAdmin"
                        :to="{ name: 'Software', params: { id: props.item.software._id } }"
                        class="blue-color"
                      >
                        {{ props.item.software.name }}
                      </router-link>
                      <span v-else>{{ props.item.software.name }}</span>
                      <expired-label :expirationDate="props.item.SupportDate.end"></expired-label>
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
                      {{ props.item.technicalReferent && props.item.technicalReferent.name }}
                    </td>
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
                      <v-chip :color="critColor('critical')" :text-color="critTextColor('critical')" label>
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
                        :disabled="!isAdmin"
                        :dark="isAdmin"
                        :to="{
                          name: routeNames.EDITCONTRACTENGAGEMENTS,
                          params: { id: contract._id, type: 'critical' }
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
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved)) }}
                      </span>
                    </td>
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
                      <v-chip :color="critColor('sensible')" :text-color="critTextColor('sensible')" label>
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
                        :disabled="!isAdmin"
                        :dark="isAdmin"
                        :to="{
                          name: routeNames.EDITCONTRACTENGAGEMENTS,
                          params: { id: contract._id, type: 'sensible' }
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
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved)) }}
                      </span>
                    </td>
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
                      <v-chip :color="critColor('standard')" :text-color="critTextColor('standard')" label>
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
                        :disabled="!isAdmin"
                        :dark="isAdmin"
                        :to="{
                          name: routeNames.EDITCONTRACTENGAGEMENTS,
                          params: { id: contract._id, type: 'standard' }
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
                        <span class="pl-2"> {{ $t(getOssaByKey(props.item.idOssa).key) }} </span>
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.supported && props.item.supported)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.bypassed && props.item.bypassed)) }}
                      </span>
                    </td>
                    <td class="text-xs-center">
                      <span>
                        {{ $t("BH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved, true)) }}
                      </span>
                      <span v-if="contract.features && contract.features.nonBusinessHours">
                        <br />
                        {{ $t("NBH") }}: {{ $t(cnsDurationDisplay(props.item.resolved && props.item.resolved)) }}
                      </span>
                    </td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex flex sm5 :pl-3="!$vuetify.breakpoint.xs" v-if="canViewHumanResources()">
        <v-card>
          <v-card-title primary-title>
            <v-layout>
              <v-flex xs10>
                <h3 class="headline">
                  {{ $t("Human resources") }}
                  <v-chip small>{{ totalUsers }}</v-chip>
                </h3>
              </v-flex>
              <v-flex xs2>
                <div class="text-xs-right">
                  <v-dialog v-model="usersDialog" width="700">
                    <v-card>
                      <v-toolbar flat>
                        <v-btn @click="usersDialog = false" fab flat small class="ml-3">
                          <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>{{ $t("Add user") }}</v-toolbar-title>
                      </v-toolbar>
                      <v-card-text>
                        <contract-add-users
                          :contract="contract"
                          :contractUsers="contractUsers"
                          :key="ContractAddUsersComponentKey"
                          @close="usersDialog = false"
                          @user:added="forceRerender"
                        />
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    color="primary"
                    fab
                    flat
                    small
                    :disabled="!isAdmin"
                    :dark="isAdmin"
                    @click="usersDialog = true"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-list two-line dense>
            <template v-if="contractManagers.length">
              <v-subheader>
                {{ $t("contract manager") }}
                <v-chip small>{{ contractManagers.length }}</v-chip>
              </v-subheader>
              <users-list :users="contractManagers" />
            </template>
            <template v-if="operationalManagers.length">
              <v-subheader>
                {{ $t("operational manager") }}
                <v-chip small>{{ operationalManagers.length }}</v-chip>
              </v-subheader>
              <users-list :users="operationalManagers" />
            </template>
            <template v-if="customers.length">
              <v-subheader>
                {{ $t("Beneficiaries") }}
                <v-chip small>{{ customers.length }}</v-chip>
              </v-subheader>
              <users-list :users="customers" />
            </template>
            <template v-if="viewers.length">
              <v-subheader>
                {{ $t("Viewers") }}
                <v-chip small> {{ viewers.length }} </v-chip>
              </v-subheader>
              <users-list :users="viewers" />
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { OSSA_IDS, DEFAULT_TIMEZONE, BENEFICIARY_ROLE_LIST, USER_TYPE } from "@/constants.js";
import { mapGetters } from "vuex";
import { DATETIME_TIMEZONE } from "@/components/timezone-picker/timezone-data.js";
import { convertIsoDurationInDaysHoursMinutes } from "@/services/helpers/duration";
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import UsersList from "@/components/user/UsersList.vue";
import ExpiredLabel from "@/components/ExpiredLabel.vue";
import CopyEngagementsForm from "@/components/admin/contract/CopyEngagementsForm.vue";
import ContractAddUsers from "@/components/contract/ContractAddUsers.vue";
import SoftwareMixin from "@/mixins/SortContractSoftware";
import { routeNames } from "@/router";
import { LOCALE } from "@/i18n/constants";

export default {
  mixins: [SoftwareMixin],
  data() {
    return {
      contractId: null,
      contract: {
        timezone: null,
        contact: {
          commercial: "",
          technical: ""
        },
        mailingList: {
          external: [],
          internal: [],
          vulnerability: []
        },
        Engagements: {
          critical: {},
          sensible: {},
          standard: {}
        },
        externalLinks: []
      },
      formDialog: false,
      usersDialog: false,
      ContractAddUsersComponentKey: 0
    };
  },
  computed: {
    ...mapGetters({
      getUserLanguage: "configuration/getUserLanguage"
    }),
    software() {
      return this.sortSoftware(this.contract.software);
    },
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
        { text: this.$i18n.t("support priority"), value: "idOssa", sortable: false },
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
      return this.getUsersWithRole(BENEFICIARY_ROLE_LIST.CUSTOMER);
    },
    viewers() {
      return this.getUsersWithRole(BENEFICIARY_ROLE_LIST.VIEWER);
    },
    contractManagers() {
      return this.getUsersWithRole(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER);
    },
    operationalManagers() {
      return this.getUsersWithRole(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER);
    },
    remaining() {
      return this.contract.credits - this.consumedCredits;
    },

    consumedCredits() {
      const tickets = this.$store.getters["contract/getContractTickets"](this.$route.params.id);

      return tickets.length;
    },
    contractUsers() {
      const users = this.$store.getters["contract/getContractUsers"](this.contractId);

      return users;
    },

    isAdmin() {
      return this.$auth.check(USER_TYPE.ADMIN);
    },

    ContractListPath() {
      return this.$auth.check("admin") ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER)
        ? { name: routeNames.CLIENTCONTRACTS }
        : { name: routeNames.CONTRACTS };
    },

    userLanguage() {
      return this.getUserLanguage || LOCALE;
    },
    routeNames() {
      return routeNames;
    },
    totalUsers() {
      return (
        this.contractManagers.length + this.operationalManagers.length + this.customers.length + this.viewers.length
      );
    },
    softwareCounter() {
      return Object.values(this.software || {}).reduce(
        (acc, current) => {
          if (current.critical === "critical") acc.totalCritical += 1;
          else if (current.critical === "sensible") acc.totalSensible += 1;
          else acc.totalStandard += 1;
          return acc;
        },
        { totalCritical: 0, totalSensible: 0, totalStandard: 0 }
      );
    }
  },
  created() {
    this.contractId = this.$route.params.id || "";

    this.$http
      .getContractById(this.contractId)
      .then(({ data }) => (this.contract = data))
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch contract"),
          color: "error"
        });
      });

    this.$store.dispatch("contract/fetchContractTickets", this.contractId).catch(() => {
      this.$store.dispatch("ui/displaySnackbar", {
        message: this.$i18n.t("Failed to fetch contract tickets"),
        color: "error"
      });
    });

    this.$store.dispatch("contract/fetchContractUsers", this.contractId).catch(() => {
      this.$store.dispatch("ui/displaySnackbar", {
        message: this.$i18n.t("Failed to fetch contract tickets"),
        color: "error"
      });
    });
  },
  methods: {
    timezone() {
      const { name } = !this.contract.timezone
        ? DEFAULT_TIMEZONE
        : DATETIME_TIMEZONE.find(timezone => timezone.value === this.contract.timezone);
      return name;
    },
    getOssaByKey(key) {
      return OSSA_IDS.find(ossaId => ossaId.key == key);
    },
    edit() {
      return;
    },

    getUsersWithRole(role) {
      return (this.contractUsers || []).filter(contractUsers => contractUsers.role === role);
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

    cnsDurationDisplay(cnsType, isInBusinessHours = false) {
      const durationString = isInBusinessHours ? cnsType.businessHours : cnsType.nonBusinessHours;
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(durationString);

      return humanizeHoursDurationFilter({ days, hours }, isInBusinessHours);
    },
    closeFormModal() {
      this.formDialog = false;
    },
    editEngagment() {
      this.formDialog = true;
    },
    submit(contract) {
      this.$http
        .updateContract(this.contract._id, contract)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Updated"),
            color: "success"
          });
          this.getData();
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Failed to update the contract"),
            color: "error"
          });
        });
      this.formDialog = false;
    },
    getData() {
      this.$http
        .getContractById(this.contract._id)
        .then(({ data }) => {
          this.contract = data;
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("failed to fetch contract"),
            color: "error"
          });
        });
    },
    forceRerender() {
      this.ContractAddUsersComponentKey += 1;
    },
    canViewHumanResources() {
      return !this.$auth.check(BENEFICIARY_ROLE_LIST.CUSTOMER) && !this.$auth.check(BENEFICIARY_ROLE_LIST.VIEWER);
    }
  },
  components: {
    UsersList,
    ExpiredLabel,
    CopyEngagementsForm,
    ContractAddUsers
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
