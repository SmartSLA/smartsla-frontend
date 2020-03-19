<template>
  <v-chip v-if="isUserBeneficiary" color="#174dc5" class="ma-2" label text-color="white"
    >{{ contract && contract.client[0] }}
  </v-chip>
  <support-account v-else></support-account>
</template>

<script>
import SupportAccount from "@/components/SupportAccount";
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
    }
  },
  components: {
    SupportAccount
  }
};
</script>
