<template>
  <div>
    <v-layout justify-space-between row class="actions_filters">
      <div>
        <ul>
          <li v-for="(filter, key) in customFilters" :key="key" class="chips-elements">
            <v-chip @input="removeFilter(filter)" close
              >{{ $i18n.t(filter.category) }} : {{ $i18n.t(capitalize(filter.value)) }}</v-chip
            >
          </li>
        </ul>
      </div>
    </v-layout>
    <v-dialog v-if="customFilters.length" class="d-flex" v-model="dialog" max-width="500">
      <template v-slot:activator="{ on }">
        <v-layout :justify-center="buttonAttributes.center" :justify-end="buttonAttributes.end">
          <v-btn
            :flat="buttonAttributes.flat"
            :fab="buttonAttributes.fab"
            small
            color="primary"
            v-on="on"
            v-show="isNewFilter || canUpdate"
          >
            <v-icon>add</v-icon>
            <div class="ml-2 hidden-sm-and-down">{{ $i18n.t("Create new filter") }}</div>
          </v-btn>
          <v-btn
            :flat="buttonAttributes.flat"
            :fab="buttonAttributes.fab"
            small
            color="success"
            @click="updateCurrectFilter"
            v-show="canUpdate"
          >
            <v-icon>done</v-icon>
            <div class="ml-2 hidden-sm-and-down">{{ $i18n.t("save") }}</div>
          </v-btn>
          <v-btn
            :flat="buttonAttributes.flat"
            :fab="buttonAttributes.fab"
            small
            color="error"
            @click="deleteDialog = true"
            v-show="canDelete"
          >
            <v-icon>delete</v-icon>
            <div class="ml-2 hidden-sm-and-down">{{ $t("Delete filter") }}</div>
          </v-btn>
          <v-btn :flat="buttonAttributes.flat" :fab="buttonAttributes.fab" small color="warning" @click="resetFilters">
            <v-icon>refresh</v-icon>
            <div class="ml-2 hidden-sm-and-down">{{ $i18n.t("reset") }}</div>
          </v-btn>
        </v-layout>
      </template>

      <v-card class="px-0">
        <v-card-title class="headline grey lighten-3" primary-title>{{ $i18n.t("Save filter") }}</v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field :label="$i18n.t('Filter name')" v-model="newFilterName"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="saveCurrentFilter">{{ $t("Save") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="deleteDialog"
      persistent
      max-width="290"
      v-if="storedSelectionsFilter && storedSelectionsFilter.name"
    >
      <v-card class="px-4 pt-2">
        <v-card-text>
          <span class="body-2"
            >{{ $t("are you sure you want to remove the filter") }} "{{ storedSelectionsFilter.name }}"?</span
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteCurrentFilter">{{ $t("confirm") }}</v-btn>
          <v-btn color="error" @click="deleteDialog = false">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { capitalize } from "lodash";

export default {
  name: "fitlerActions",
  props: {
    customFilters: null,
    storedSelectionsFilter: {},
    canDelete: false,
    canUpdate: false
  },
  data() {
    return {
      deleteDialog: false,
      dialog: false,
      newFilterName: null,
      savedFilters: []
    };
  },
  computed: {
    isNewFilter() {
      return !(this.storedSelectionsFilter && Object.keys(this.storedSelectionsFilter));
    },
    buttonAttributes() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return { fab: true, flat: true, center: true, end: false };
        case "sm":
          return { fab: true, flat: true, center: false, end: true };
        case "md":
        case "lg":
        case "xl":
          return { fab: false, flat: true, center: false, end: true };
      }
    }
  },
  methods: {
    saveCurrentFilter() {
      var filterToSave = {
        name: this.newFilterName,
        items: this.customFilters,
        user: this.$store.state.user.user._id
      };
      this.$http
        .createFilters(filterToSave)
        .then(() => {
          this.dialog = false;
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter saved"),
            color: "success"
          });

          this.$emit("filterCreated");
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    capitalize(value) {
      return capitalize(value);
    },

    deleteCurrentFilter() {
      this.$http
        .deleteFilters(this.storedSelectionsFilter._id)
        .then(() => {
          this.$emit("filterDeleted");
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Filter deleted")
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
      this.deleteDialog = false;
      this.resetFilters();
    },

    updateCurrectFilter() {
      var filterToUpdate = Object.assign({}, this.storedSelectionsFilter);
      filterToUpdate.items = [...this.customFilters];
      this.$http
        .updateFilters(filterToUpdate._id, filterToUpdate)
        .then(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            color: "success",
            message: this.$i18n.t("Filter updated")
          });
          this.$emit("filterUpdated");
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },

    resetFilters() {
      this.$emit("filterReset");
    },

    removeFilter(filter) {
      this.$emit("removeFilter", filter);
    }
  }
};
</script>
<style lang="stylus">
.chips-elements {
  list-style: none;
  float: left;
}
</style>
