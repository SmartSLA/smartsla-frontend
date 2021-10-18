<template>
  <div>
    <v-card class="mt-4 px-4">
      <v-card-title primary-title class="pl-0">
        <div>
          <h3 class="title mb-0">{{ $t("Information") }}</h3>
        </div>
      </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout row wrap align-center>
          <v-flex xs3 class="required-label">{{ $t("Name") }}</v-flex>
          <v-flex xs8>
            <v-text-field
              v-model="contract.name"
              :rules="[() => contract.name.length > 0 || $i18n.t('Required field')]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Client") }}</v-flex>
          <v-flex xs8>
            <v-select
              v-model="contract.client"
              :items="clients"
              item-text="name"
              item-value="name"
              :rules="[() => Object.keys(contract.client).length > 0 || $i18n.t('Required field')]"
              return-object
            ></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Commercial contact") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.contact.commercial"></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("Technical contact") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.contact.technical"></v-text-field>
          </v-flex>
          <v-flex xs3>
            {{ $t("Vulnerability mailing list") }}
          </v-flex>
          <v-flex xs8>
            <email-input
              @mails:updated="updateVulnerabilityMailingList"
              @mails:removed="removeItemVulnerabilityMailingList"
              label="Vulnerability mailing list"
              :mails="contract.mailingList.vulnerability"
            ></email-input>
          </v-flex>
          <v-flex xs3>{{ $t("Internal mailing list") }}</v-flex>
          <v-flex xs8>
            <email-input
              @mails:updated="updateInternalMailingList"
              @mails:removed="removeItemInternalMailingList"
              label="Internal mailing list"
              :mails="contract.mailingList.internal"
            ></email-input>
          </v-flex>
          <v-flex xs3>{{ $t("External mailing list") }}</v-flex>
          <v-flex xs8>
            <email-input
              @mails:updated="updateExternalMailingList"
              @mails:removed="removeItemExternalMailingList"
              label="External mailing list"
              :mails="contract.mailingList.external"
            ></email-input>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Timezone") }}</v-flex>
          <v-flex xs8>
            <timezone-picker :timezone.sync="contract.timezone"></timezone-picker>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Business hours") }}</v-flex>
          <v-flex xs8>
            <v-layout row wrap align-center align-content-center>
              <v-flex xs1 class="text-xs-right mr-4">{{ $t("From") }}</v-flex>
              <v-flex xs1>
                <v-text-field
                  v-model.number="contract.businessHours.start"
                  required
                  class="required-label"
                  mask="##"
                  :rules="[hoursRules.required, hoursRules.inRange]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>{{ $t("h") }}</v-flex>
              <v-flex xs1 class="text-xs-right mr-4">{{ $t("to") }}</v-flex>
              <v-flex xs1>
                <v-text-field
                  v-model.number="contract.businessHours.end"
                  required
                  class="required-label"
                  mask="##"
                  :rules="[hoursRules.required, hoursRules.inRange]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>{{ $t("h") }}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Start") }}</v-flex>
          <v-flex xs8>
            <v-menu
              v-model="startDateModel"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="contractStartDate"
                  persistent-hint
                  prepend-icon="event"
                  @blur="contract.startDate = parseDate(contract.startDate)"
                  v-on="on"
                  :rules="[() => (contract.startDate && contract.startDate.length > 0) || $i18n.t('Required field')]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.startDate"
                no-title
                @input="startDateModel = false"
                :rules="[() => (contract.startDate && contract.startDate.length > 0) || $i18n.t('Required field')]"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("End") }}</v-flex>
          <v-flex xs8>
            <v-menu
              v-model="endDateModel"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="contractEndDate"
                  persistent-hint
                  prepend-icon="event"
                  @blur="contract.endDate = parseDate(contract.endDate)"
                  v-on="on"
                  :rules="[() => (contract.endDate && contract.endDate.length > 0) || $i18n.t('Required field')]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.endDate"
                no-title
                @input="endDateModel = false"
                :rules="[() => (contract.endDate && contract.endDate.length > 0) || $i18n.t('Required field')]"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3 mt-4>
            {{ $t("24h/24 7D/7 option") }}
          </v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.features.nonBusinessHours">
              <v-btn :value="true" flat :class="{ success: contract.features.nonBusinessHours }">{{
                $t("Active")
              }}</v-btn>
              <v-btn :value="false" flat :class="{ error: !contract.features.nonBusinessHours }">{{
                $t("Inactive")
              }}</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3></v-flex>
          <v-flex xs8 mt-2 grey--text text--darken-1>
            {{ $t("This option allows customers to create tickets in non-business hours subject to SLA") }}
          </v-flex>
          <v-flex xs3 mt-5>{{ $t("Status") }}</v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.status">
              <v-btn :value="true" flat :class="{ success: contract.status }">{{ $t("Active") }}</v-btn>
              <v-btn :value="false" flat :class="{ error: !contract.status }">{{ $t("Inactive") }}</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3 mt-4>{{ $t("LinInfoSec option") }}</v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.features.linInfoSec">
              <v-btn :value="true" flat :class="{ success: contract.features.linInfoSec }">{{ $t("Active") }}</v-btn>
              <v-btn :value="false" flat :class="{ error: !contract.features.linInfoSec }">{{ $t("Inactive") }}</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3></v-flex>
          <v-flex xs8 mt-2 grey--text text--darken-1>
            {{
              $t(
                // eslint-disable-next-line max-len
                "This option allows customers to be notified by an automatic creation of a ticket when a CVE hits a software in this contract."
              )
            }}
          </v-flex>
          <v-flex xs3>{{ $t("Type") }}</v-flex>
          <v-flex xs8>
            <v-radio-group v-model="contract.type" row>
              <v-radio :label="$i18n.t('Credit')" value="credit"></v-radio>
              <v-radio :label="$i18n.t('Unlimited')" value="unlimited"></v-radio>
            </v-radio-group>
            <v-flex xs3>
              <v-text-field v-if="contract.type === 'credit'" v-model.number="contract.credits" type="number" />
            </v-flex>
          </v-flex>
          <v-flex xs3>{{ $t("Description") }}</v-flex>
          <v-flex xs8>
            <v-textarea v-model="contract.description"></v-textarea>
          </v-flex>
          <v-flex xs3>{{ $t("External links") }}</v-flex>
          <v-flex xs8>
            <external-links :externalLinks="externalLinks" @remove-link="removeExternalLink">
              <div>
                {{ $t("Add an external link") }}
                <v-btn @click="addExternalLink()" flat icon color="primary">
                  <v-icon>add_circle</v-icon>
                </v-btn>
              </div>
            </external-links>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <br />
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn :disabled="!valid || requiredUnfilled" color="success" @click="validateForm">{{
              isNew ? $t("Validate changes") : $t("Create")
            }}</v-btn>
            <v-btn color="error" @click="openDialog = true" v-if="isNew" :disabled="cannotBeDeleted">{{
              $t("Delete")
            }}</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-dialog v-model="openDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="body-2">{{ $t("You are about to delete:") }}</v-card-title>
          <v-card-text>
            <span class="pl-3">{{ $t("Contract") }} : {{ contract.name }}</span>
            <br />
            <br />
            <span class="body-2">{{ $t("Are you sure?") }}</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey darken-1" flat @click="openDialog = false">close</v-btn>
            <v-btn color="error darken-1" flat :disabled="cannotBeDeleted" @click="deleteContract">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { routeNames } from "@/router";
