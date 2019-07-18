<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="teams-list">
      <div class="page-title">
        <span>{{ $t("Teams list") }}</span>
      </div>
      <div class="teams-search">
        <span class="teams-search-span">{{ $t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Search')"
          single-line
          hide-details
          solo
          class="teams-search-name"
        ></v-text-field>
        <div class="teams-operations">
          <router-link :to="{ name: 'NewTeam' }" class="teams-actions blue-color">
            <v-icon>add_circle</v-icon>
            <span>{{ $t("Add Team") }}</span>
          </router-link>
          <a href="#" class="teams-actions blue-color">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $t("Export") }}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="teams"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      contact: [],
      rowsPerPageItems: [10, 25, 50],
      pagination: "10",
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
      ],
      teams: []
    };
  },
  mounted() {
    this.$http
      .listTeam()
      .then(response => {
        this.teams = response.data;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch teams"),
          color: "error"
        });
      });
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "teams");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    this.$store.dispatch("sidebar/resetAdminMenu");
    next();
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

.teams-list {
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

.teams-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.teams-search-name, .teams-search-contact, .teams-search-devise {
  width: 300px;
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
