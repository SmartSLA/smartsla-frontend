<template>
  <div class="locale-changer">
    <v-select v-model="$i18n.locale" :items="langs" small flat> </v-select>
  </div>
</template>

<script>
export default {
  name: "language-switcher",
  data() {
    return { langs: ["fr", "en"] };
  }
};
</script>
