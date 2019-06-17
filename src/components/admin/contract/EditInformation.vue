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
            <v-text-field v-model="contract.name" :rules="['required']" required></v-text-field>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Client") }}</v-flex>
          <v-flex xs8>
            <v-select :items="clients" v-model="contract.client" item-text="name" :rules="['required']" required></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Commercial contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="commercials" v-model="contract.contact.commercial"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("technical contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="techRefs" v-model="contract.contact.technical"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Internal mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.internal" required></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("client mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.external" required></v-text-field>
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
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.startDate"
                no-title
                @input="startDateModel = false"
                :rules="['required']"
                required
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
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contract.endDate"
                no-title
                @input="endDateModel = false"
                :rules="['required']"
                required
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <br>
          </v-flex>
          <v-flex xs3>{{ $t("Status") }}</v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.contractStatus">
              <v-btn
                value="active"
                flat
                :class="{ success: contract.contractStatus == 'active' }"
              >{{ $t("Active") }}</v-btn>
              <v-btn
                value="inactive"
                flat
                :class="{ error: contract.contractStatus == 'inactive' }"
              >{{ $t("Inactive") }}</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3>{{ $t("Type") }}</v-flex>
          <v-flex xs8>
            <v-radio-group v-model="contract.type" row>
              <v-radio :label="$t('Credit')" value="credit"></v-radio>
              <v-radio :label="$t('Unlimited')" value="unlimited"></v-radio>
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
            <br>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn
              :disabled="!valid"
              color="success"
              @click="validate"
            >{{ isNew ? $t("Validate the changes") : $t("Create") }}</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { error } from "util";
export default {
  name: "edit-contract-information",
  data() {
    return {
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
        contractStatus: "active",
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
      valid: false,
      clients: [],
      commercials: [
        "André VASSILIF",
        "Rosette Dorothée",
        "Denise Lucrèce",
        "Soraya Louisette",
        "Pétronille Priscille"
      ],
      techRefs: [
        "Sacha Méline",
        "Gilberte Marcellette",
        "Jérome HERLEDAN",
        "Maximilienne Priscille",
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
      if (contract.mailingList.external.length) {
        contract.mailingList.external = contract.mailingList.external.split(",");
      }
      if (contract.mailingList.internal.length) {
        contract.mailingList.internal = contract.mailingList.internal.split(",");
      }
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
    }
  }
};
</script>

<style lang="stylus"></style>
