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
          <span class="subheading">{{ $t("Linagora Teams") }}</span>
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
      <br>
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
        <v-flex xs4>
          <v-btn small flat class="pl-4 success--text" @click="createAccount = !createAccount">
            <v-icon class="success--text">add_circle</v-icon>
            {{ $t("Add") }}
          </v-btn>
        </v-flex>
        <v-flex xs4></v-flex>
        <v-flex xs4>
          <ul v-if="contract.humanResources && contract.humanResources.beneficiaries">
            <li
              v-for="selectedBeneficiary in contract.humanResources.beneficiaries"
              :key="selectedBeneficiary.id"
            >
              <v-layout row wrap>
                <v-flex xs6>{{ selectedBeneficiary.name }}</v-flex>
                <v-flex xs6>
                  <v-btn
                    flat
                    small
                    class="error--text mt-0"
                    @click="removePerson(selectedBeneficiary)"
                  >
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
      <br>
      <v-layout row wrap align-center>
        <v-flex xs1></v-flex>
        <v-flex xs8>
          <form v-if="createAccount" class="pt-4 px-4 mr-4 grey lighten-3">
            <h3 class="title mb-0">{{ $t("Create account") }}</h3>
            <v-layout row wrap align-center>
              <v-flex xs3>{{ $t("Client") }}</v-flex>
              <v-flex xs9>
                <v-select v-model="client" :items="[client]" flat disabled></v-select>
              </v-flex>
              <v-flex xs3>{{ $t("Contracts") }}</v-flex>
              <v-flex xs9>
                <v-select
                  v-model="account.contract"
                  :items="contracts"
                  item-text="name"
                  flat
                  @change="addContract"
                  return-object
                  single-line
                ></v-select>
              </v-flex>

              <v-flex xs3></v-flex>
              <v-flex xs9>
                <ul>
                  <li v-for="contract in account.contracts" :key="contract.id">
                    <v-layout row wrap>
                      <v-flex xs6>{{ contract.name }}</v-flex>
                      <v-flex xs6>
                        <v-btn
                          flat
                          small
                          class="error--text mt-0"
                          @click="removeContract(contract.id)"
                        >
                          <v-icon class="error--text">remove_circle</v-icon>
                          {{ $t("remove") }}
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </li>
                </ul>
              </v-flex>

              <v-flex xs3>{{ $t("type") }}</v-flex>
              <v-flex xs9>
                <v-radio-group v-model="account.type" row>
                  <v-radio :label="$t('Beneficiariy')" value="beneficiariy"></v-radio>
                  <v-radio :label="$t('Expert')" value="expert"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs3>{{ $t("Name") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.name.length > 0 || $i18n.t('Required field')]"
                  v-model="account.name"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("Title") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.title.length > 0 || $i18n.t('Required field')]"
                  v-model="account.title"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("Email") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.email.length > 0 || $i18n.t('Required field')]"
                  v-model="account.email"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("phone") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.phone.length > 0 || $i18n.t('Required field')]"
                  v-model="account.phone"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("Team") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.team.length > 0 || $i18n.t('Required field')]"
                  v-model="account.team"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("Identifier") }}</v-flex>
              <v-flex xs9>
                <v-text-field
                  :rules="[() => account.identifier.length > 0 || $i18n.t('Required field')]"
                  v-model="account.identifier"
                  flat
                ></v-text-field>
              </v-flex>
              <v-flex xs3>{{ $t("Role") }}</v-flex>
              <v-flex xs9>
                <v-radio-group
                  :rules="[() => account.role.length > 0 || $i18n.t('Required field')]"
                  v-model="account.role"
                  row
                >
                  <v-radio :label="$t('Customer')" value="customer"></v-radio>
                  <v-radio :label="$t('Viewer')" value="viewer"></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex xs3></v-flex>
              <v-flex xs8>
                <v-btn @click="addPerson(account)" class="success">{{ $t("Create account") }}</v-btn>
                {{ $t("or") }}
                <v-btn @click="clear" class="error">{{ $t("Cancel") }}</v-btn>
              </v-flex>
              <v-flex xs1></v-flex>
            </v-layout>
          </form>
        </v-flex>
      </v-layout>
      <br>
      <v-layout row wrap align-center>
        <v-flex xs4></v-flex>
        <v-flex xs3>
          <v-btn
            @click="validate"
            class="success"
            :disabled="createAccount"
          >{{ $t("Validate changes") }}</v-btn>
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
      createAccount: false,
      account: {
        contracts: []
      },
      accountContracts: [],
      contracts: [
        { id: 1, name: "OSSA" },
        { id: 2, name: "Support Toulouse" },
        { id: 3, name: "Core TEAM OBM" },
        { id: 4, name: "Plateformisation" },
        { id: 5, name: "Support LGS" },
        { id: 6, name: "Informatique Interne" },
        { id: 7, name: "LinShare" },
        { id: 8, name: "C3L" },
        { id: 9, name: "Intégration OBM" },
        { id: 10, name: "Web" },
        { id: 11, name: "Support GSO" },
        { id: 12, name: "Astreinte" }
      ],
      client: "DGT - Club de Paris",
      selectedTeam: "",
      selectedPerson: "",
      selectedContract: "",
      teams: [
        { id: 1, name: "OSSA" },
        { id: 2, name: "Support Toulouse" },
        { id: 3, name: "Core TEAM OBM" },
        { id: 4, name: "Plateformisation" },
        { id: 5, name: "Support LGS" },
        { id: 6, name: "Informatique Interne" },
        { id: 7, name: "LinShare" },
        { id: 8, name: "C3L" },
        { id: 9, name: "Intégration OBM" },
        { id: 10, name: "Web" },
        { id: 11, name: "Support GSO" },
        { id: 12, name: "Astreinte" }
      ],
      beneficiaries: [
        { id: 1, name: "Anouk Camélia" },
        { id: 2, name: "Rachel Aglaé" },
        { id: 3, name: "Honorine Gwenaëlle" },
        { id: 4, name: "Clair Micheline" },
        { id: 5, name: "René Louane" },
        { id: 6, name: "Noémie Naël" },
        { id: 7, name: "Thierry Gaétan" },
        { id: 8, name: "Killian Sybille" },
        { id: 9, name: "David Héloïse" },
        { id: 10, name: "Rose Daphné" },
        { id: 11, name: "Colombe Sandra" },
        { id: 12, name: "Cyril Hector" },
        { id: 13, name: "Clarisse Daniel" },
        { id: 14, name: "Cyprien René" },
        { id: 15, name: "Simon CLAVIER" }
      ]
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
      if (
        !this.contract.humanResources.teams.filter(item => item.id == team.id)
          .length
      ) {
        this.contract.humanResources.teams.push(Object.assign({}, team));
        this.selectedTeam = "";
      }
    },

    removeTeam(teamId) {
      this.contract.humanResources.teams = this.contract.humanResources.teams.filter(
        team => team.id != teamId
      );
    },

    addPerson(person) {
      if (
        !this.contract.humanResources.beneficiaries.filter(
          item => item.id == person.id
        ).length
      ) {
        this.contract.humanResources.beneficiaries.push(
          Object.assign({}, person)
        );
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
      if (
        !this.account.contracts.filter(item => item.id == contract.id).length
      ) {
        this.account.contracts.push(contract);
        this.selectedContract = "";
      }
    },

    removeContract(contractId) {
      this.account.contracts = this.account.contracts.filter(
        contract => contract.id != contractId
      );
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
