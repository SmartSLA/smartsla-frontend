<template>
  <v-breadcrumbs :items="items">
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    RemoveLastDirectoryPartOf(pathArray, item) {
      const pathArrayClone = pathArray.slice(0);
      const path = pathArrayClone.splice(0, pathArrayClone.indexOf(item) + 1);
      return path.join("/");
    },
    getBreadcrumbsItems() {
      let breadcrumbsItems = [];
      let pathArray = this.$route.path.split("/").filter(pathItems => pathItems.length !== 0);

      pathArray.map(item =>
        breadcrumbsItems.push({
          text: item === this.$route.params.id ? this.getIdName(this.$route.name) : this.$t(`Breadcrumb-${item}`),
          to: { path: `/${this.RemoveLastDirectoryPartOf(pathArray, item)}` },
          exact: true
        })
      );
      breadcrumbsItems[breadcrumbsItems.length - 1].disabled = true;

      return breadcrumbsItems;
    },
    getIdName(routeName) {
      const storeRoutes = {
        User: "users/getUserById",
        UserEdit: "users/getUserById",
        Profile: "users/getUserById",
        EditProfile: "users/getUserById",
        Team: "team/getTeamById",
        TeamEdit: "team/getTeamById",
        Client: "client/getClientById",
        EditClient: "client/getClientById",
        Contract: "contract/getContractById",
        EditContractInformation: "contract/getContractById",
        EditContractEngagements: "contract/getContractById",
        EditContractSoftwares: "contract/getContractById",
        Software: "software/getSoftwareById",
        EditSoftware: "software/getSoftwareById"
      };

      const item = this.$store.getters[storeRoutes[routeName]](this.$route.params.id);

      return (item && item.name) || this.$route.params.id;
    }
  },
  computed: {
    items() {
      return this.getBreadcrumbsItems();
    }
  }
};
</script>
<style>
.v-breadcrumbs li {
  padding: 0 3px !important;
}
</style>
