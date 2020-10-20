<template>
  <v-container class="pa-0" v-if="$auth.ready() && $auth.check('admin')">
    <span class="teams-search-span hidden-sm-and-down">{{ $t("Search by:") }}</span>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12 xl12 pr-1 mb-1>
        <v-text-field v-model="search" :placeholder="$i18n.t('Search')" single-line hide-details solo></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout justify-end>
      <v-btn flat :to="{ name: 'NewTeam' }">
        <v-icon class="mr-2">add_circle</v-icon>
        {{ $t("Add team") }}
      </v-btn>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="teams"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      class="elevation-1"
      :search="search"
      :rows-per-page-text="$t('Rows per page:')"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">
          <router-link :to="{ name: 'Team', params: { id: props.item._id } }" class="blue-color">{{
            props.item.name
          }}</router-link>
        </td>
        <td class="text-xs-center">{{ props.item.contact }}</td>
        <td class="text-xs-center">{{ props.item.devise }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      search: "",
      contact: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      devise: [],
      headers: [
        {
          text: this.$i18n.t("Name"),
          value: "name",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Contact"),
          value: "contact",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: this.$i18n.t("Devise"),
          value: "devise",
          sortable: false,
          class: "text-xs-center"
        }
      ]
    };
  },
  created() {
    this.$store.dispatch("team/fetchTeams");
  },
  computed: {
    ...mapGetters({
      teams: "team/getTeams"
    })
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

.teams-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.teams-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.teams-search-name, .v-input.teams-search-contact {
  margin-right: 20px !important;
}

.user-mail {
  color: #2195f2 !important;
  font-weight: bold !important;
}

.teams-operations a {
  margin-left: 20px;
}

.teams-operations {
  margin: 10px;
  margin-left: 100px !important;
  display: flex;
}

.teams-actions {
  text-decoration: none !important;
  display: flex;
}

.teams-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.teams-search {
  width: 100%;
}
</style>
