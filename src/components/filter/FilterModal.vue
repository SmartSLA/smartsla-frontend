<template>
  <v-dialog class="d-flex" v-model="open" max-width="500">
    <v-card class="px-0">
      <v-card-title class="headline grey lighten-3" primary-title>
        {{ $t("Save filter") }}
        <v-spacer></v-spacer>
        <v-btn icon @click="onClose()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field :label="$t('Filter name')" v-model="filter"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="saveCustomFilter">{{ $t("save") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "filterModal",
  props: {
    open: false
  },
  data: () => ({
    filter: null
  }),
  computed: {
    additionalFilters() {
      return this.$store.getters["filter/additionalFilters"];
    }
  },
  methods: {
    saveCustomFilter() {
      const userFilter = {
        items: this.additionalFilters,
        name: this.filter,
        user: this.$store.state.currentUser.user._id
      };

      this.$store
        .dispatch("filter/createCustomFilter", userFilter)
        .then(() => {
          this.onClose();
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Filter saved"),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    onClose() {
      this.$emit("closeModalFilter");
    }
  }
};
</script>
