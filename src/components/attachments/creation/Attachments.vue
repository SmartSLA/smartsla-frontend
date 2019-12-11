<template>
  <div>
    <v-list subheader two-line dense>
      <v-subheader inset class="ml-0">
        <v-icon>attach_file</v-icon>
        {{ $t("Attachments") }}
      </v-subheader>
      <template v-for="(attachment, index) in attachments">
        <attachment :attachment="attachment" @remove="removeFile(attachment)" :key="index"></attachment>
        <v-divider v-if="index < attachments.length - 1" :key="`divider${index}`"></v-divider>
      </template>
    </v-list>
    <upload-button
      multiple
      ref="file-upload"
      :title="$t('Attach files')"
      no-title-update
      :disabled="disabled"
      @file-update="setAttachments"
    >
    </upload-button>
  </div>
</template>

<script>
import UploadButton from "vuetify-upload-button";
import Attachment from "./Attachment.vue";

export default {
  props: {
    attachments: {
      type: Array
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    removeFile(file) {
      this.attachments.splice(this.attachments.indexOf(file), 1);
    },

    setAttachments(files) {
      [...files].forEach(file => {
        this.attachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          upload: {
            isComplete: false,
            uploading: false,
            progress: 0
          },
          file
        });
      });
    }
  },
  components: {
    UploadButton,
    Attachment
  }
};
</script>
