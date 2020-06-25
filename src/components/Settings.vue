<template>
  <v-container class="pt-0 px-0 mx-1 my-3">
    <router-link :to="{ name: 'Users' }">
      <button>
        <v-icon>arrow_back</v-icon>
      </button>
    </router-link>
    <v-layout row justify-center mx-2>
      <v-flex xs12 sm12 md12 lg12 xl12>
        <v-card class="mt-4 pb-4">
          <v-layout row>
            <v-flex xs10 sm10 md10 lg12 ml-2>
              <v-card-title primary-title class="headline font-weight-medium mb-0">{{ $t("Settings") }}</v-card-title>
            </v-flex>
          </v-layout>
          <v-divider class="mx-2"></v-divider>
          <v-layout column mt-3 mx-5>
            <v-select
              v-model="initialLanguage"
              :items="userLanguage"
              item-text="value"
              item-value="key"
              @change="languageSelected"
            />
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from "vuex";
import { LOCALE, SUPPORTED_LOCALES } from "@/i18n/constants";

export default {
  name: "Settings",
  data() {
    return {
      SUPPORTED_LOCALES: SUPPORTED_LOCALES,
      selectedLng: null
    };
  },
  computed: {
    ...mapGetters({
      getUser: "currentUser/getUser",
      currentlySelectedLanguage: "configuration/getUserLanguage"
    }),

    initialLanguage: {
      get: function() {
        const USER_LANGUAGE = localStorage.getItem("userLanguage");
        const LANGUAGE = USER_LANGUAGE || LOCALE;
        return SUPPORTED_LOCALES.find(entry => entry.key === LANGUAGE);
      },

      set: function(value) {
        this.selectedLng = value;
      }
    },
    userLanguage() {
      return SUPPORTED_LOCALES;
    }
  },
  methods: {
    languageSelected() {
      this.$store.dispatch("configuration/setUserLanguage", { lang: this.selectedLng }).then(() => {
        this.$i18n.locale = this.selectedLng;
      });
    }
  }
};
</script>
