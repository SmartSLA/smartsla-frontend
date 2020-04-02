<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="clients-list">
      <div class="page-title">
        <span>{{ $t("Clients list") }}</span>
      </div>
      <div class="clients-search">
        <span class="clients-search-span">{{ $t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="clients-search-name"
        ></v-text-field>
        <v-select
          solo
          :items="statusList"
          item-text="label"
          item-value="value"
          v-model="status"
          hide-details
          :label="$i18n.t('Status')"
          :no-data-text="$i18n.t('No data available')"
          class="clients-search-status"
        ></v-select>
        <div class="clients-operations">
          <a href="#" class="clients-actions">
            <v-icon>add_circle</v-icon>
            <router-link :to="{ name: 'NewClient' }" class="blue-color">{{ $t("Add client") }}</router-link>
          </a>
        </div>
      </div>
      <div v-if="status" class="clients-filters">
        <v-chip @input="status = null" close>{{ $i18n.t("status") }} : {{ $i18n.t(status) }}</v-chip>
      </div>
      <v-data-table
        :headers="headers"
        :items="clientsList"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
        :rows-per-page-text="$t('Rows per page:')"
      >
        <template slot="items" slot-scope="props">
          <!-- <td class="text-xs-center">{{ props.item.logo }}</td> -->
          <td class="text-xs-center">
            <router-link :to="{ name: 'Client', params: { id: props.item._id } }" class="blue-color">
              <status-name :name="props.item.name" :active="props.item.active" />
            </router-link>
            <expired-label
              :expirationDate="props.item.endDate"
              :status="props.item.active"
              :haveAStatus="true"
            ></expired-label>
          </td>
          <td class="text-xs-center">{{ props.item.active ? $t("Yes") : $t("No") }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import ExpiredLabel from "@/components/ExpiredLabel.vue";
import StatusName from "@/components/StatusName";
import { mapGetters } from "vuex";
import { CLIENT_STATUS } from "@/constants.js";

export default {
  data() {
    return {
      search: "",
      status: null,
      statusList: [
        { label: this.$i18n.t(CLIENT_STATUS.ACTIVE), value: CLIENT_STATUS.ACTIVE },
        { label: this.$i18n.t(CLIENT_STATUS.INACTIVE), value: CLIENT_STATUS.INACTIVE }
      ],
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        rowsPerPage: 10
      },
      roles: [],
      headers: [
        // {
        //   text: this.$i18n.t("Logo"),
        //   value: "logo",
        //   sortable: false,
        //   class: "text-xs-center"
        // },
        {
          text: this.$i18n.t("Name"),
          value: "name",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Active"),
          value: "active",
          sortable: false,
          class: "text-xs-center"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      clients: "client/getClients"
    }),
    clientsList() {
      if (this.status) {
        switch (this.status) {
          case CLIENT_STATUS.ACTIVE:
            return this.clients.filter(item => item.active);
          case CLIENT_STATUS.INACTIVE:
            return this.clients.filter(item => !item.active);
        }
      }
      return [...this.clients];
    }
  },
  components: {
    ExpiredLabel,
    StatusName
  },
  created() {
    this.$store.dispatch("client/fetchClients");
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
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

.clients-list {
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

.clients-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.clients-search-name, .clients-search-client, .clients-search-roles {
  width: 300px;
}

.clients-filters,
.clients-filters.clients-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.clients-search-name, .v-input.clients-search-client {
  margin-right: 20px !important;
}

.client-mail {
  color: #2195f2 !important;
  font-weight: bold !important;
}

.clients-operations > a {
  margin-left: 20px;
}

.clients-operations {
  margin: 10px;
  margin-left: 100px !important;
  display: flex;
}

.clients-actions {
  text-decoration: none !important;
  display: flex;
}

.clients-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.clients-search {
  width: 100%;
}

a.clients-actions:nth-child(1) > a:nth-child(2) {
  padding-left: 3px;
  padding-top: 3px;
}
</style>
