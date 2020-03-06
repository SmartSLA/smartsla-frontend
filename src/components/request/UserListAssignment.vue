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
    <v-layout class="font-weight-medium btn-actions" xs6 md6>
      <v-flex text-xs-left pa-0>
        <span v-if="isUserBeneficiary">
          <v-btn
            class="px-1 mt-1 text-transform"
            :disabled="canAssign()"
            flat
            color="primary"
            @click="assignTo('expert')"
            >{{ $t("Assign the expert") }}
          </v-btn>
        </span>
        <span v-else>
          <v-btn class="px-1 mt-1" flat color="primary" @click="assignTo('beneficiary')"
            >{{ $t("Assign the customer") }}
          </v-btn>
        </span>
      </v-flex>
      <v-flex text-xs-right pa-0>
        <v-btn :disabled="canTakeIt()" class="px-1 mt-1" flat color="primary" @click="assignSelf">
          {{ $t("Take it") }}
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { USER_TYPE } from "@/constants.js";

export default {
  name: "user-list-assignment",
  props: {
    users: Array,
    responsible: Object,
    request: Object
  },
  computed: {
    ...mapGetters({
      getUser: "user/getUser"
    }),
    contract() {
      return this.$store.getters["contract/getContractById"](this.request.contract);
    },
    isUserBeneficiary() {
      return this.getUser && this.getUser.type === USER_TYPE.BENEFICIARY;
    },
    isUserExpert() {
      return this.getUser && this.getUser.type === USER_TYPE.EXPERT;
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
    },
    canAssign() {
      const ticketStatus = ["resolved", "closed"].includes(this.request.status);
      if (ticketStatus || !this.request.responsible) {
        return true;
      }
      return false;
    },
    canTakeIt() {
      const ticketStatus = ["resolved", "closed"].includes(this.request.status);
      if (this.isUserExpert && ticketStatus) {
        return true;
      }
      return false;
    },
    assignTo(userType) {
      this.$emit("assignTo", userType);
    }
  }
};
</script>

<style lang="stylus" scoped>
.btn-actions .v-btn {
  text-transform: initial;
}

.btn-actions .v-btn:hover {
  text-decoration: underline;
}

.btn-actions .v-btn:hover:before {
  background-color: transparent;
}
</style>
