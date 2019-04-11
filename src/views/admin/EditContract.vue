<template>
  <v-container class="pt-0 pl-0 pr-4">
    <span class="title grey--text">{{ $t("Edit contract") }}</span>
    <component :is="editSectionComponent"></component>
  </v-container>
</template>

<script>
import EditContractInformation from "@/components/admin/contract/EditInformation.vue";
import EditContractHR from "@/components/admin/contract/EditHR.vue";
import EditContractSoftware from "@/components/admin/contract/EditSoftware.vue";
import EditContractEngagements from "@/components/admin/contract/EditEngagements.vue";
export default {
  name: "edit-contract",
  components: {
    "edit-contract-information": EditContractInformation,
    "edit-contract-hr": EditContractHR,
    "edit-contract-software": EditContractSoftware,
    "edit-contract-engagements": EditContractEngagements
  },
  data() {
    return {
      editSectionComponent: ""
    };
  },
  created() {
    switch (this.$route.params.section) {
      case "information":
        this.editSectionComponent = "edit-contract-information";
        break;
      case "hr":
        this.editSectionComponent = "edit-contract-hr";
        break;
      case "software":
        this.editSectionComponent = "edit-contract-software";
        break;
      case "engagements":
        this.editSectionComponent = "edit-contract-engagements";
        break;

      default:
        break;
    }
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
    this.$store.dispatch("sidebar/setActiveAdminMenu", "contracts");
  },
  methods: {
    edit() {
      return;
    }
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
</style>
