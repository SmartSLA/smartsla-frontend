<template>
  <v-container class="pa-0" v-if="$auth.ready()">
    <ContractListFilter
      :statusList="statusList"
      :clients="clients"
      @search-updated="handleSearchUpdate"
      @client-updated="handleClientUpdate"
      @status-updated="handleStatusUpdate"
      v-if="CanListContracts"
    >
    </ContractListFilter>
    <v-data-table
      :headers="headers"
      :items="contractsList"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      class="elevation-1"
      :search="search"
      :rows-per-page-text="$t('Rows per page:')"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">
          <router-link class="contracts-actions blue-color" :to="getContractPath(props.item._id)">
            <status-name :name="props.item.name" :active="props.item.status" />
            <expired-label
              :expirationDate="props.item.endDate"
              :status="props.item.status"
              :haveAStatus="true"
            ></expired-label>
          </router-link>
        </td>
        <td class="text-xs-center">
          <router-link
            v-if="$auth.check('admin')"
            class="blue-color"
            :to="{ name: 'Client', params: { id: props.item.clientId } }"
            >{{ props.item.client }}
          </router-link>
          <span v-else> {{ props.item.client }} </span>
        </td>
        <td class="text-xs-center">{{ props.item.startDate | formatDateFilter("ll", userLanguage) }}</td>
        <td class="text-xs-center">{{ props.item.endDate | formatDateFilter("ll", userLanguage) }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ExpiredLabel from "@/components/ExpiredLabel.vue";
import StatusName from "@/components/StatusName";
import ContractListFilter from "@/components/admin/contract/ContractListFilter.vue";
import { mapGetters } from "vuex";
import { CONTRACT_STATUS, BENEFICIARY_ROLE_LIST, USER_TYPE, EXPERT_ROLE } from "@/constants.js";
import { routeNames } from "@/router";
import { LOCALE } from "@/i18n/constants";

export default {
  metaInfo() {
    return {
      title: this.$i18n.t("Contracts")
    };
  },
  data() {
    return {
      search: "",
      client: "",
      status: null,
      statusList: Object.values(CONTRACT_STATUS).map(status => ({ label: this.$i18n.t(status), value: status })),
      rowsPerPageItems: [10, 25, 50, { text: "$vuetify.dataIterator.rowsPerPageAll", value: -1 }],
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      roles: [],
      headers: [
        { text: this.$i18n.t("Name"), value: "name" },
        { text: this.$i18n.t("Client"), value: "client" },
        { text: this.$i18n.t("Begin"), value: "begin" },
        { text: this.$i18n.t("End"), value: "end" }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("contract/fetchContracts");
  },
  computed: {
    ...mapGetters({
      contracts: "contract/getContracts",
      clients: "contract/getClients",
      getUserLanguage: "configuration/getUserLanguage"
    }),
    contractsList() {
      let filtered = this.contracts;
      if (this.client) {
        filtered = filtered.filter(item => item.client === this.client);
      }
      if (this.status) {
        switch (this.status) {
          case CONTRACT_STATUS.EXPIRED:
            filtered = filtered.filter(item => this.moment().diff(item.endDate) > 0);
            break;
          case CONTRACT_STATUS.ACTIVE:
            filtered = filtered.filter(item => item.status);
            break;
          case CONTRACT_STATUS.INACTIVE:
            filtered = filtered.filter(item => !item.status);
            break;
        }
      }
      return filtered;
    },

    CanListContracts() {
      return (
        this.$auth.check(USER_TYPE.ADMIN) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER)
      );
    },
    userLanguage() {
      return this.getUserLanguage || LOCALE;
    }
  },
  beforeCreate() {
    if (
      !this.$auth.ready() &&
      (!this.$auth.check("admin") ||
        !this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) ||
        !this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER))
    ) {
      this.$router.push("/403");
    }
  },
  components: {
    ExpiredLabel,
    StatusName,
    ContractListFilter
  },
  methods: {
    handleSearchUpdate(term) {
      this.search = term;
    },

    handleClientUpdate(client) {
      this.client = client;
    },

    handleStatusUpdate(status) {
      this.status = status;
    },

    getContractPath(contractId) {
      return (this.$auth.check(EXPERT_ROLE.EXPERT) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.VIEWER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CUSTOMER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.CONTRACT_MANAGER) ||
        this.$auth.check(BENEFICIARY_ROLE_LIST.OPERATIONAL_MANAGER)) &&
        !this.$auth.check(EXPERT_ROLE.ADMIN)
        ? { name: routeNames.CLIENTCONTRACT, params: { id: contractId } }
        : { name: routeNames.CONTRACT, params: { id: contractId } };
    }
  }
};
</script>
<style lang="stylus" scoped>
.page-title {
  color: #777777;
  margin-bottom: 24px;
}

.elevation-1 th {
  color: #000000;
}

.contracts-list {
  width: 100% !important;
}

.container.fluid.fill-height {
  padding: 50px;
  width: 100%;
  max-width: 100%;
}

.layout.justify-center.align-center > div {
  width: 100%;
}

.contracts-search-span {
  padding-top: 15px;
  width: 100px;
  color: #777;
}

.contracts-filters,
.contracts-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.contracts-search-name, .v-input.v-text-field {
  margin-right: 10px !important;
}

.user-mail {
  color: #a20000;
  font-weight: bold !important;
}

.contracts-operations a {
  margin-left: 20px;
}

.contracts-operations {
  margin: 10px;
  display: flex;
}

.contracts-actions {
  text-decoration: none !important;
  display: flex;
}

.contracts-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.contracts-search {
  width: 100% !important;
}
</style>
