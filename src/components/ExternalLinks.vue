<template>
  <v-layout column class="links">
    <v-layout row align-center justify-space-between :key="index" v-for="(link, index) in links">
      <v-flex xs4 mr-3>
        <v-text-field
          :label="$t('Link name')"
          v-model="link.name"
          :rules="[name => !!name || $i18n.t('Required field')]"
        ></v-text-field>
      </v-flex>
      <v-flex xs6>
        <v-text-field
          :label="$t('External link')"
          v-model="link.url"
          :rules="[link => (!!link && isUrl(link)) || $i18n.t('Required field')]"
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn @click="removeRow(index)" flat icon color="red">
          <v-icon>cancel</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <div>
      <slot></slot>
    </div>
  </v-layout>
</template>

<script>
export default {
  props: {
    externalLinks: {
      type: Array
    }
  },
  computed: {
    links() {
      return this.externalLinks;
    }
  },
  methods: {
    isUrl(uri) {
      const pattern = /(http|https|ftp):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/;
      if (uri) {
        return pattern.test(uri);
      }
      return true;
    },
    removeRow(index) {
      this.$emit("remove-link", index);
    }
  }
};
</script>

<style lang="stylus" scoped>
.links .v-btn {
  text-transform: initial;
}
</style>
