<template>
  <v-container class="pa-0" v-if="$auth.ready() && $auth.check('admin')">
    <div class="page-title">
      <span>{{ $t("Contracts list") }}</span>
    </div>
    <span class="contracts-search-span hidden-xs-only">{{ $t("Search by:") }}</span>
    <v-layout row wrap>
      <v-flex xs12 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="contracts-search-name"
        ></v-text-field>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-select
          solo
          :items="statusList"
          item-text="label"
          item-value="value"
          v-model="status"
          hide-details
          :label="$i18n.t('Status')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-status"
        ></v-select>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 mb-1>
        <v-select
          solo
          :items="clients"
          v-model="client"
          hide-details
          :label="$i18n.t('Client')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-client"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-end>
      <v-btn flat :to="{ name: 'NewContract' }">
        <v-icon class="mr-2">add_circle</v-icon>
        {{ $t("Add contract") }}
      </v-btn>
    </v-layout>
    <div v-if="status || client" class="contracts-filters">
      <v-chip v-if="status" @input="status = null" close>{{ $i18n.t("status") }} : {{ $i18n.t(status) }}</v-chip>
      <v-chip v-if="client" @input="client = ''" close>{{ $i18n.t("client") }} : {{ $i18n.t(client) }}</v-chip>
    </div>
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
          <router-link class="contracts-actions blue-color" :to="{ name: 'Contract', params: { id: props.item._id } }">
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
        <td class="text-xs-center">{{ new Date(props.item.startDate).toDateString() }}</td>
        <td class="text-xs-center">{{ new Date(props.item.endDate).toDateString() }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ExpiredLabel from "@/components/ExpiredLabel.vue";
import StatusName from "@/components/StatusName";
import { mapGetters } from "vuex";
import { CONTRACT_STATUS } from "@/constants.js";

export default {
  data() {
    return {
      search: "",
      client: "",
      status: null,
      statusList: Object.values(CONTRACT_STATUS).map(status => ({ label: this.$i18n.t(status), value: status })),
      rowsPerPageItems: [10, 25, 50],
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
      clients: "contract/getClients"
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
    }
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },
  components: {
    ExpiredLabel,
    StatusName
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
