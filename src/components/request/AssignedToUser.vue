<template>
  <span>
    <v-chip v-if="user && user.type == 'beneficiary'" color="#174dc5" class="my-0" label small text-color="white"
      >{{ contract && contract.client[0] }}
    </v-chip>
    <span v-else>
      <span v-if="user">
        <v-chip small class="my-0" color="#d32f2f" label text-color="white">L</v-chip>
      </span>
    </span>
    {{ (user && user.name) || $t("Not assigned yet") }}
  </span>
</template>

<script>
export default {
  name: "assigned-to-user",
  props: {
    user: Object,
    contractId: String
  },
  computed: {
    contract() {
      return this.$store.getters["contract/getContractById"](this.contractId);
    }
  }
};
</script>
<style lang="stylus"></style>
