<template>
  <v-autocomplete
    :items="timezones"
    :placeholder="$i18n.t('Search timezone')"
    item-text="name"
    item-value="name"
    flat
    return-object
    :value="timezone"
    @change="setTimezone"
    :rules="[value => !!value || this.$i18n.t('Required field')]"
  >
  </v-autocomplete>
</template>

<script>
import { DATETIME_TIMEZONE } from "@/components/timezone-picker/timezone-data.js";

export default {
  name: "timezone-picker",
  props: { timezone: String },
  data: () => ({
    timezones: DATETIME_TIMEZONE
  }),
  methods: {
    setTimezone({ value }) {
      this.$emit("update:timezone", value);
    }
  }
};
</script>
<style lang="stylus"></style>
