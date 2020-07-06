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
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.supported && props.item.supported.businessHours, true) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
            <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.supported && props.item.supported.nonBusinessHours) }}
          </span>
        </td>
        <td class="text-xs-center">
          <span>
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.bypassed && props.item.bypassed.businessHours, true) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
            <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.bypassed && props.item.bypassed.nonBusinessHours) }}
          </span>
        </td>
        <td class="text-xs-center">
          <span>
            {{ $t("BH") }}: {{ cnsDurationDisplay(props.item.resolved && props.item.resolved.businessHours, true) }}
          </span>
          <span v-if="contract.features && contract.features.nonBusinessHours">
            <br />
            {{ $t("NBH") }}: {{ cnsDurationDisplay(props.item.resolved && props.item.resolved.nonBusinessHours) }}
          </span>
        </td>
        <td class="text-xs-center">
          <v-btn color="primary" flat small @click="editCommitment(props.item)">
            <v-icon>edit</v-icon>
            {{ $t("Edit") }}
          </v-btn>
          <v-btn color="error" flat small @click="removeCommitment(props.item)">
            <v-icon>remove_circle</v-icon>
            {{ $t("Remove") }}
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-btn small flat class="pl-4 success--text" @click="openModal">
      <v-icon class="success--text">add_circle</v-icon>
      {{ $t("Add") }}
    </v-btn>
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-dialog scrollable v-model="formDialog" :fullscreen="$vuetify.breakpoint.xs" persistent max-width="600px">
          <FormEngagement
            :commitment="commitment"
            :editing="isEdit"
            :isModalOpen="formDialog"
            :requestTypes="requestTypes"
            :severityTypes="severityTypes"
            :ossaIds="ossaIds"
            :contract="contract"
            @submit="submit"
            @closeFormModal="closeFormModal"
            @resetRequestType="resetRequestType"
            @resetOnCancel="resetOnCancel"
          >
          </FormEngagement>
        </v-dialog>
        <v-dialog v-model="deleteModal" persistent max-width="300">
          <v-card class="px-4 pt-2">
            <v-card-text>
              <span class="body-2">{{ $t("Are you sure you want to remove this item") }} ?</span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="confirmDeleteCommitment">{{ $t("confirm") }}</v-btn>
              <v-btn color="error" @click="deleteModal = false">{{ $t("cancel") }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { OSSA_IDS, SEVERITY_TYPES, REQUEST_TYPES } from "@/constants.js";
import FormEngagement from "@/components/admin/contract/FormEngagement.vue";
import { humanizeHoursDurationFilter } from "@/filters/humanizeHoursDurationFilter";
import { convertIsoDurationInDaysHoursMinutes } from "@/services/helpers/duration";

export default {
  name: "contract-edit-engagements",
  data() {
    return {
      formDialog: false,
      allweek: false,
      engagementList: {
        engagements: []
      },
      engagementListObject: {
        schedule: {},
        engagements: []
      },
      commitment: {
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
        custom_request: "",
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
      contract: {},
      requestTypes: REQUEST_TYPES.map(requestType => ({ key: requestType, value: this.$i18n.t(requestType) })),
      severityTypes: SEVERITY_TYPES.map(severityType => ({ key: severityType, value: this.$i18n.t(severityType) })),
      ossaIds: OSSA_IDS,
      isEdit: false,
      deleteModal: false
    };
  },
  components: {
    FormEngagement
  },
  methods: {
    resetOnCancel() {
      this.commitment = {
        request: "",
        severity: "",
        idOssa: "",
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
      };
    },
    resetRequestType() {
      this.commitment.custom_request = "";
    },
    closeFormModal() {
      this.formDialog = false;
    },
    openModal() {
      this.isEdit = false;
      this.formDialog = true;
    },
    getOssaByKey(key) {
      return this.ossaIds.find(ossaId => ossaId.key == key);
    },
    removeCommitment(commitment) {
      this.deleteModal = true;
      this.selectedItem = commitment;
    },
    confirmDeleteCommitment() {
      this.deleteModal = false;
      this.engagementList.engagements = this.engagementList.engagements.filter(
        item => JSON.stringify(item) != JSON.stringify(this.selectedItem)
      );
      this.validate("Deleted");
    },
    editCommitment(commitment) {
      this.formDialog = true;
      this.isEdit = true;
      this.selectedItem = commitment;
      this.commitment = {
        ...this.selectedItem,
        request: this.isCustomRequestType(commitment.request) ? "Other" : commitment.request,
        custom_request: commitment.request === "Other" ? commitment.request : commitment.request,
        supported: {
          businessHours: this.parseDuration(commitment.supported.businessHours),
          nonBusinessHours: this.parseDuration(commitment.supported.nonBusinessHours)
        },
        bypassed: {
          businessHours: this.parseDuration(commitment.bypassed.businessHours),
          nonBusinessHours: this.parseDuration(commitment.bypassed.nonBusinessHours)
        },
        resolved: {
          businessHours: this.parseDuration(commitment.resolved.businessHours),
          nonBusinessHours: this.parseDuration(commitment.resolved.nonBusinessHours)
        }
      };
    },
    isCustomRequestType(value) {
      return !this.requestTypes.map(e => e.key).includes(value);
    },
    submit(commitment) {
      const toastMsg = this.isEdit ? "Updated" : "Added";
      if (this.isEdit) {
        const { _id: software_editing_id } = this.selectedItem;
        const index = this.engagementList.engagements.findIndex(commitment => commitment._id === software_editing_id);
        commitment = this.normalizeCommitment(commitment);
        this.$set(this.engagementList.engagements, index, commitment);
      } else {
        commitment = this.normalizeCommitment(commitment);
        this.engagementList.engagements.push(commitment);
      }
      this.validate(toastMsg);
      this.formDialog = false;
    },
    normalizeCommitment(commitment) {
      return {
        ...commitment,
        request: commitment.request === "Other" ? commitment.custom_request : commitment.request,
        supported: this.getDuration(commitment.supported),
        bypassed: this.getDuration(commitment.bypassed),
        resolved: this.getDuration(commitment.resolved)
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

    parseDuration(durationString) {
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(durationString);

      return {
        days,
        hours
      };
    },

    cnsDurationDisplay(durationString, isInBusinessHours = false) {
      const { days, hours } = convertIsoDurationInDaysHoursMinutes(durationString);

      return humanizeHoursDurationFilter({ days, hours }, isInBusinessHours);
    },
    validate(toastMsg) {
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
            message: this.$i18n.t(toastMsg),
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
        { text: this.$i18n.t("support priority"), value: "idOssa" },
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
