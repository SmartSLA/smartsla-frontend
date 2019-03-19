<template>
  <v-content>
    <div>
      <v-icon>create</v-icon>
      <span>{{ $t("New issue") }}</span>
    </div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <v-form>
                <v-layout wrap>
                  <v-flex xs6>
                    <v-select
                      prepend-icon="report"
                      :items="severityList"
                      v-model="severity"
                      label="Severity"
                    ></v-select>
                    <v-select
                      prepend-icon="laptop"
                      :items="softwareList"
                      v-model="software"
                      label="Software"
                    ></v-select>
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
                    <v-text-field prepend-icon="warning" name="Title" :label="$t('Title')" type="text"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea prepend-icon="notes" name="description" label="Description"></v-textarea>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      prepend-icon="attach_file"
                      name="Related request"
                      :label="$t('Related request')"
                      type="text"
                    ></v-text-field>
                    <file-upload
                      prepend-icon="attach_file"
                      class="file"
                      :url="url"
                      :thumb-url="thumbUrl"
                      :headers="headers"
                      @change="onFileChange"
                      btn-label="Attach file"
                      btn-uploading-label="Uploading file"
                    ></file-upload>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout>
                <v-flex xs6 text-xs-right align-end>
                  <v-spacer></v-spacer>
                  <v-btn :disabled="submitRequest" :loading="submitRequest" @click="submit">{{ $t("Submit") }}</v-btn>
                </v-flex>
              </v-layout>
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
      scale_states: ["Item 1", "Item 2", "Item 3", "Item 4"],
      severity: "",
      software: "",
      severityList: ["Blocking", "Major", "Minor"],
      softwareList: ["APIMan v1.2", "Apache v2.4", "Redis v4.0 Ubuntu 16.04", "Tomcat v8.0"]
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
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "new-request-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://api.publicapis.org/entries")
        .then(res => res.json())
        .then(res => {
          const { count, entries } = res;
          this.count = count;
          this.entries = entries;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>
<style scoped type="stylus">
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
.v-content {
  padding: 0px 0px 0px 0px !important;
}
.elevation-12 {
  -webkit-box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14),
    0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14),
    0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  widows: 100%;
}
.container.fluid.fill-height {
  margin: 0px;
  padding: 10px;
}
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #2196f3;
  color: #fff;
}
.file-upload .input-wrapper {
  background-color: #eee !important;
  height: 50px !important;
  width: 150px !important;
}
.file-upload .input-wrapper .file-upload-label {
  color: rgba(0, 0, 0, 0.54) !important;
}
.file-upload .input-wrapper .file-upload-label .file-upload-icon {
  float: left !important;
  font-size: 30px !important ;
}
.file-upload .input-wrapper:hover {
  background-color: #eee !important;
}
.elevation-12.v-card.v-sheet.theme--light {
  height: 450px !important;
}
.v-card__actions {
  padding-top: 80px;
}
</style>
