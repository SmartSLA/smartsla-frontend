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
              :items="clients"
              v-model="contract.client"
              item-text="name"
              :rules="[() => contract.client.length > 0 || $i18n.t('Required field')]"
            ></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Commercial contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="commercials" v-model="contract.contact.commercial"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("technical contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="techRefs" v-model="contract.contact.technical"></v-select>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Internal mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field
              v-model="contract.mailingList.internal"
              :rules="[() => contract.mailingList.internal.length > 0 || $i18n.t('Required field')]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("client mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field
              v-model="contract.mailingList.external"
              :rules="[() => contract.mailingList.external.length > 0 || $i18n.t('Required field')]"
            ></v-text-field>
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
          </v-flex>
          <v-flex xs3>{{ $t("Governed by") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.govern"></v-text-field>
          </v-flex>
          <v-flex xs3 class="pt-3">{{ $t("Requests shared among the beneficiaries") }}</v-flex>
          <v-flex xs8>
            <v-checkbox v-model="contract.sharedRequests" color="primary" hide-details></v-checkbox>
          </v-flex>
          <v-flex xs3>{{ $t("Domain") }}</v-flex>
          <v-flex xs8>
            <v-text-field></v-text-field>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <br />
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn :disabled="!valid" color="success" @click="validateForm">{{
              isNew ? $t("Validate the changes") : $t("Create")
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
import { error } from "util";
export default {
  name: "edit-contract-information",
  data() {
    return {
      openDialog: false,
      contract: {
        name: "",
        client: "",
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
        status: true,
        type: "",
        sharedRequests: true,
        govern: "",
        domain: "",
        humanResources: {},
        Engagements: {
          critical: {},
          sensible: {},
          standard: {}
        },
        software: []
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
      commercials: [
        "André VASSILIF",
        "Rosette Dorothée",
        "Denise Lucrèce",
        "Soraya Louisette",
        "Yassin BENHADDOU",
        "Pétronille Priscille"
      ],
      techRefs: [
        "Sacha Méline",
        "Gilberte Marcellette",
        "Jérome HERLEDAN",
        "Maximilienne Priscille",
        "Nicolas CHAUVET",
        "César Tristan"
      ]
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.$http
        .getContractById(this.$route.params.id)
        .then(response => {
          this.contract = response.data;
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
        this.clients = response.data;
      })
      .catch(error => {
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
      var contract = this.contract;
      if (contract.mailingList.external.length && !(contract.mailingList.external instanceof Array)) {
        contract.mailingList.external = contract.mailingList.external.split(",");
      }
      if (contract.mailingList.internal.length && !(contract.mailingList.internal instanceof Array)) {
        contract.mailingList.internal = contract.mailingList.internal.split(",");
      }
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
            }
          })
          .catch(error => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: error.response.data.error.details,
              color: "error"
            });
          });
      } else {
        this.$http
          .updateContract(contract._id, contract)
          .then(response => {
            this.$store.dispatch("ui/displaySnackbar", {
              message: this.$i18n.t("contract saved"),
              color: "success"
            });
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
        .then(response => {
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
  }
};
</script>

<style lang="stylus"></style>
