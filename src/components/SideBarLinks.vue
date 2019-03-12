<template>
  <v-list class="side-bar-links">
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>mdi-comment-question-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("FAQ") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>mdi-file-document</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("Watches") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>mdi-lightbulb-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title class="body-1">{{ $t("Tips and tricks / best practices") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>mdi-forum-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("Forums") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>person</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("User clubs") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link" class="side-bar-links-item">
      <v-list-tile-action>
        <v-icon>mdi-tie</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("OBA experts") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>
<script>
export default {
  name: "side-bar-links",
  methods: {
    link() {
      return;
    }
  }
};
</script>
<style type="stylus" scoped>
.side-bar-links,
.side-bar-links-item,
.side-bar-links-item .v-icon {
  background-color: #2b303c;
  color: #ffffff;
}
</style>
