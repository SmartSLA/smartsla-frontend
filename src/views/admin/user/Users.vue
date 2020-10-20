<template>
  <v-container class="pa-0" v-if="$auth.ready() && $auth.check('admin')">
    <span class="users-search-span hidden-sm-and-down">{{ $t("Search by:") }}</span>
    <v-layout row wrap>
      <v-flex xs6 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-text-field v-model="search" :placeholder="$i18n.t('Name')" single-line hide-details solo> </v-text-field>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-select
          solo
          :items="clients"
          v-model="client"
          hide-details
          :label="$t('Client')"
          item-text="name"
          item-value="_id"
        ></v-select>
      </v-flex>
      <v-flex xs6 sm4 md4 lg4 xl4 pr-1 mb-1>
        <v-select solo :items="roles" v-model="role" hide-details :label="$i18n.t('Roles')"></v-select>
      </v-flex>
    </v-layout>
    <v-layout justify-end>
      <v-btn flat @click="resetFilters">
        <v-icon class="mr-2">refresh</v-icon>
        {{ $i18n.t("reset") }}
      </v-btn>

      <v-btn flat :to="{ name: 'NewUser' }">
        <v-icon class="mr-2">add_circle</v-icon>
        {{ $t("Add user") }}
      </v-btn>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="usersList"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      class="elevation-1"
      :search="search"
      :rows-per-page-text="$t('Rows per page:')"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ $t(capitalize(props.item.type)) }}</td>
        <td class="text-xs-center">
          <router-link :to="{ name: 'User', params: { id: props.item.user } }" class="blue-color">
            <div v-if="props.item.isdisabled == 'yes'">
              <strike>{{ props.item.name }}</strike>
            </div>
            <div v-else>{{ props.item.name }}</div>
          </router-link>
        </td>
        <td class="text-xs-center">{{ capitalize($t(props.item.role)) }}</td>
        <td class="text-xs-center user-mail blue-color">{{ props.item.email }}</td>
        <td class="text-xs-center">
          <a :href="`tel://${props.item.phone}`">
            {{ props.item.phone }}
          </a>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { USER_ROLES } from "@/constants.js";
import { capitalize } from "lodash";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      client: null,
      contract: null,
      role: null,
      relations: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        rowsPerPage: 10
      },
      headers: [
        {
          text: this.$i18n.t("Type"),
          value: "type",
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Name"),
          value: "name",
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Role"),
          value: "role",
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("E-mail"),
          value: "email",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Phone"),
          value: "phone",
          sortable: false,
          class: "text-xs-center"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      contracts: "contract/getContracts",
      clients: "client/getClients",
      users: "users/getUsers"
    }),

    roles() {
      return [...USER_ROLES.expert, ...USER_ROLES.beneficiary];
    },

    usersList() {
      let users = [...(this.users || [])];

      if (this.client) {
        users = users.filter(user => user.client && user.client === this.client);
      }

      if (this.role) {
        users = users.filter(user => user.role && user.role === this.role);
      }

      return users;
    }
  },
  methods: {
    resetFilters() {
      this.client = this.role = this.search = this.contract = null;
    },

    capitalize(term) {
      return capitalize(term);
    }
  },
  mounted() {
    this.$store.dispatch("users/fetchUsers");
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
.elevation-1 th {
  color: #000000;
}

.page-title {
  color: #777777;
  margin-bottom: 20px;
}

.container.fluid.fill-height {
  padding: 50px;
  width: 100%;
  max-width: 100%;
}

.layout.justify-center.align-center > div {
  width: 100%;
}

.users-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.users-filter-field {
  padding-right: 10px !important;
  width: 200px;
}

.users-search {
  display: inline-flex !important;
  margin-bottom: 20px;
}

.v-input.users-search-name, .v-input.users-search-client {
  margin-right: 20px !important;
}

.user-mail {
  font-weight: bold !important;
}

.users-operations a {
  margin-left: 20px;
}

.users-operations {
  margin: 10px;
  margin-left: 50px !important;
  display: flex;
}

.users-actions {
  text-decoration: none !important;
  display: flex;
}

.users-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.users-search {
  width: 100%;
}
</style>
