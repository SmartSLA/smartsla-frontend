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
    <v-data-table :items="engagementList.engagements" :headers="contractualCommitmentsHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-left">{{ $t(props.item.request) }}</td>
        <td class="text-xs-left text-capitalize">{{ $t(props.item.severity) }}</td>
        <td class="text-xs-left text-capitalize">
          <span>
            <v-avatar :color="getOssaByKey(props.item.idOssa).color" size="25">
              <span class="white--text">{{ getOssaByKey(props.item.idOssa).id }}</span>
            </v-avatar>
            <span class="pl-2"> {{ $t(getOssaByKey(props.item.idOssa).key) }} </span>
          </span>
        </td>
        <td class="text-xs-center">
          <span>
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.supported && props.item.supported.businessHours) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
             <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.supported && props.item.supported.nonBusinessHours, true) }}
          </span>
        </td>
        <td class="text-xs-center">
          <span>
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.bypassed && props.item.bypassed.businessHours) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
             <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.bypassed && props.item.bypassed.nonBusinessHours, true) }}
          </span>
        </td>
        <td class="text-xs-center">
          <span>
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.resolved && props.item.resolved.businessHours) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
             <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.resolved && props.item.resolved.nonBusinessHours, true) }}
          </span>
        </td>
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
        <v-form v-if="addCommitment" class="pt-4 px-4 mr-4 grey lighten-3" ref="form" lazy-validation>
          <h3 class="title mb-0">{{ $t("Add commitment") }}</h3>
          <v-layout row wrap align-center>
            <v-flex xs3 class="required-label">{{ $t("Request type") }}</v-flex>
            <v-flex xs4>
              <v-select
                v-model="newCommitment.request"
                :items="requestTypes"
                item-text="value"
                item-value="key"
                flat
                single-line
                :rules="[() => newCommitment.request.length > 0 || $i18n.t('Required field')]"
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
            <v-flex xs3 class="required-label">{{ $t("Severity") }}</v-flex>
            <v-flex xs4>
              <v-select
                v-model="newCommitment.severity"
                :items="severityTypes"
                item-text="value"
                item-value="key"
                flat
                single-line
                :rules="[() => newCommitment.severity.length > 0 || $i18n.t('Required field')]"
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
            <v-flex xs3 class="required-label">{{ $t("Ossa identifier") }}</v-flex>
            <v-flex xs4>
              <v-select
                v-model="newCommitment.idOssa"
                :items="OSSA_IDS"
                item-text="value"
                item-value="key"
                flat
                single-line
                :rules="[() => newCommitment.idOssa.length > 0 || $i18n.t('Required field')]"
              >
                <template slot="item" slot-scope="data">
                  <v-avatar :color="data.item.color" size="25">
                    <span class="white--text">{{ data.item.id }}</span>
                  </v-avatar>
                  <span class="pl-2"> {{ $t(data.item.key) }} </span>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-avatar :color="data.item.color" size="25">
                    <span class="white--text">{{ data.item.id }}</span>
                  </v-avatar>
                  <span class="pl-2"> {{ $t(data.item.key) }} </span>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs3> {{ $t("treatment time range") }} </v-flex>
            <v-flex xs3> {{ $t("Business hours") }} </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs4 v-if="contract.features && contract.features.nonBusinessHours">{{ $t("Non business hours") }} </v-flex>
            <v-flex xs4 v-else></v-flex>
            <v-flex xs3 class="required-label">{{ $t("Supported") }}</v-flex>
            <v-flex xs3> 
              <v-layout row>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.supported.businessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.supported.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("D") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.supported.businessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.supported.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4"> {{ $t("H") }} </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3> 
              <v-layout row wrap v-if="contract.features && contract.features.nonBusinessHours">
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.supported.nonBusinessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.supported.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("d") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.supported.nonBusinessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.supported.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("h") }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Bypassed") }}</v-flex>
            <v-flex xs3> 
              <v-layout row>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.bypassed.businessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.bypassed.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("D") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.bypassed.businessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.bypassed.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4"> {{ $t("H") }} </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3> 
              <v-layout row wrap v-if="contract.features && contract.features.nonBusinessHours">
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.bypassed.nonBusinessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.bypassed.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("d") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.bypassed.nonBusinessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.bypassed.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("h") }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Resolved") }}</v-flex>
            <v-flex xs3> 
              <v-layout row>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.resolved.businessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.resolved.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("D") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.resolved.businessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.resolved.businessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4"> {{ $t("H") }} </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs1></v-flex>
            <v-flex xs3> 
              <v-layout row wrap v-if="contract.features && contract.features.nonBusinessHours">
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.resolved.nonBusinessHours.days"
                    mask="###"
                    :rules="[() => isSetDaysOrHours(newCommitment.resolved.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("d") }}</v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="newCommitment.resolved.nonBusinessHours.hours"
                    mask="##"
                    :rules="[() => isSetDaysOrHours(newCommitment.resolved.nonBusinessHours) || $i18n.t('Required field')]"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1 class="pt-4">{{ $t("h") }}</v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs9 mt-3>
              <v-btn @click="appendCommitment" class="success">{{ $t("Add commitment") }}</v-btn>
              {{ $t("or") }}
              <v-btn @click="addCommitment = !addCommitment" class="error">{{ $t("Cancel") }}</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
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
import { OSSA_IDS } from "@/constants.js";
import { SEVERITY_TYPES } from "@/constants.js";
import { REQUEST_TYPES } from "@/constants.js";

