<template>
  <v-layout class="mt-4 pb-2" row wrap align-center>
    <v-dialog v-model="show" scrollable :fullscreen="$vuetify.breakpoint.xs" persistent max-width="600px">
      <v-card>
        <v-card-title class="light-blue lighten-1">
          <span class="title white--text">{{ $t("Related contributions") }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="cancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p class="font-italic">
            {{ $t("This feature allows you to manage contributions related to this ticket.") }}
          </p>
          <v-layout row wrap class="pt-4">
            <v-flex xs10>
              <v-autocomplete
                v-model="relatedContribution"
                :disabled="loading"
                :items="allowedContributionList"
                item-text="name"
                prepend-icon="link"
                :placeholder="$i18n.t('Related contribution')"
                return-object
              >
                <template v-slot:selection="data">
                  {{ `#${data.item._id} - ${data.item.name}` }}
                </template>
                <template v-slot:item="data">
                  {{ `#${data.item._id} - ${data.item.name}` }}
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs2 class="pt-2">
              <v-btn :disabled="!relatedContribution" @click="addRelatedContribution" icon>
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
            <v-divider></v-divider>
            <v-chip
              v-for="related in relatedContributionList"
              :key="related._id"
              close
              @input="removeRelatedContribution(related._id)"
            >
              <v-avatar>
                <router-link
                  :to="{ name: routeNames.CONTRIBUTION, params: { id: related._id } }"
                  target="_blank"
                  class="action-links"
                >
                  <v-icon small>open_in_new</v-icon>
                </router-link>
              </v-avatar>
              {{ `#${related._id} - ${related.name}` }}
            </v-chip>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="light-blue" flat @click="updateRelatedContributions">{{ $t("Submit") }}</v-btn>
          <v-btn color="red lighten-2" flat @click="cancel">{{ $t("Cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { mapGetters } from "vuex";
import { routeNames } from "@/router";

export default {
  name: "editRelatedContributions",
  props: {
    ticketId: null,
    contributions: null,
    show: false
  },
  data() {
    return {
      loading: false,
      relatedContribution: null,
      relatedContributionList: []
    };
  },
  methods: {
    cancel() {
      this.$emit("close");
    },

    addRelatedContribution() {
      this.relatedContributionList.push(Object.assign({}, this.relatedContribution));
      this.relatedContribution = null;
    },

    updateRelatedContributions() {
      const contributionIds = this.relatedContributionList.map(contribution => contribution._id);

      this.$store
        .dispatch("ticket/updateRelatedContributions", {
          ticketId: this.ticketId,
          contributions: contributionIds
        })
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Related contributions updated")
          });

          this.$emit("updated");
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "error",
            message: this.$i18n.t("Failed to update related contributions")
          });
        });
    },

    removeRelatedContribution(contributionId) {
      this.relatedContributionList = this.relatedContributionList.filter(
        contribution => contribution._id !== contributionId
      );
    }
  },
  computed: {
    ...mapGetters({
      contributionList: "contribution/getContributions"
    }),

    allowedContributionList() {
      return this.contributionList.filter(
        contribution => !this.relatedContributionList.filter(related => contribution._id === related._id).length
      );
    },

    routeNames() {
      return routeNames;
    }
  },
  mounted() {
    this.loading = true;
    this.$store
      .dispatch("contribution/fetchContributions")
      .catch(() => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("Error while loading contributions"),
          color: "error"
        });
      })
      .finally(() => {
        this.loading = false;
      });

    (this.contributions || []).map(contribution => {
      this.relatedContributionList.push(Object.assign({}, contribution));
    });
  }
};
</script>

<style lang="stylus" scoped>
.action-links {
  text-decoration: none;
  color: grey;
  cursor: pointer;
}
</style>
