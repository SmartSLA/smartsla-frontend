<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="contracts-list">
      <div class="page-title">
        <span>{{ $t("Contracts list") }}</span>
      </div>
      <div class="contracts-search">
        <span class="contracts-search-span">{{ $t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="contracts-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          :label="$i18n.t('Status')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-status"
        ></v-select>
        <v-select
          solo
          :items="clients"
          v-model="clients"
          hide-details
          :label="$i18n.t('Team')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-team"
        ></v-select>
        <v-select
          solo
          :items="roles"
          v-model="roles"
          hide-details
          :label="$i18n.t('Commercial')"
          :no-data-text="$i18n.t('No data available')"
          class="contracts-search-commercial"
        ></v-select>
        <div class="contracts-operations">
          <router-link class="contracts-actions blue-color" :to="{ name: 'NewContract' }">
            <v-icon>add_circle</v-icon>
            <span>{{ $t("Add contract") }}</span>
          </router-link>
          <a href="#" class="contracts-actions blue-color">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $t("Export") }}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="contracts"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
        :rows-per-page-text="$t('Rows per page:')"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
            <router-link
              class="contracts-actions blue-color"
              :to="{ name: 'Contract', params: { id: props.item._id } }"
            >
              {{ props.item.name }}
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
    </div>
  </div>
</template>

<script>
import ExpiredLabel from "@/components/ExpiredLabel";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      clients: [],
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
      contracts: "contract/getContracts"
    })
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  },
  components: {
    ExpiredLabel
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

.contracts-search-name,
.contracts-search-status,
.contracts-search-tam,
.contracts-search-commercial,
.contracts-search-team {
  width: 200px;
}

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
