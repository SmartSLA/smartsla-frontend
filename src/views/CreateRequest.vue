<template>
  <v-content >
    <div>
      <v-icon>create</v-icon>
      <span>Create request</span>
    </div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="elevation-12">
            <!-- <v-toolbar color="primary">
              <v-toolbar-title class="white--text">{{ $t("Create new request") }}</v-toolbar-title>
            </v-toolbar> -->
            <v-card-text>
              <v-form>
                <div class="float-left">
                  <v-select
                    prepend-icon="report"
                    v-model="select"
                    :severity="severity"
                    label="Severity"
                  ></v-select>
                  <v-select
                    prepend-icon="laptop"
                    v-model="select"
                    :logiciel="logiciel"
                    label="Software"
                  ></v-select>
                  <v-text-field
                    prepend-icon="warning"
                    name="Request name"
                    :label="$t('Request name')"
                    type="text"
                  ></v-text-field>
                  <v-textarea
                    prepend-icon="notes"
                    name="request-description"
                    label="Request Description"
                  ></v-textarea>
                </div>
                <v-divider vertical />
                <div class="float-right">
                  <file-upload
                    prepend-icon="cloud_upload"
                    class="file"
                    :url="url"
                    :thumb-url="thumbUrl"
                    :headers="headers"
                    @change="onFileChange"
                    btn-label="Select a file"
                    btn-uploading-label="Uploading file"
                  ></file-upload>
                  <v-text-field
                    prepend-icon="attach_file"
                    name="Related request"
                    :label="$t('Related request')"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="library_books"
                    name="Version"
                    :label="$t('Version')"
                    type="text"
                  ></v-text-field>
                  <v-select
                    prepend-icon="bug_report"
                    v-model="select"
                    :environnement="environnement"
                    label="Environnement"
                  ></v-select>
                </div>
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
      this.$http.createTicket({});
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
.float-left {
  float: left;
  width: 50%;
  padding: 20px;
}
.float-right {
  float: right;
  width: 50%;
  padding: 20px;
}
.file-upload .input-wrapper .file-upload-label {
  color: #949494 !important;
  background-color: aliceblue;
}
.v-content {
  padding: 40px 0px 0px 150px !important;
}
</style>
