<template>
  <v-combobox
    persistent-hint
    :prepend-icon="icon"
    hide-selected
    :value="mailItems"
    :label="$t(label)"
    multiple
    chips
    @input="update($event)"
  >
    <template slot="selection" slot-scope="{ item, selected, index }">
      <v-chip
        :color="emailValidation[index][0] ? 'default' : 'red'"
        :text-color="emailValidation[index][0] ? '' : 'white'"
        :selected="selected"
        close
        @input="removeItem(item)"
      >
        {{ item }}
      </v-chip>
    </template>
    <template v-slot:item="{ item }">
      <span>{{ item }}</span>
    </template>
  </v-combobox>
</template>

<script>
export default {
  data: () => ({
    emailVerfication: []
  }),
  props: {
    label: { type: String },
    mails: { type: Array },
    icon: { type: String }
  },
  methods: {
    isValidEmail(email) {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

      return regex.test(email);
    },

    removeItem(item) {
      const itemIndex = this.mails.indexOf(item);

      this.$emit("mails:removed", itemIndex);
    },

    update(mailingList) {
      this.$emit("mails:updated", mailingList);
    }
  },
  computed: {
    mailItems() {
      return this.mails;
    }
  },
  watch: {
    mailItems() {
      this.emailValidation = this.mailItems.map(mail => [this.isValidEmail(mail)]);
    }
  }
};
</script>
