<template>
  <v-menu v-model="showDatePicker" :close-on-content-click="false" full-width max-width="290">
    <template v-slot:activator="{ on }">
      <v-stepper-step
        step=""
        :color="isRejected ? 'error' : 'success'"
        :complete-icon="isRejected ? 'close' : 'check'"
        class="select-step"
        complete
        v-on="on"
        v-if="completed"
      >
        {{ $t(stepName) }}
        <small class="grey--text" v-if="date.length">{{ moment(date).format("L") }}</small>
      </v-stepper-step>
      <v-stepper-step step="" v-on="on" v-else>{{ $t(stepName) }} </v-stepper-step>
      <v-divider :vertical="isPublished" v-if="!isRejected"></v-divider>
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
    statusStepDate: null
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
      return this.$auth.check(EXPERT_ROLE.ADMIN) || this.$auth.check(EXPERT_ROLE.EXPERT);
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
