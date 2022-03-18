<template>
  <user-profile></user-profile>
</template>

<script>
import userProfile from "@/components/user/userProfile.vue";
export default {
  metaInfo() {
    return {
      title: this.$i18n.t("User")
    };
  },
  name: "user",
  components: {
    userProfile: userProfile
  }
};
</script>