export default {
  name: "contract-edit-engagements",
  data() {
    return {
      newRequest: "",
      newSeverity: "",
      allweek: false,
      engagementList: {
        engagements: []
      },
      engagementListObject: {
        schedule: {},
        engagements: []
      },
      newCommitment: {
        supported: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        request: "",
        severity: "",
        idOssa: "",
        bypassed: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        resolved: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        description: ""
      },
      addCommitment: false,
      contract: {},
      requestTypes: REQUEST_TYPES.map(requestType => ({ key: requestType, value: this.$i18n.t(requestType) })),
      severityTypes: SEVERITY_TYPES.map(severityType => ({ key: severityType, value: this.$i18n.t(severityType) })),
      OSSA_IDS
    };
  },
  methods: {
    getOssaByKey(key) {
      return this.OSSA_IDS.find(ossaId => ossaId.key == key);
    },
    isSetDaysOrHours({ days, hours }) {
      return days || hours ? true : false;
    },
    removeCommitment(commitment) {
      this.engagementList.engagements = this.engagementList.engagements.filter(
        item => JSON.stringify(item) != JSON.stringify(commitment)
      );
    },
    appendCommitment() {
      if (!this.$refs.form.validate())
        return;

      let newCommitment = Object.assign({}, this.newCommitment);
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
      this.newCommitment = {
        supported: {
        businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        request: "",
        severity: "",
        idOssa: "",
        bypassed: {         
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        resolved: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        }
      };
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
      const bhduration = this.moment.duration({
        hours: schedule.businessHours.hours,
        days: schedule.businessHours.days
      });
      const nbhduration = this.moment.duration({
        hours: schedule.nonBusinessHours.hours,
        days: schedule.nonBusinessHours.days
      });

      return {
        businessHours: bhduration.toISOString(),
        nonBusinessHours: nbhduration.toISOString()
      };
    },

    cnsDurationDisplay(durationString, isInBusinessHours = false) {
      const parsedDuration = this.moment.duration(durationString);
      const days = parsedDuration.clone().subtract({
        hours: parsedDuration.hours()
      }).asDays();

      if (days) {
        if (parsedDuration.hours()) {
          return this.$i18n.t(isInBusinessHours ? "{days}wd {hours}wh" : "{days}d {hours}h", {
            days,
            hours: parsedDuration.hours()
          });
        }

        return this.$i18n.t(isInBusinessHours ? "{days}wd" : "{days}d", {
          days
        });
      }


      return this.$i18n.t(isInBusinessHours ? "{hours}wh" : "{hours}h", {
        hours: parsedDuration.hours()
      });
    },

    validate() {
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
