<template>
  <v-content class="create-ticket">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="elevation-12">
            <div class="page-title">
              <v-icon>create</v-icon>
              <span>Create request</span>
            </div>
            <!-- <v-toolbar color="primary">
              <v-toolbar-title class="white--text">{{ $t("Create new request") }}</v-toolbar-title>
            </v-toolbar> -->
            <v-card-text>
              <v-form>
                <div class="float-left">
                  <v-select
                    prepend-icon="report"
                    :items="severity"
                    v-model="select"
                    label="Standard"
                  ></v-select>
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
  data: () => ({
    severity: ["Bloquant", "Non bloquant"],
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null
  }),
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
  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || "n/a"
        };
      });
    },
    logiciel() {
      return this.entries.map(entry => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + "..."
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    }
  },

  watch: {
    search(val) {
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
  padding: 0px 0px 0px 0px !important;
}
.page-title {
  padding: 20px;
}
</style>
