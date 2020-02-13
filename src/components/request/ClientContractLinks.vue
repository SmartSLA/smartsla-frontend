<template>
  <v-layout d-inline>
    <router-link
      v-if="$auth.check('admin')"
      :to="{
        name: 'Client',
        params: { id: contract && contract.clientId }
      }"
      target="_blank"
    >
      <span class="blue-color">
        <text-highlight :queries="query">{{ contract && contract.client }}</text-highlight>
      </span>
    </router-link>
    <text-highlight v-else :queries="query">{{ contract && contract.client }}</text-highlight>
    <span class="px-1">/</span>
    <router-link
      v-if="$auth.check('admin')"
      :to="{
        name: 'Contract',
        params: { id: contract && contract._id }
      }"
      target="_blank"
    >
      <span class="blue-color">
        <text-highlight :queries="query">{{ contract && contract.name }}</text-highlight>
      </span>
    </router-link>
    <text-highlight v-else :queries="query">{{ contract && contract.name }}</text-highlight>
  </v-layout>
</template>

<script>
export default {
  name: "client-contract-links",
  props: {
    contractId: String,
    query: {
      type: String,
      default: ""
    }
  },
  computed: {
    contract() {
      return this.$store.getters["contract/getContractById"](this.contractId);
    }
  }
};
</script>
<style lang="stylus"></style>
