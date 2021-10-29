<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>{{ $t(title) }}</v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex>
              <p class="headline">{{ $t(subTitle) }}</p>
              <p>{{ $t(paragraph) }}</p>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="reason" :label="$t(placeHolder)"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="confirm()">{{ $t("confirm") }}</v-btn>
        <v-btn color="error" @click="cancel()">{{ $t("cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    title: null,
    subTitle: null,
    paragraph: null,
    placeHolder: null,
    reason: null,
    resolve: null,
    reject: null
  }),
  methods: {
    open({ title, placeHolder, subTitle, paragraph }) {
      this.dialog = true;
      this.title = title;
      this.placeHolder = placeHolder;
      this.subTitle = subTitle;
      this.paragraph = paragraph;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.dialog = false;
      this.resolve({
        confirm: true,
        reason: this.reason
      });
    },
    cancel() {
      this.dialog = false;
      this.resolve({
        confirm: false,
        reason: this.reason
      });
    }
  }
};
</script>
