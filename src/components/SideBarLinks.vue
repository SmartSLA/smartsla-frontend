<template>
  <v-list class="grey lighten-5 grey--text body-1">
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">mdi-comment-question-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("FAQ") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">mdi-file-document</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("watches") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">mdi-lightbulb-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title class="body-1">{{ $t("tips and tricks / best practices") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">mdi-forum-outline</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("Forums") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">person</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ $t("User clubs") }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile @click="link">
      <v-list-tile-action>
        <v-icon color="grey">mdi-tie</v-icon>
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
