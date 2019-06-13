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
          <v-flex xs3>{{ $t("Name") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.name"></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("Client") }}</v-flex>
          <v-flex xs8>
            <v-select :items="clients" :value="contract.client"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Commercial contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="commercials" :value="contract.contact.commercial"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("technical contact") }}</v-flex>
          <v-flex xs8>
            <v-select :items="techRefs" :value="contract.contact.technical"></v-select>
          </v-flex>
          <v-flex xs3>{{ $t("Internal mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.internal" required></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("client mailing list") }}</v-flex>
          <v-flex xs8>
            <v-text-field v-model="contract.mailingList.external" required></v-text-field>
          </v-flex>
          <v-flex xs3>{{ $t("Start") }}</v-flex>
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
              <v-date-picker v-model="contract.startDate" no-title @input="startDateModel = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3>{{ $t("End") }}</v-flex>
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
              <v-date-picker v-model="contract.endDate" no-title @input="endDateModel = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <br />
          </v-flex>
          <v-flex xs3>{{ $t("Status") }}</v-flex>
          <v-flex xs8>
            <v-btn-toggle v-model="contract.contractStatus">
              <v-btn value="active" flat :class="{ success: contract.contractStatus == 'active' }">
                {{ $t("Active") }}
              </v-btn>
              <v-btn value="inactive" flat :class="{ error: contract.contractStatus == 'inactive' }">
                {{ $t("Inactive") }}
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3>{{ $t("Schedule") }}</v-flex>
          <v-flex xs1>
            <v-text-field mask="##" v-model="contract.schedule.start"></v-text-field>
          </v-flex>
          <v-flex xs1>h</v-flex>
          <v-flex xs1>-</v-flex>
          <v-flex xs1>
            <v-text-field mask="##" v-model="contract.schedule.end"></v-text-field>
          </v-flex>
          <v-flex xs1>h</v-flex>
          <v-flex xs3></v-flex>
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
            <br />
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn :disabled="!valid" color="success" @click="validate">{{ $t("Validate the changes") }}</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "edit-contract-information",
  data() {
    return {
      contract: {
        name: "contract 1",
        client: "DGT - CLUB de paris",
        contact: {
          commercial: "André VASSILIF",
          technical: "Jérome HERLEDAN"
        },
        mailingList: {
          internal: ["iabouljamal@linagora.com", "hgoguelin@linagora.com"],
          external: [
            "fchaillou@humanite.fr",
            "souheila.boulkhodja@humanite.fr",
            "webmaster@humanite.fr",
            "info@humanite.fr"
          ]
        },
        startDate: "2019-03-26",
        endDate: "2019-03-26",
        contractStatus: "active",
        schedule: {
          start: "9",
          end: "18"
        },
        type: "unlimited",
        sharedRequests: true,
        govern: "forfait illimité",
        domain: ""
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
      clients: ["DGT - CLUB de paris", "linagora", "GDT"],
      commercials: ["André VASSILIF", "Rosette Dorothée", "Denise Lucrèce", "Soraya Louisette", "Pétronille Priscille"],
      techRefs: ["Sacha Méline", "Gilberte Marcellette", "Jérome HERLEDAN", "Maximilienne Priscille", "César Tristan"]
    };
  },
  computed: {
    isNew() {
      return this.$route.params.id;
    }
  },
  mounted() {
    if (!this.$route.params.id) {
      this.contract = {};
    }
  },
  methods: {
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    validate() {
      this.$http
        .createContract(this.contract)
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
