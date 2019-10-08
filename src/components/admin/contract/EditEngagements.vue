<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <div>
        <h3 class="title mb-0">
          {{ $t("Contractual commitments") }}
          <v-chip :color="critColor(engagementType)" :text-color="critTextColor(engagementType)" label>{{
            $t(engagementType)
          }}</v-chip>
        </h3>
      </div>
    </v-card-title>
    <v-layout row wrap align-center>
      <v-flex xs2>{{ $t("Treatment time range") }}</v-flex>
      <v-flex xs1>
        <v-text-field v-model="engagementList.schedule.start" mask="###"></v-text-field>
      </v-flex>
      <v-flex xs1>{{ $t("H") }}</v-flex>
      <v-flex xs1>
        <v-text-field v-model="engagementList.schedule.end" mask="##"></v-text-field>
      </v-flex>
      <v-flex xs1>{{ $t("H") }}</v-flex>
      <v-flex xs1>{{ $t("or") }}</v-flex>
      <v-flex xs3>
        <v-checkbox v-model="allweek" color="primary" :value="true" :label="$i18n.t('7d/7d')" hide-details></v-checkbox>
      </v-flex>
    </v-layout>
    <v-data-table :items="engagementList.engagements" :headers="contractualCommitmentsHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-left">{{ $t(props.item.request) }}</td>
        <td class="text-xs-left text-capitalize">{{ $t(props.item.severity) }}</td>
        <td class="text-xs-left text-capitalize">{{ $t(props.item.idOssa) }}</td>
        <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.supported)) }}</td>
        <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.bypassed)) }}</td>
        <td class="text-xs-center">{{ $t("{days}WD {hours}WH", parseDuration(props.item.resolved)) }}</td>
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
      <v-flex xs12>
        <form v-if="addCommitment" class="pt-4 px-4 mr-4 grey lighten-3">
          <h3 class="title mb-0">{{ $t("Add commitment") }}</h3>
          <v-layout row wrap align-center>
            <v-flex xs3>{{ $t("Request type") }}</v-flex>
            <v-flex xs4>
              <v-select
              v-model="newCommitment.request"
              :items="requestTypes"
              item-text="value"
              item-value="key"
              flat
              single-line
              >
              </v-select>
            </v-flex>
            <v-flex xs1 pl-4 v-if="newCommitment.request === 'Other'">
              <span class="pl-1">{{ $t("or add") }}</span>
            </v-flex>
            <v-flex xs1 pl1 v-else></v-flex>
            <v-flex xs4 v-if="newCommitment.request === 'Other'">
              <v-text-field v-model="newRequest" requried></v-text-field>
            </v-flex>
            <v-flex xs4 v-else></v-flex>
            <v-flex xs3>{{ $t("Severity") }}</v-flex>
            <v-flex xs4>
              <v-select
                v-model="newCommitment.severity"
                :items="severityTypes"
                item-text="value"
                item-value="key"
                flat
                single-line
              >
              </v-select>
            </v-flex>
            <v-flex xs1 pl1 v-if="newCommitment.severity == 'other'">
              <span class="pl-1">{{ $t("or add") }}</span>
            </v-flex>
            <v-flex xs1 pl1 v-else></v-flex>
            <v-flex xs4 v-if="newCommitment.severity == 'other'">
              <v-text-field v-model="newSeverity" requried></v-text-field>
            </v-flex>
            <v-flex xs4 v-else></v-flex>
            <v-flex xs3>{{ $t("Ossa identifier") }}</v-flex>
            <v-flex xs4>
              <v-select 
                v-model="newCommitment.idOssa"
                :items="ossaIds"
                item-text="value"
                item-value="key"
                flat
                single-line
              ></v-select>
            </v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs3>{{ $t("Supported") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.supported.days" mask="###"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("D") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.supported.hours" mask="##"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("H") }}</v-flex>
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
            <v-flex xs3>{{ $t("Resolved") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.resolved.days" mask="###"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("D") }}</v-flex>
            <v-flex xs1>
              <v-text-field v-model="newCommitment.resolved.hours" mask="##"></v-text-field>
            </v-flex>
            <v-flex xs1>{{ $t("H") }}</v-flex>
            <v-flex xs5></v-flex>
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
        <v-btn class="success" :disabled="addCommitment" @click="validate">{{ $t("Validate changes") }}</v-btn>
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
      allweek: false,
      engagementList: {
        schedule: {},
        engagements: []
      },
      engagementListObject: {
        schedule: {},
        engagements: []
      },
      newCommitment: {
        supported: {},
        request: "",
        severity: "",
        idOssa: "",
        bypassed: {
          days: "",
          hours: ""
        },
        resolved: {
          days: "",
          hours: ""
        },
        description: ""
      },
      addCommitment: false,
      contract: {},
      requestTypes: [
        {
          key: "Information",
          value: this.$i18n.t("Information")
        },
        {
          key: "Anomaly",
          value: this.$i18n.t("Software anomaly")
        },
        {
          key: "Other",
          value: this.$i18n.t("Other")
        }
      ],
      severityTypes: [
        {
          key: 'Minor',
          value: this.$i18n.t("Minor")
        },
        {
          key: 'Major',
          value: this.$i18n.t("Major")
        },
        {
          key: 'Blocking',
          value: this.$i18n.t("Blocking")
        },
        {
          key: 'None',
          value: this.$i18n.t("None")
        }
      ],
      ossaIds: [
        {
          key: "Blocking",
          value: this.$i18n.t("Blocking")
        },
        {
          key: "Non-blocking",
          value: this.$i18n.t("Non-blocking")
        },
        {
          key: "Information",
          value: this.$i18n.t("Information")
        }
      ]
    };
  },
  methods: {
    removeCommitment(commitment) {
      this.engagementList.engagements = this.engagementList.engagements.filter(
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

      newCommitment.bypassed = this.getDuration(this.newCommitment.bypassed);
      newCommitment.resolved = this.getDuration(this.newCommitment.resolved);
      newCommitment.supported = this.getDuration(this.newCommitment.supported);

      if (
        !this.engagementList.engagements.filter(
          commitment => JSON.stringify(commitment) === JSON.stringify(newCommitment)
        ).length
      ) {
        this.engagementList.engagements.push(newCommitment);
        this.addCommitment = false;
      }
    },
    critColor(critLevel) {
      switch (critLevel) {
        case "critical":
          return "#f44336";
        case "sensible":
          return "#f4b336";
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

    getDuration(schedule) {
      const duration = this.moment.duration({
        hours: schedule.hours,
        days: schedule.days
      });

      return duration.toISOString();
    },

    parseDuration(duration) {
      const parsedDuration = this.moment.duration(duration);

      return {
        days: parsedDuration.days(),
        hours: parsedDuration.hours()
      };
    },

    validate() {
      if (this.allweek) {
        this.engagementList.schedule.start = "7d/7d";
        this.engagementList.schedule.end = "-";
      }
      switch (this.$route.params.type) {
        case "critical":
          this.contract.Engagements.critical = this.engagementList;
          break;
        case "sensible":
          this.contract.Engagements.sensible = this.engagementList;
          break;
        case "standard":
          this.contract.Engagements.standard = this.engagementList;
          break;

        default:
          break;
      }
      this.$http
        .updateContract(this.contract._id, this.contract)
        .then(() => {
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
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.$http
        .getContractById(this.$route.params.id)
        .then(response => {
          this.contract = response.data;
          switch (this.$route.params.type) {
            case "critical":
              this.engagementList = this.contract.Engagements.critical || this.engagementListObject;
              break;
            case "sensible":
              this.engagementList = this.contract.Engagements.sensible || this.engagementListObject;
              break;
            case "standard":
              this.engagementList = this.contract.Engagements.standard || this.engagementListObject;
              break;

            default:
              break;
          }
          if (!this.engagementList.schedule) {
            this.engagementList.schedule = {};
          } else {
            if (this.engagementList.schedule.end == "-") {
              this.engagementList.schedule = {};
              this.allweek = true;
            }
          }
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }
  },
  computed: {
    engagementType() {
      return this.$route.params.type;
    },
    currentEngagement() {
      return this.engagementList;
    },
    contractualCommitmentsHeaders() {
      return [
        { text: this.$i18n.t("Request"), value: "request" },
        { text: this.$i18n.t("Severity"), value: "severity" },
        { text: this.$i18n.t("Id OSSA"), value: "idOssa" },
        {
          text: this.$i18n.t("Supported"),
          value: "supported"
        },
        { text: this.$i18n.t("Bypassed"), value: "bypassed" },
        { text: this.$i18n.t("Resolved"), value: "resolved" },
        { text: "", value: "delete" }
      ];
    }
  }
};
</script>

<style lang="stylus" scoped></style>
