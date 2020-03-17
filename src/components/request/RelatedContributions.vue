<template>
  <v-card light color="white" class="pb-3">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{ $t("Related contributions") }}</h3>
      <v-spacer></v-spacer>
      <v-btn v-if="canEdit" color="primary" fab small dark @click="showEditForm = true">
        <v-icon>edit</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <EditContributionStatus
      v-for="contribution in contributions"
      :contribution="contribution"
      :showTitle="true"
      :key="contribution._id"
      class="noshadow"
    ></EditContributionStatus>
    <EditRelatedContributions
      :ticketId="ticketId"
      :contributions="contributions"
      :show="showEditForm"
      @close="showEditForm = false"
      @updated="updateHandler"
    ></EditRelatedContributions>
  </v-card>
</template>

<script>
import { USER_TYPE } from "@/constants";
import EditRelatedContributions from "@/components/request/EditRelatedContributions";
import EditContributionStatus from "@/components/contribution/EditContributionStatus";

export default {
  name: "relatedContributions",
  props: {
    contributions: null,
    ticketId: null
  },
  data() {
    return {
      showEditForm: false
    };
  },
  computed: {
    canEdit() {
      return this.$auth.check(USER_TYPE.ADMIN) || this.$auth.check(USER_TYPE.EXPERT);
    }
  },
  methods: {
    updateHandler() {
      this.showEditForm = false;
      this.$emit("update");
    }
  },
  components: {
    EditRelatedContributions,
    EditContributionStatus
  }
};
</script>

<style lang="stylus">
.noshadow {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
</style>
