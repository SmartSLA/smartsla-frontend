<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="clients-list">
      <div class="page-title">
        <span>{{ $i18n.t("Clients list") }}</span>
      </div>
      <div class="clients-search">
        <span class="clients-search-span">{{ $i18n.t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$i18n.t('Name')"
          single-line
          hide-details
          solo
          class="clients-search-name"
        ></v-text-field>
        <div class="clients-operations">
          <a href="#" class="clients-actions">
            <v-icon>add_circle</v-icon>
            <router-link :to="{ name: 'NewClient' }">{{ $t("Add client") }}</router-link>
          </a>
          <a href="#" class="clients-actions">
            <v-icon>arrow_downward</v-icon>
            <span>Export</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="clients"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.logo }}</td>
          <td class="text-xs-center">
            <router-link :to="{ name: 'Client', params: { id: props.item.id } }">{{ props.item.name }}</router-link>
          </td>
          <td class="text-xs-center">{{ props.item.contracts }}</td>
          <td class="text-xs-center">{{ props.item.access_code }}</td>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clients: [],
      search: "",
      rowsPerPageItems: [10, 25, 50],
      pagination: "10",
      roles: [],
      headers: [
        {
          text: "Logo",
          value: "logo",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: "Name",
          value: "name",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: "Contracts",
          value: "conttracts",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: "Access code",
          value: "access_code",
          sortable: false,
          class: "text-xs-center"
        }
      ]
    };
  },
  mounted() {
    this.$http
      .listClients()
      .then(response => {
        this.clients = response.data;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch clients list"),
          color: "error"
        });
      });
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "clients");
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
  margin-bottom: 20px;
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

.clients-search {
  display: inline-flex !important;
  margin-bottom: 20px;
}

.v-input.clients-search-name, .v-input.clients-search-client {
  margin-right: 20px !important;
}

.client-mail {
  color: #2196f3 !important;
  font-weight: bold !important;
}

.clients-operations a {
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
</style>
