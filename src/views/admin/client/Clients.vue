<template>
  <v-container v-if="$auth.ready() && $auth.check('admin')">
    <div class="clients-list">
      <v-layout row wrap pb-4>
        <v-flex xs12 xl-1 lg-1 md1 sm12 mt-2>
          {{ $t("Search by:") }}
        </v-flex>
        <v-flex xs12 xl-4 lg-4 md4 sm12 pr-1 mb-1>
          <v-text-field solo v-model="search" :placeholder="$i18n.t('Name')" single-line hide-details flat>
          </v-text-field>
        </v-flex>
        <v-flex xs12 xl-4 lg-4 md4 sm12 pr-1 mb-1>
          <v-select
            solo
            :items="statusList"
            item-text="label"
            item-value="value"
            v-model="status"
            hide-details
            :label="$i18n.t('Status')"
            :no-data-text="$i18n.t('No data available')"
          ></v-select>
        </v-flex>
        <v-flex xs12 lg-3 xl-3 md3 sm12>
          <div class="ml-4 pt-3">
            <a href="#" class="clients-actions">
              <v-icon>add_circle</v-icon>
              <router-link :to="{ name: 'NewClient' }" class="blue-color">{{ $t("Add client") }}</router-link>
            </a>
          </div>
        </v-flex>
      </v-layout>
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
          </td>
          <td class="text-xs-center">{{ props.item.active ? $t("Yes") : $t("No") }}</td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
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

.container.fluid.fill-height {
  padding: 50px;
  width: 100%;
  max-width: 100%;
}

.layout.justify-center.align-center > div {
  width: 100%;
}

.clients-actions {
  text-decoration: none !important;
  display: flex;
}

.clients-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

a.clients-actions:nth-child(1) > a:nth-child(2) {
  padding-left: 3px;
  padding-top: 3px;
}
</style>
