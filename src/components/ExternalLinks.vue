<template>
  <div>
    <v-layout :key="index" v-for="(link, index) in externalLinks">
      <v-flex pr-5>
        <v-text-field
          :label="$t('Link name')"
          v-model="link.name"
          :rules="[() => link.name.length > 0 || $i18n.t('Required field')]"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          :label="$t('External link')"
          v-model="link.url"
          :rules="[() => link.url.length > 0 || $i18n.t('Required field')]"
        ></v-text-field>
      </v-flex>
      <v-btn @click="removeExternalLink(index)" flat icon color="red">
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-layout>
    <v-layout>
      <v-flex pr-5>
        <v-text-field :label="$t('Link name')" hint="LinShare" v-model="linkName" persistent-hint></v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          :label="$t('External link')"
          hint="https://www.linshare.org/"
          v-model="linkUrl"
          type="url"
          :rules="[v => isUrl(v) || $i18n.t('invalid link')]"
          persistent-hint
        ></v-text-field>
      </v-flex>
      <v-btn :disabled="!(linkName && linkUrl)" @click="addExternalLink" flat icon color="green">
        <v-icon>add_circle</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    externalLinks: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      linkName: "",
      linkUrl: "",
      linkPattern: /(http|https|ftp):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/
    };
  },
  methods: {
    addExternalLink() {
      this.$emit("add-external-link", this.linkName, this.linkUrl);
      this.linkName = this.linkUrl = "";
    },

    isUrl(uri) {
      if (uri) {
        return this.linkPattern.test(uri);
      }
      return true;
    },

    removeExternalLink(index) {
      this.$emit("remove-external-link", index);
    }
  }
};
</script>
