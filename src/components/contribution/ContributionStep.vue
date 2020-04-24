<template>
  <v-menu v-if="stepName !== null" v-model="showDatePicker" :close-on-content-click="false" full-width max-width="290">
    <template v-slot:activator="{ on }">
      <v-flex v-if="statusStepDate !== null" xs2 sm2 md2 lg2 xl2 class="px-0 mx-1">
        <v-stepper-step
          v-if="completed"
          step=""
          :color="isRejected ? 'error' : 'success'"
          :complete-icon="isRejected ? 'close' : 'check'"
          complete
          v-on="on"
        >
          <v-layout column justify-center align-center>
            <span class="caption" :class="{ 'select-step': canEdit }">{{ $t(stepName) }}</span>
            <span class="grey--text caption" v-if="date.length">{{ moment(date).format("L") }}</span>
          </v-layout>
        </v-stepper-step>
      </v-flex>
      <v-flex v-else xs2 sm2 md2 lg2 xl2 class="px-0">
        <v-stepper-step v-if="!completed" step="" v-on="on">
          <v-layout column>
            <span class="caption" :class="{ 'select-step': canEdit }">{{ $t(stepName) }}</span>
          </v-layout>
        </v-stepper-step>
      </v-flex>
      <v-divider vertical class="ml-2 mr-0 mt-3" v-if="!isRejected && isPublished"></v-divider>
    </template>
    <v-date-picker v-model="pickerDate" no-title @change="showDatePicker = false" v-if="canEdit"></v-date-picker>
    <v-btn flat color="error" v-if="completed && canEdit" @click="removeStatus">
      <v-icon>clear</v-icon> {{ $t("remove") }}
    </v-btn>
  </v-menu>
</template>
<script>
import { EXPERT_ROLE, CONTRIBUTION_STATUS } from "@/constants";

export default {
  name: "contributionStep",
  props: {
    stepName: null,
    statusStepDate: null,
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerDate: "",
      showDatePicker: false
    };
  },
  computed: {
    date() {
      return this.pickerDate || this.statusStepDate || "";
    },

    completed() {
      return this.pickerDate || this.statusStepDate;
    },

    canEdit() {
      return this.editable && (this.$auth.check(EXPERT_ROLE.ADMIN) || this.$auth.check(EXPERT_ROLE.EXPERT));
    },

    isRejected() {
      return this.stepName === CONTRIBUTION_STATUS.REJECTED;
    },

    isPublished() {
      return this.stepName === CONTRIBUTION_STATUS.PUBLISHED;
    }
  },
  methods: {
    removeStatus() {
      this.pickerDate = "";
      this.showDatePicker = false;
      this.$emit("statusChange", this.stepName);
    }
  },
  watch: {
    pickerDate(newDate) {
      this.$emit("statusChange", this.stepName, newDate);
    }
  }
};
</script>
<style lang="stylus" scoped>
.select-step:hover {
   background: rgba(0,0,0,0.06);
   text-shadow: 0px 0px 0px #000;
   cursor: pointer;
}
</style>
