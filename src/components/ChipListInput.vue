<template>
  <v-combobox persistent-hint hide-selected :value="CPEList" multiple chips @input="updateValidCPE">
    <template slot="selection" slot-scope="{ item, selected }">
      <v-chip
        :color="validCPE.includes(item) ? 'default' : 'red'"
        :text-color="validCPE.includes(item) ? '' : 'white'"
        :selected="selected"
        close
        @input="removeItem(item)"
      >
        {{ item }}
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <span>{{ item }}</span>
    </template>
  </v-combobox>
</template>

<script>
export default {
  data: () => ({
    CPEValidated: []
  }),
  props: {
    CPEValidation: { type: Array }
  },
  methods: {
    updateValidCPE(cpes) {
      const regex = /^cpe:2.3:[a,o,h]:\w*:\w*:[\d,\-,\\.]*.*$/;
      this.CPEValidated = cpes.filter(c => regex.test(c));
      this.$emit("CPEList:updated", cpes);
    },
    removeItem(item) {
      const idx = this.CPEValidation.indexOf(item);
      this.$emit("CPEList:removed", idx);
    }
  },
  computed: {
    CPEList() {
      return this.CPEValidation;
    },
    validCPE() {
      return this.CPEValidated;
    }
  }
};
</script>
