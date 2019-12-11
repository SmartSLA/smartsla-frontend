<template>
  <v-list-tile avatar ripple>
    <v-list-tile-avatar class="mr-2">
      <v-progress-circular
        :rotate="-90"
        :size="45"
        :width="4"
        :value="attachment.upload.progress"
        :color="attachment.upload.progress >= 100 ? 'green' : 'primary'"
      >
        {{ attachment.upload.uploading ? attachment.upload.progress : "" }}
      </v-progress-circular>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{ attachment.name }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ attachment.size | prettyBytes }}</v-list-tile-sub-title>
    </v-list-tile-content>
    <v-list-tile-action>
      <v-btn icon ripple class="ma-0" :disabled="attachment.upload.uploading" @click.stop="onClear()">
        <v-icon color="grey lighten-1">clear</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: {
    attachment: Object
  },
  methods: {
    onClear() {
      // TODO: Call OP endpoint to remove file is upload is complete
      this.$emit("remove");
    }
  }
};
</script>
