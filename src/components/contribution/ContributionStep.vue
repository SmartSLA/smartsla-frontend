<template>
  <v-menu v-model="showDatePicker" :close-on-content-click="false" full-width max-width="290">
    <template v-slot:activator="{ on }">
      <v-stepper-step step="" color="success" complete v-on="on" v-if="completed"
        >{{ $t(stepName) }}
        <small class="grey--text" v-if="date.length">{{ moment(date).format("L") }}</small>
      </v-stepper-step>
      <v-stepper-step step="" v-on="on" v-else>{{ $t(stepName) }} </v-stepper-step>
    </template>
    <v-date-picker v-model="pickerDate" @change="showDatePicker = false" v-if="canEdit"></v-date-picker>
    <v-btn flat color="error" v-if="completed && canEdit" @click="removeStatus">
      <v-icon>clear</v-icon> {{ $t("remove") }}
    </v-btn>
  </v-menu>
</template>
<script>
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
      return this.$auth.check("admin") || this.$auth.check("expert");
    }
  },
  methods: {
    removeStatus() {
      this.pickerDate = "";
      this.showDatePicker = false;
      this.$emit("statusChange", this.stepName.toLowerCase());
    }
  },
  watch: {
    pickerDate(newDate) {
      this.$emit("statusChange", this.stepName.toLowerCase(), newDate);
    }
  }
};
</script>
