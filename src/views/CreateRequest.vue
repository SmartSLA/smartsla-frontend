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
                <v-layout wrap row>
                  <v-flex xs6>
                    <v-text-field prepend-icon="warning" name="Title" :label="$t('Title')" type="text"></v-text-field>
                  </v-flex>
                  <v-flex xs6></v-flex>
                  <v-flex xs8>
                    <v-layout row wrap>
                      <v-flex xs3>
                        <v-select prepend-icon="storage" :items="types" v-model="type" label="Type"></v-select>
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs3>
                        <v-select
                          prepend-icon="report"
                          :items="severityList"
                          v-model="severity"
                          label="Severity"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs4></v-flex>
                  <v-flex xs8>
                    <v-layout row wrap>
                      <v-flex xs3>
                        <v-autocomplete
                          :items="softwareList"
                          :label="$t('Software')"
                          prepend-icon="laptop"
                          background-color="white"
                          :search-input.sync="software"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs3>
                        <v-text-field
                          :label="$t('Version')"
                          prepend-icon="mdi-counter"
                          background-color="white"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs3>
                        <v-autocomplete
                          :items="osList"
                          :label="$t('OS')"
                          prepend-icon="mdi-package-variant-closed"
                          background-color="white"
                          :search-input.sync="os"
                        ></v-autocomplete>
                      </v-flex>
                      <v-flex xs1></v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-input prepend-icon="notes">
                      <vue-editor placeholder="Description" v-model="description"></vue-editor>
                    </v-input>
                  </v-flex>

                  <v-flex xs6>
                    <v-layout>
                      <v-flex xs4>
                        <v-select
                          prepend-icon="link"
                          class="mr-0"
                          :items="linkTypes"
                          :label="$t('linking types')"
                          v-model="searchCriteria"
                          single-line
                          hide-details
                          solo
                        ></v-select>
                      </v-flex>
                      <v-flex xs6 class="pl-0">
                        <v-select
                          v-model="chips"
                          :items="relatedRequests"
                          :label="$t('Related requests')"
                          solo
                          multiple
                          class="pt-0"
                        >
                          <template v-slot:append-outer>
                            <v-btn solo class="ml-0 white black--text mt-0 full-height">
                              <v-icon dark>add</v-icon>
                            </v-btn>
                          </template>
                        </v-select>
                      </v-flex>
                      <v-flex xs2></v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs6></v-flex>
                  <v-flex xs10 class="pl-4">
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
import Vue from "vue";
import FileUpload from "v-file-upload";
import { VueEditor } from "vue2-editor";

Vue.use(FileUpload);
export default {
  data() {
    return {
      chips: "",
      searchCriteria: "",
      linkTypes: ["type1", "type2", "type3"],
      description: "",
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
      os: "",
      type: "",
      severityList: ["Blocking", "Major", "Minor"],
      softwareList: [
        "APIMan v1.2 CentOs 6",
        "APIMan v1.2 CentOs 7",
        "APIMan v1.3 CentOs 7",
        "APIMan v1.5 CentOs 7",
        "Apache v2.3 Ubuntu 15.0",
        "Apache v2.3 Ubuntu 16.04",
        "Apache v2.4 Ubuntu 15.0",
        "Apache v2.4 Ubuntu 16.04",
        "Redis v3.0 Ubuntu 16.04",
        "Redis v4.0 Ubuntu 16.04",
        "Tomcat v7.0 CentOs 6",
        "Tomcat v7.0 CentOs 7",
        "Tomcat v8.0 CentOs 6",
        "Tomcat v8.0 CentOs 7"
      ],
      osList: ["Linux", "Windows", "Mac OS"],
      types: ["type1", "type2", "type3", "type4"],
      relatedRequests: ["issue1", "issue3", "issue18", "issue41", "issue35", "issue70"]
    };
  },
  components: {
    VueEditor
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

<style lang="stylus" scoped>
.add-link
  height: 48px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
.full-height
  height: 100%;
.float-left
  float: left;
  width: 50%;
  padding: 20px;
.float-right
  float: right;
  width: 50%;
  padding: 20px;
.v-content
  padding: 0px 0px 0px 0px !important;
.elevation-12
  -webkit-box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14),
    0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0px 1px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 1px rgba(0, 0, 0, 0.14),
    0px 1px 1px 1px rgba(0, 0, 0, 0.12) !important;
  widows: 100%;
.container.fluid.fill-height
  margin: 0px;
  padding: 10px;
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat)
  background-color: #2196f3;
  color: #fff;
.file-upload .input-wrapper
  background-color: #eee !important;
  height: 50px !important;
  width: 150px !important;
.file-upload .input-wrapper .file-upload-label
  color: rgba(0, 0, 0, 0.54) !important;
.file-upload .input-wrapper .file-upload-label .file-upload-icon
  float: left !important;
  font-size: 30px !important ;
.file-upload .input-wrapper:hover
  background-color: #eee !important;
.elevation-12.v-card.v-sheet.theme--light
  height: 450px !important;
.v-card__actions
  padding-top: 80px;
.quillWrapper,
.ql-editor
  width: 100%;
#openpaas
> div.application--wrap
> div
> main
> div
> div
> div
> main
> div
> div.container.fluid.fill-height
> div
> div
> div
> div.v-card__text
> form
> div
> div:nth-child(7)
> div
> div.flex.pl-0.xs6
> div
> div.v-input__append-outer
  height: 48px;
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  margin-left: 0px;
</style>