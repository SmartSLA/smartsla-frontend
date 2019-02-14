<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="elevation-12">
            <v-toolbar color="primary">
              <v-toolbar-title class="white--text">{{ $t("Create new request") }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-select v-model="select" :severity="severity" label="Severity"></v-select>
                <v-select v-model="select" :logiciel="logiciel" label="Logiciel"></v-select>
                <v-text-field
                  prepend-icon=""
                  name="Request name"
                  :label="$t('Request name')"
                  type="text"
                ></v-text-field>
                <v-textarea name="request-description" label="Request Description"></v-textarea>
                <file-upload
                  class="file"
                  :url="url"
                  :thumb-url="thumbUrl"
                  :headers="headers"
                  @change="onFileChange"
                  btn-label="Select a file"
                  btn-uploading-label="Uploading file"
                ></file-upload>
                <v-text-field
                  prepend-icon=""
                  name="Related request"
                  :label="$t('Related request')"
                  type="text"
                ></v-text-field>
                <v-text-field prepend-icon="" name="Version" :label="$t('Version')" type="text"></v-text-field>
                <v-select v-model="select" :environnement="environnement" label="Environnement"></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="submitRequest" :loading="submitRequest" @click="submit">{{ $t("Submit") }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
//import { routeNames } from "@/router";
import Vue from "vue";
import FileUpload from "v-file-upload";
Vue.use(FileUpload);
export default {
  data() {
    return {
      url: "http://your-post.url",
      headers: { "access-token": "<your-token>" },
      filesUploaded: [],
      submitRequest: false,
      email: null,
      password: null,
      select: null,
      states: ["Item 1", "Item 2", "Item 3", "Item 4"],
      scale_states: ["Item 1", "Item 2", "Item 3", "Item 4"]
    };
  },
  methods: {
    submit() {
      this.submitRequest = false;
    },
    thumbUrl(file) {
      return file.myThumbUrlProperty;
    },
    onFileChange(file) {
      // Handle files like:
      this.fileUploaded = file;
    }
  }
};
</script>
<style type="text/css">
.file-upload .input-wrapper .file-upload-label {
  color: #949494 !important;
  background-color: aliceblue;
}
</style>
