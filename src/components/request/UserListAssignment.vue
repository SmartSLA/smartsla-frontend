<template>
  <div>
    <v-autocomplete
      :items="users"
      item-text="name"
      :value="responsible"
      :label="$t('Assigned to')"
      return-object
      hide-details
      @change="setResponsible"
    >
      <template slot="item" slot-scope="data">
        <v-list-tile-avatar>
          <v-chip v-if="data.item.type === 'beneficiary'" color="#174dc5" class="ma-2" label text-color="white"
            >{{ contract && contract.client && contract.client[0] }}
          </v-chip>
          <v-chip v-else color="#d32f2f" class="ma-2" label text-color="white">L</v-chip>
        </v-list-tile-avatar>
        <v-list-tile-content>
          {{ data.item.name }}
        </v-list-tile-content>
      </template>
    </v-autocomplete>
    <v-layout class="font-weight-medium" xs6 md6>
      <v-flex text-xs-left pa-0>
        <router-link class="action-link" @click.native.prevent="assignCustomer" to="">{{
          $t("Assign the customer")
        }}</router-link>
      </v-flex>
      <v-flex text-xs-right pa-0>
        <router-link class="action-link" @click.native.prevent="assignSelf" to="">{{ $t("Take it") }}</router-link>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "user-list-assignment",
  props: {
    users: Array,
    responsible: Object,
    contractId: String
  },
  computed: {
    contract() {
      return this.$store.getters["contract/getContractById"](this.contractId);
    }
  },
  methods: {
    setResponsible(user) {
      this.$emit("update:responsible", user);
    },
    assignCustomer() {
      this.$emit("assignCustomer");
    },
    assignSelf() {
      this.$emit("assignSelf");
    }
  }
};
</script>

<style scoped>
.action-link {
  text-decoration: none;
}
</style>
