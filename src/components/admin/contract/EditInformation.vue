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
          <v-flex xs3 class="required-label">{{ $t("Timezone") }}</v-flex>
          <v-flex xs8>
            <timezone-picker :timezone.sync="contract.timezone"></timezone-picker>
          </v-flex>
          <v-flex xs3>{{ $t("Internal mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.internal"></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("Client mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.external"></v-text-field>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Business hours") }}</v-flex>
          <v-flex xs8>
            <v-layout row wrap align-center align-content-center>
              <v-flex xs1 class="text-xs-right mr-4">{{ $t("From") }}</v-flex>
              <v-flex xs1>
                <v-text-field
                  v-model="contract.businessHours.start"
                  required
                  type="number"
                  class="required-label"
                  mask="##"
                  min="0"
                  max="23"
                  :rules="[hoursRules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>{{ $t("h") }}</v-flex>
              <v-flex xs1 class="text-xs-right mr-4">{{ $t("to") }}</v-flex>
              <v-flex xs1>
                <v-text-field
                  v-model="contract.businessHours.end"
                  required
                  type="number"
                  class="required-label"
                  mask="##"
                  min="0"
                  max="23"
                  :rules="[hoursRules.required]"
                ></v-text-field>
              </v-flex>
              <v-flex xs1>{{ $t("h") }}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            {{ $t("24h/24 7D/7 option") }}
          </v-flex>
          <v-flex xs8>
            <v-checkbox
              :label="$t('This option allows customers to create tickets in non-business hours subject to SLA')"
              v-model="contract.features.nonBusinessHours"
              :value="true"
            ></v-checkbox>
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
                  v-model="contract.startDate"
                  persistent-hint
                  prepend-icon="event"
                  @blur="contract.startDate = parseDate(contract.startDate)"
                  v-on="on"
                  :rules="[() => contract.startDate.length > 0 || $i18n.t('Required field')]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.startDate"
                no-title
                @input="startDateModel = false"
                :rules="[() => contract.startDate.length > 0 || $i18n.t('Required field')]"
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
                  v-model="contract.endDate"
                  persistent-hint
                  prepend-icon="event"
                  @blur="contract.endDate = parseDate(contract.endDate)"
                  v-on="on"
                  :rules="[() => contract.endDate.length > 0 || $i18n.t('Required field')]"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.endDate"
                no-title
                @input="endDateModel = false"
                :rules="[() => contract.endDate.length > 0 || $i18n.t('Required field')]"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <br />
          </v-flex>
          <v-flex xs3>{{ $t("Status") }}</v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.status">
              <v-btn :value="true" flat :class="{ success: contract.status }">{{ $t("Active") }}</v-btn>
              <v-btn :value="false" flat :class="{ error: !contract.status }">{{ $t("Inactive") }}</v-btn>
            </v-btn-toggle>
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
            <v-btn color="error" @click="openDialog = true" v-if="isNew">{{ $t("Delete") }}</v-btn>
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
            <v-btn color="error darken-1" flat @click="deleteContract">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import { routeNames } from "@/router";
import TimezonePicker from "@/components/timezone-picker/timezone.vue";
import ExternalLinks from "@/components/ExternalLinks.vue";

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
          external: []
        },
        startDate: "",
        endDate: "",
        businessHours: {
          start: "",
          end: ""
        },
        features: {
          nonBusinessHours: false
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
      clients: [],
      hoursRules: {
        required: value => !!value || this.$i18n.t("Required field")
      },
      credits: 0,
      externalLinks: []
    };
  },
  components: {
    TimezonePicker,
    ExternalLinks
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    },
    requiredUnfilled() {
      return (
        !this.contract.endDate.length ||
        !this.contract.startDate.length ||
        !Object.keys(this.contract.client).length ||
        !this.contract.name.length
      );
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.$http
        .getContractById(this.$route.params.id)
        .then(({ data }) => {
          this.contract = data;
          this.externalLinks = data.externalLinks;
          if (!data.hasOwnProperty("businessHours")) {
            this.contract = {
              businessHours: {
                businessHours: {
                  start: "",
                  end: ""
                }
              },
              ...data
            };
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }

    this.$http
      .listClients()
      .then(response => {
        this.clients = response.data.map(client => ({ name: client.name, clientId: client._id }));
      })
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: "cannot fetch clients",
          color: "error"
        });
      });
  },
  methods: {
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
    },
    addExternalLink(link = { name: "", url: "" }) {
      this.externalLinks.push(link);
    },

    removeExternalLink(index) {
      this.externalLinks.splice(index, 1);
    }
  }
};
</script>

<style lang="stylus"></style>
