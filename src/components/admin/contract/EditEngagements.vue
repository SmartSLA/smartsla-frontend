<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <div>
        <h3 class="title mb-0">{{ $t("Contractual commitments") }}</h3>
      </div>
    </v-card-title>
    <v-data-table :items="contract.contractualCommitments" :headers="contractualCommitmentsHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-left">{{ $t(props.item.request) }}</td>
        <td class="text-xs-left text-capitalize">{{ $t(props.item.severity) }}</td>
        <td class="text-xs-left text-capitalize">{{ $t(props.item.idOssa) }}</td>
        <td class="text-xs-center">{{ $t(props.item.bypassed) }}</td>
        <td class="text-xs-center">{{ $t(props.item.fix) }}</td>
        <td class="text-xs-center">{{ props.item.description }}</td>
        <td class="text-xs-center">
          <v-btn color="error" flat small @click="removeCommitment(props.item)">
            <v-icon>remove_circle</v-icon>
            {{ $t("remove") }}
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-btn small flat class="pl-4 success--text" @click="addCommitment = !addCommitment">
      <v-icon class="success--text">add_circle</v-icon>
      {{ $t("Add") }}
    </v-btn>
    <v-layout row wrap align-center>
      <v-flex xs1></v-flex>
      <v-flex xs8>
        <form v-if="addCommitment" class="pt-4 px-4 mr-4 grey lighten-3">
          <h3 class="title mb-0">{{ $t("Add commitment") }}</h3>
          <v-layout row wrap align-center>
            <v-flex xs3>{{ $t("Request type") }}</v-flex>
            <v-flex xs4>
              <v-select v-model="newCommitment.request" :items="requestTypes" flat single-line></v-select>
            </v-flex>
            <v-flex xs1 pl1>
              <span class="pl-1">{{ $t("or add") }}</span>
            </v-flex>
            <v-flex xs4>
              <v-text-field v-model="newRequest" requried></v-text-field>
            </v-flex>
            <v-flex xs3>{{ $t("Severity") }}</v-flex>
            <v-flex xs4>
              <v-select v-model="newCommitment.severity" :items="severityTypes" flat single-line></v-select>
            </v-flex>
            <v-flex xs1 pl1>
              <span class="pl-1">{{ $t("or add") }}</span>
            </v-flex>
            <v-flex xs4>
              <v-text-field v-model="newSeverity" requried></v-text-field>
            </v-flex>
            <v-flex xs3>{{ $t("Ossa identifier") }}</v-flex>
            <v-flex xs4>
              <v-select v-model="newCommitment.idOssa" :items="ossaIds" flat single-line></v-select>
            </v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs3>{{ $t("Bypassed") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.bypassed.days" mask="###"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("D") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.bypassed.hours" mask="##"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("H") }}</v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs3>{{ $t("Fix") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.fix.days" mask="###"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("D") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.fix.hours" mask="##"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("H") }}</v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs3>{{ $t("Description") }}</v-flex>
            <v-flex xs9>
              <v-textarea solo v-model="newCommitment.description"></v-textarea>
            </v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs9>
              <v-btn @click="appendCommitment" class="success">{{ $t("Add commitment") }}</v-btn>
              {{ $t("or") }}
              <v-btn @click="addCommitment = !addCommitment" class="error">{{ $t("Cancel") }}</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
    <br />
    <v-layout row wrap align-center>
      <v-flex xs4></v-flex>
      <v-flex xs3>
        <v-btn class="success" :disabled="addCommitment">{{ $t("Validate changes") }}</v-btn>
      </v-flex>
      <v-flex xs3></v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "contract-edit-engagements",
  data() {
    return {
      newRequest: "",
      newSeverity: "",
      newCommitment: {
        request: "",
        severity: "",
        idOssa: "",
        bypassed: {
          days: "",
          hours: ""
        },
        fix: {
          days: "",
          hours: ""
        },
        description: ""
      },
      addCommitment: false,
      contract: {},
      requestTypes: ["Information", "Anomalie logiciel", "type c"],
      severityTypes: ["Minor", "Major", "blocking", "None"],
      ossaIds: ["blocking", "non-blocking", "inf request"]
    };
  },
  methods: {
    removeCommitment(commitment) {
      this.contract.contractualCommitments = this.contract.contractualCommitments.filter(
        item => JSON.stringify(item) != JSON.stringify(commitment)
      );
    },
    appendCommitment() {
      var newCommitment = Object.assign({}, this.newCommitment);
      if (this.newRequest.length) {
        newCommitment.request = this.newRequest;
      }

      if (this.newSeverity.length) {
        newCommitment.severity = this.newSeverity;
      }

      newCommitment.bypassed = `${this.newCommitment.bypassed.days} ${this.$i18n.t("D")} ${
        this.newCommitment.bypassed.hours
      } ${this.$i18n.t("H")}`;
      newCommitment.fix = `${this.newCommitment.fix.days} ${this.$i18n.t("D")} ${
        this.newCommitment.fix.hours
      } ${this.$i18n.t("H")}`;

      if (
        !this.contract.contractualCommitments.filter(
          commitment => JSON.stringify(commitment) === JSON.stringify(newCommitment)
        ).length
      ) {
        this.contract.contractualCommitments.push(newCommitment);
      }
    }
  },
  created() {
    this.contract = require("@/assets/data/contract.json");
  },
  computed: {
    contractualCommitmentsHeaders() {
      return [
        { text: this.$i18n.t("Request"), value: "request" },
        { text: this.$i18n.t("Severity"), value: "severity" },
        { text: this.$i18n.t("Id OSSA"), value: "idOssa" },
        { text: this.$i18n.t("Bypassed"), value: "bypassed" },
        { text: this.$i18n.t("Fix"), value: "fix" },
        {
          text: this.$i18n.t("Description"),
          value: "description"
        },
        { text: "", value: "delete" }
      ];
    }
  }
};
</script>

<style lang="stylus" scoped></style>
