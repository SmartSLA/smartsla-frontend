<template>
  <user-profile></user-profile>
</template>

<script>
import userProfile from "@/components/user/userProfile.vue";
export default {
  name: "user",
  components: {
    userProfile: userProfile
  }
};
</script>
