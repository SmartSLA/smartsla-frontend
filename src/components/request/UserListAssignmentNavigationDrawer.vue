<template>
  <v-layout column>
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
        <v-btn :disabled="canTakeIt()" class="px-1 mt-1" flat color="primary" @click="setRequestRole(getUser)">
          {{ $t("Take it") }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-autocomplete
      class="my-0 py-0"
      :items="contractUsers"
      item-text="name"
      :value="responsible"
      :placeholder="$t('Assign to someone')"
      return-object
      dense
      autofocus
      hide-details
      :disabled="isSubmit"
      @change="setRequestRole"
    >
      <template slot="item" slot-scope="data">
        <v-list-tile-avatar>
          <v-chip v-if="data.item.type === 'beneficiary'" color="blue darken-4" class="ma-2" label text-color="white"
            >{{ contract && contract.client && contract.client[0] }}
          </v-chip>
          <support-account v-else></support-account>
        </v-list-tile-avatar>
        <v-list-tile-content>
          {{ data.item.name }}
        </v-list-tile-content>
        <v-list-tile-action v-show="request.assignedTo && data.item.name === request.assignedTo.name">
          <v-icon color="success">done</v-icon>
        </v-list-tile-action>
      </template>
    </v-autocomplete>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import { USER_TYPE, TICKET_STATUS } from "@/constants.js";
import SupportAccount from "@/components/SupportAccount";

export default {
  name: "assignement-navigation-drawer",
  components: {
    SupportAccount
  },
  data() {
    return {
      isSubmit: false
    };
  },
  props: {
    setRequestRole: Function,
    responsible: Object,
    request: Object
  },
  created() {
    this.$store.dispatch("contract/fetchContractUsers", this.request.contract);
  },
  computed: {
    ...mapGetters({
      getUser: "currentUser/getUser"
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
      return [TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED].includes(this.request.status);
    }
  },
  methods: {
    getContractUserAsAssignee(contractUser) {
      return {
        type: contractUser.type,
        role: contractUser.role,
        id: contractUser.user._id,
        email: contractUser.user.preferredEmail,
        name: contractUser.user.displayName || contractUser.user.preferredEmail
      };
    },

    canAssign() {
      return this.ticketPostResolved || !this.request.responsible;
    },

    canTakeIt() {
      return this.ticketPostResolved && this.isUserExpert;
    },

    assignTo(userType) {
      const user = userType === USER_TYPE.BENEFICIARY ? this.request.author : this.request.responsible;
      return this.setRequestRole(user);
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
