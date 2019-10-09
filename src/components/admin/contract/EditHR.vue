<template>
  <div>
    <v-card class="mt-4 px-4">
      <v-card-title primary-title class="pl-0">
        <div>
          <h3 class="title mb-0">{{ $t("Human resouces") }}</h3>
        </div>
      </v-card-title>
      <v-layout row wrap align-center>
        <v-flex xs4>
          <span class="subheading">{{ $t("Teams") }}</span>
        </v-flex>
        <v-flex xs4>
          <v-select
            v-model="selectedTeam"
            :items="teams"
            item-text="name"
            item-value="name"
            persistent-hint
            return-object
            @change="addTeam"
            single-line
          ></v-select>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4>
          <ul v-if="contract.humanResources && contract.humanResources.teams">
            <li v-for="selectedTeam in contract.humanResources.teams" :key="selectedTeam.id">
              <v-layout row wrap>
                <v-flex xs6>{{ selectedTeam.name }}</v-flex>
                <v-flex xs6>
                  <v-btn flat small class="error--text mt-0" @click="removeTeam(selectedTeam.id)">
                    <v-icon class="error--text">remove_circle</v-icon>
                    {{ $t("remove") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </li>
          </ul>
        </v-flex>
        <v-flex xs4></v-flex>
      </v-layout>
      <br />
      <v-divider></v-divider>
      <v-layout row wrap align-center>
        <v-flex xs4>
          <span class="subheading">{{ $t("Beneficiaries") }}</span>
        </v-flex>
        <v-flex xs4>
          <v-select
            v-model="selectedPerson"
            :items="beneficiaries"
            item-text="name"
            item-value="name"
            persistent-hint
            @change="addPerson"
            return-object
            single-line
          ></v-select>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4>
          <ul v-if="contract.humanResources && contract.humanResources.beneficiaries">
            <li v-for="selectedBeneficiary in contract.humanResources.beneficiaries" :key="selectedBeneficiary.id">
              <v-layout row wrap>
                <v-flex xs6>{{ selectedBeneficiary.name }}</v-flex>
                <v-flex xs6>
                  <v-btn flat small class="error--text mt-0" @click="removePerson(selectedBeneficiary)">
                    <v-icon class="error--text">remove_circle</v-icon>
                    {{ $t("remove") }}
                  </v-btn>
                </v-flex>
              </v-layout>
            </li>
          </ul>
        </v-flex>
        <v-flex xs4></v-flex>
      </v-layout>
      <br />
      <v-layout row wrap align-center>
        <v-flex xs4></v-flex>
        <v-flex xs3>
          <v-btn @click="validate" class="success">{{ $t("Validate changes") }}</v-btn>
        </v-flex>
        <v-flex xs3></v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "edit-contract-hr",
  data() {
    return {
      contract: {},
      account: {
        contracts: []
      },
      accountContracts: [],
      contracts: [],
      selectedTeam: "",
      selectedPerson: "",
      selectedContract: "",
      teams: [],
      beneficiaries: []
    };
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
  },
  methods: {
    addTeam(team) {
      if (!this.contract.humanResources.teams.filter(item => item.id == team.id).length) {
        this.contract.humanResources.teams.push(Object.assign({}, team));
        this.selectedTeam = "";
      }
    },

    removeTeam(teamId) {
      this.contract.humanResources.teams = this.contract.humanResources.teams.filter(team => team.id != teamId);
    },

    addPerson(person) {
      if (!this.contract.humanResources.beneficiaries.filter(item => item.id == person.id).length) {
        this.contract.humanResources.beneficiaries.push(Object.assign({}, person));
        this.selectedPerson = "";
      }

      this.createAccount = false;
    },

    removePerson(selectedPerson) {
      this.contract.humanResources.beneficiaries = this.contract.humanResources.beneficiaries.filter(
        person => JSON.stringify(selectedPerson) != JSON.stringify(person)
      );
    },

    addContract(contract) {
      if (!this.account.contracts.filter(item => item.id == contract.id).length) {
        this.account.contracts.push(contract);
        this.selectedContract = "";
      }
    },

    removeContract(contractId) {
      this.account.contracts = this.account.contracts.filter(contract => contract.id != contractId);
    },

    validate() {
      this.$http
        .updateContract(this.contract._id, this.contract)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("updated"),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    clear() {
      this.account = {
        contracts: []
      };
    }
  }
};
</script>

<style lang="stylus"></style>
