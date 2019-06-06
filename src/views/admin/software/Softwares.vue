<template>
  <div v-if="$auth.ready() && $auth.check('admin')">
    <div class="softwares-list">
      <div class="page-title">
        <span>{{ $i18n.t("Softwares list") }}</span>
      </div>
      <div class="softwares-search">
        <span class="softwares-search-span">{{ $i18n.t("Search by:") }}</span>
        <v-text-field
          v-model="search"
          :placeholder="$t('Search')"
          single-line
          hide-details
          solo
          class="softwares-search-name"
        ></v-text-field>
        <div class="softwares-operations">
          <router-link :to="{ name: 'NewSoftware' }" class="softwares-actions">
            <v-icon>add_circle</v-icon>
            <span>{{ $i18n.t("Add Software") }}</span>
          </router-link>
          <a href="#" class="softwares-actions">
            <v-icon>arrow_downward</v-icon>
            <span>{{ $i18n.t("Export") }}</span>
          </a>
        </div>
      </div>
      <v-data-table
        :headers="headers"
        :items="softwares"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        class="elevation-1"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.logo }}</td>
          <td class="text-xs-center">
            <router-link :to="{ name: 'Software', params: { id: 15 } }">{{ props.item.name }}</router-link>
          </td>
          <td class="text-xs-center">{{ props.item.description }}</td>
          <td class="text-xs-center">{{ props.item.technologies }}</td>
          <td class="text-xs-center">{{ props.item.group }}</td>
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
          text: "Description",
          value: "description",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: "Tehcnologies",
          value: "technologies",
          sortable: false,
          class: "text-xs-center"
        },
        {
          text: "Group",
          value: "group",
          sortable: false,
          class: "text-xs-center"
        }
      ],
      softwares: []
    };
  },
  mounted() {
    this.$http
      .listSoftware()
      .then(response => {
        this.softwares = response.data;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("failed to fetch software list"),
          color: "error"
        });
      });
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "software");
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

.softwares-list {
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

.softwares-search-span {
  padding-top: 15px;
  width: 150px;
  color: #777;
}

.softwares-search-name, .softwares-search-contact {
  width: 300px;
}

.softwares-search {
  display: inline-flex !important;
  margin-bottom: 24px;
}

.v-input.softwares-search-name, .v-input.softwares-search-contact {
  margin-right: 20px !important;
}

.user-mail {
  color: #2196f3 !important;
  font-weight: bold !important;
}

.softwares-operations a {
  margin-left: 20px;
}

.softwares-operations {
  margin: 10px;
  margin-left: 100px !important;
  display: flex;
}

.softwares-actions {
  text-decoration: none !important;
  display: flex;
}

.softwares-actions span {
  margin-top: 3.75px;
  margin-left: 2px;
}

.softwares-search {
  width: 100% !important;
}
</style>
