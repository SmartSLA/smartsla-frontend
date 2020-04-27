<template>
  <div>
    <v-autocomplete
      :items="contractUsers"
      item-text="name"
      :value="responsible"
      :label="$t('Assigned to')"
      return-object
      hide-details
      :disabled="isSubmitting"
      @change="setResponsible"
    >
      <template slot="item" slot-scope="data">
        <v-list-tile-avatar>
          <v-chip v-if="data.item.type === 'beneficiary'" color="#174dc5" class="ma-2" label text-color="white"
            >{{ contract && contract.client && contract.client[0] }}
          </v-chip>
          <support-account v-else></support-account>
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
import SupportAccount from "@/components/SupportAccount";
export default {
  name: "user-list-assignment",
  props: {
    responsible: Object,
    request: Object,
    isSubmitting: Boolean
  },
  created() {
    this.$store.dispatch("contract/fetchContractUsers", this.request.contract);
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
    },
    contractUsers() {
      const users = this.$store.getters["contract/getContractUsers"](this.request.contract);
      const assignees = (users || []).map(this.getContractUserAsAssignee);

      return this.ticketPostResolved
        ? assignees.filter(assignee => assignee.type === USER_TYPE.BENEFICIARY)
        : assignees;
    },
    ticketPostResolved() {
      return ["resolved", "closed"].includes(this.request.status);
    }
  },
  methods: {
    getContractUserAsAssignee(contractUser) {
      return {
        type: contractUser.type,
        role: contractUser.role,
        id: contractUser.user._id,
        _id: contractUser.user._id,
        email: contractUser.user.preferredEmail,
        name: contractUser.user.displayName || contractUser.user.preferredEmail
      };
    },

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
      return this.ticketPostResolved || !this.request.responsible;
    },

    canTakeIt() {
      return this.ticketPostResolved && this.isUserExpert;
    },

    assignTo(userType) {
      const user = userType === USER_TYPE.BENEFICIARY ? this.request.author : this.request.responsible;
      this.$emit("assignTo", user);
    }
  },
  components: {
    SupportAccount
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
