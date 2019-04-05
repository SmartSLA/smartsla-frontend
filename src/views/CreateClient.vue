<template>
  <v-content>
    <div>
      <v-icon>create</v-icon>
      <span>Create Client</span>
    </div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form>
                <div class="float-left">
                  <v-text-field name="Name" :label="$t('Name')" v-model="clientName" type="text"></v-text-field>
                  <v-textarea name="adresse" label="Adresse"></v-textarea>
                </div>
                <v-divider vertical />
                <div class="float-right">
                  <v-checkbox :label="`Inactive`"></v-checkbox>
                  <file-upload
                    class="file"
                    :url="url"
                    :thumb-url="thumbUrl"
                    :headers="headers"
                    @change="onFileChange"
                    btn-label="Logo"
                    btn-uploading-label="Logo"
                  ></file-upload>
                  <v-text-field name="access-code" :label="$t('Access Code')" type="text"></v-text-field>
                  <v-text-field name="help-access" :label="$t('Help access')" type="text"></v-text-field>
                </div>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="submit">{{ $t("Validate") }}</v-btn>
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
      clientName: "",
      select: null,
      states: ["Item 1", "Item 2", "Item 3", "Item 4"],
      scale_states: ["Item 1", "Item 2", "Item 3", "Item 4"]
    };
  },
  methods: {
    submit() {
      this.$http.createClient({shortName: this.clientName}).then(response => {
        console.log(response);
      })
      .catch( err => {
        console.log(err);
      })
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
    this.$store.dispatch("sidebar/setSidebarComponent", "main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
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
