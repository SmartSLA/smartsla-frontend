<template>
  <v-content class="create-ticket">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form>
            <div class="page-title">
              <v-icon>create</v-icon>
              <span>Create request</span>
            </div>
                <div class="float-left">
                  <v-select prepend-icon="report" :items="severity" v-model="select" label="Standard"></v-select>
                  <v-autocomplete
                    v-model="model"
                    :items="logiciel"
                    :loading="isLoading"
                    :search-input.sync="search"
                    item-text="Description"
                    item-value="API"
                    label="Software"
                    placeholder="Start typing to Search"
                    prepend-icon="laptop"
                    return-object
                  ></v-autocomplete>

                  <v-text-field
                    prepend-icon="warning"
                    name="Request name"
                    :label="$t('Request name')"
                    type="text"
                  ></v-text-field>
                  <v-textarea prepend-icon="notes" name="request-description" label="Request Description"></v-textarea>
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

                  <v-autocomplete
                    v-model="model"
                    :items="environnement"
                    :loading="isLoading"
                    :search-input.sync="search"
                    item-text="Description"
                    item-value="API"
                    label="Environnement"
                    placeholder="Start typing to Search"
                    prepend-icon="bug_report"
                    return-object
                  ></v-autocomplete>
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
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "new-request-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
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
    },
  }
};
</script>


<style type="text/css" scoped>
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
.create-ticket {
  padding: 0px !important;
  margin: 0px !important;
}
.page-title {
  padding: 20px;
}
.container.fluid.fill-height {
  padding: 0px;
}
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #2196f3;
  color: #fff;
}
.elevation-12 {
    -webkit-box-shadow: 0px 1px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 1px rgba(0,0,0,0.14), 0px 1px 1px 1px rgba(0,0,0,0.12) !important;
    box-shadow:  0px 1px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 1px rgba(0,0,0,0.14), 0px 1px 1px 1px rgba(0,0,0,0.12) !important;
}
</style>
