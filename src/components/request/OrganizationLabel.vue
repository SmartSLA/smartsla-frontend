<template>
  <v-chip v-if="isUserBeneficiary" color="#174dc5" class="ma-2" label text-color="white"
    >{{ organizationLabel }}
  </v-chip>
  <v-chip v-else color="#d32f2f" class="ma-2" label text-color="white">
    {{ organizationLabel }}
  </v-chip>
</template>

<script>
export default {
  name: "organization-label",
  props: {
    user: Object,
    contractId: String
  },
  computed: {
    contract() {
      return this.$store.getters["contract/getContractById"](this.contractId);
    },
    isUserBeneficiary() {
      return this.user && this.user.type === "beneficiary";
    },
    organizationLabel() {
      return this.isUserBeneficiary ? this.contract.client[0] : "L";
    }
  }
};
</script>
<style lang="stylus"></style>