import { mapGetters } from "vuex";
import TimezonePicker from "@/components/timezone-picker/timezone.vue";
import ExternalLinks from "@/components/ExternalLinks.vue";
import { LOCALE } from "@/i18n/constants";
import EmailInput from "@/components/EmailInput.vue";

export default {
  name: "edit-contract-information",
  data() {
    return {
      openDialog: false,
      contract: {
        name: "",
        client: {
          name: "",
          clientId: ""
        },
        contact: {
          commercial: "",
          technical: ""
        },
        mailingList: {
          internal: [],
          external: [],
          vulnerability: []
        },
        startDate: "",
        endDate: "",
        businessHours: {
          start: "",
          end: ""
        },
        features: {
          nonBusinessHours: false,
          linInfoSec: false
        },
        status: true,
        type: "",
        description: "",
        humanResources: {},
        Engagements: {
          critical: {},
          sensible: {},
          standard: {}
        },
        software: [],
        timezone: null
      },
      startDateMenu: "",
      endDateMenu: "",
      startDate: "",
      endDate: "",
      contracts: {},
      mailingList: {},
      startDateModel: false,
      endDateModel: false,
      valid: true,
      hoursRules: {
        required: value => !!value || this.$i18n.t("Required field"),
        inRange: value => (value >= 0 && value <= 23) || this.$i18n.t("invalid range")
      },
      credits: 0,
      externalLinks: []
    };
  },
  components: {
    TimezonePicker,
    ExternalLinks,
    EmailInput
  },
  computed: {
    ...mapGetters({
      getUserLanguage: "configuration/getUserLanguage"
    }),
    isNew() {
      return this.$route.params.id;
    },
    requiredUnfilled() {
      return (
        !(this.contract.endDate && this.contract.endDate.length) ||
        !(this.contract.startDate && this.contract.startDate.length) ||
        !Object.keys(this.contract.client || {}).length ||
        !(this.contract.name && this.contract.name.length)
      );
    },

    clients() {
      const clients = this.$store.getters["client/getClients"];

      return clients.map(client => ({ name: client.name, clientId: client._id }));
    },
    contractStartDate() {
      return this.formatDate(this.contract.startDate);
    },
    contractEndDate() {
      return this.formatDate(this.contract.endDate);
    },

    cannotBeDeleted() {
      if (this.$route.params.id) {
        return !!this.$store.getters["contract/getContractTickets"](this.$route.params.id).length;
      }

      return true;
    },
    userLanguage() {
      return this.getUserLanguage || LOCALE;
    },

    internalMailingList() {
      return this.contract.mailingList.internal;
    }
  },
  mounted() {
    if (this.$route.params.id) {
      const { id } = this.$route.params;
      this.$http
        .getContractById(id)
        .then(({ data }) => {
          this.contract = data;
          this.externalLinks = data.externalLinks;
          if (!data.hasOwnProperty("businessHours")) {
            this.contract = {
              ...data,
              businessHours: {
                businessHours: {
                  start: "",
                  end: ""
                }
              }
            };
          }
          if (!data.features.hasOwnProperty("linInfoSec")) {
            this.contract = {
              ...data,
              features: {
                ...data.features,
                linInfoSec: false
              }
            };
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });

      this.$store.dispatch("contract/fetchContractTickets", id).catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("Failed to fetch contract tickets"),
          color: "error"
        });
      });
    }
    this.$store.dispatch("client/fetchClients");
  },
  methods: {
    updateInternalMailingList(mailingList) {
      this.contract.mailingList.internal = mailingList;
    },

    removeItemInternalMailingList(itemIndex) {
      const items = this.contract.mailingList.internal;

      this.contract.mailingList.internal = items.slice(0, itemIndex).concat(items.slice(itemIndex + 1, items.length));
    },

    updateExternalMailingList(mailingList) {
      this.contract.mailingList.external = mailingList;
    },

    removeItemExternalMailingList(itemIndex) {
      const items = this.contract.mailingList.external;

      this.contract.mailingList.external = items.slice(0, itemIndex).concat(items.slice(itemIndex + 1, items.length));
    },

    updateVulnerabilityMailingList(mailingList) {
      this.contract.mailingList.vulnerability = mailingList;
    },

    removeItemVulnerabilityMailingList(itemIndex) {
      const items = this.contract.mailingList.vulnerability;

      this.contract.mailingList.vulnerability = items
        .slice(0, itemIndex)
        .concat(items.slice(itemIndex + 1, items.length));
    },

    parseDate(date) {
      if (!date) return null;

      return this.moment(date).format("YYYY-MM-DD");
    },

    validate() {
      let contract = this.contract;
      if (contract.mailingList.external.length && !(contract.mailingList.external instanceof Array)) {
        contract.mailingList.external = contract.mailingList.external.split(",");
      }
      if (contract.mailingList.internal.length && !(contract.mailingList.internal instanceof Array)) {
        contract.mailingList.internal = contract.mailingList.internal.split(",");
      }
      contract.externalLinks = this.externalLinks;

      if (!this.isNew) {
        this.$http
          .createContract(contract)
          .then(response => {
            if (response.data && response.status === 201) {
              this.$store.dispatch("ui/displaySnackbar", {
                message: this.$i18n.t("contract saved"),
                color: "success"
              });
              this.contract = {};
              this.$router.push({ name: routeNames.CONTRACTS });
            }
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
          });
      } else {
        const { name: client, clientId } = contract.client;
        contract = {
          ...contract,
          client,
          clientId
        };
        this.$http
          .updateContract(contract._id, contract)
          .then(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("contract saved"),
              color: "success"
            });

            this.$router.push({ name: routeNames.CONTRACT, params: { id: this.contract._id } });
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
          });
      }
    },

    validateForm() {
      if (this.$refs.form.validate()) {
        this.validate();
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },

    deleteContract() {
      if (!this.cannotBeDeleted) {
        this.$http
          .deleteContract(this.contract._id)
          .then(() => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("contract deleted"),
              color: "success"
            });
            this.$router.push({ name: routeNames.CONTRACTS });
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
          });
      }
    },
    addExternalLink(link = { name: "", url: "" }) {
      this.externalLinks.push(link);
    },

    removeExternalLink(index) {
      this.externalLinks.splice(index, 1);
    },
    formatDate(date) {
      return this.$options.filters.formatDateFilter(date, null, this.getUserLanguage);
    }
  }
};
</script>

<style lang="stylus"></style>
