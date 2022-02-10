<template>
  <v-content id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md5 lg4>
          <v-card>
            <v-layout justify-space-between class="pa-4">
              <v-img contain width="160" max-height="38" class="hidden-sm-and-down" :src="logo" />
              <v-img contain width="140" max-height="30" class="hidden-md-and-up" :src="logo" />
            </v-layout>
            <v-card-title class="login-bar">
              <div>
                <h3 class="title white--text mb-0">{{ $t("Login to your account") }}</h3>
                <p class="white--text">{{ $t("Enter your credentials") }}</p>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form class="login-form" @keydown.native.enter="login">
                <v-text-field
                  class="login-user-input"
                  prepend-icon="person"
                  name="login"
                  :label="$i18n.t('E-mail')"
                  type="text"
                  v-model="email"
                  autofocus
                ></v-text-field>
                <v-text-field
                  class="login-password-input"
                  prepend-icon="lock"
                  name="password"
                  :label="$i18n.t('Password')"
                  id="password"
                  type="password"
                  v-model="password"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="px-3">
              <v-layout justify-space-between>
                <router-link v-if="sspEnabled" :to="{ name: routeNames.RESET_PASSWORD }" target="_blank">
                  {{ $t("Reset Password") }}
                </router-link>
                <v-spacer></v-spacer>
                <v-btn :disabled="logMeIn" :loading="logMeIn" @click="login">{{ $t("Login") }}</v-btn>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { routeNames } from "@/router";
import ApplicationSettings from "@/services/application-settings";

export default {
  data() {
    return {
      logMeIn: false,
      email: null,
      password: null,
      features: ApplicationSettings.FEATURES
    };
  },
  computed: {
    routeNames() {
      return routeNames;
    },
    sspEnabled() {
      return this.features.SSP_ENABLED;
    },
    defaultCompany() {
      return ApplicationSettings.SUPPORT_ACCOUNT;
    },
    logo() {
      return require("@/assets/" + this.defaultCompany.logo);
    }
  },
  methods: {
    login() {
      const redirectTo = this.$auth.redirect();

      this.logMeIn = true;
      this.$auth
        .login({
          url: "api/jwt/generate",
          auth: {
            username: this.email,
            password: this.password
          },
          rememberMe: false,
          redirect: redirectTo ? { path: redirectTo.from.path } : { name: routeNames.HOME }
        })
        .then(response => {
          this.$store.dispatch("session/setJWTToken", response.data);
          this.$store.dispatch("currentUser/fetchUser");

          return response.data;
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("Login error, please retry")
          });
        })
        .finally(() => {
          this.logMeIn = false;
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.login-header {
  padding-left: 18px;
}

#login {
  height: 80vh;
}
</style>
