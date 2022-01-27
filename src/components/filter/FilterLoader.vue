<template>
  <v-toolbar flat dense>
    <v-layout align-center justify-end>
      <v-overflow-btn
        :items="filters"
        :label="$t('Values')"
        v-model="storedSelectionsFilterHolder"
        hide-selected
        hide-details
        class="truncated pa-0"
        overflow
        flat
        return-object
        item-text="name"
        item-value="name"
      ></v-overflow-btn>
      <v-tooltip top v-if="!!filters.length">
        <template v-slot:activator="{ on }">
          <v-toolbar-side-icon v-on="on" @click="loadFilter">
            <v-btn :dark="canAddFilter" color="primary" fab small :disabled="!canAddFilter">
              <v-icon>add</v-icon>
            </v-btn>
          </v-toolbar-side-icon>
        </template>
        <span>
          {{ $t("This button allows you to load a saved filter") }}
        </span>
      </v-tooltip>
    </v-layout>
  </v-toolbar>
</template>
<script>
export default {
  name: "FilterLoader",
  props: {
    savedFilters: null
  },
  computed: {
    filters() {
      return this.savedFilters || [];
    },
    canAddFilter() {
      return !!this.storedSelectionsFilterHolder;
    }
  },
  data() {
    return {
      storedSelectionsFilterHolder: null
    };
  },
  methods: {
    loadFilter() {
      this.$emit("filterLoaded", this.storedSelectionsFilterHolder);
      this.storedSelectionsFilterHolder = null;
    }
  }
};
</script>
