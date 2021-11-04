<template>
  <v-chip :color="SUPPORT_ACCOUNT.color" class="truncate-capitalize ma-2" label text-color="white">
    {{ SUPPORT_ACCOUNT.name }}
  </v-chip>
</template>

<script>
import ApplicationSettings from "@/services/application-settings";
export default {
  name: "support-account",
  data() {
    return {
      SUPPORT_ACCOUNT: ApplicationSettings.SUPPORT_ACCOUNT
    };
  }
};
</script>
<style lang="stylus">
.truncate-capitalize span {
  display: inline-block !important;
  font-size: 0px;
  width: 32px;
  height: 32px;
  padding-top: 5px !important;
}
.truncate-capitalize span::first-letter {
  font-size: 13px;
}
</style>
