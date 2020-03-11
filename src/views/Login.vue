<template>
  <v-content id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm6 md5 lg4>
          <v-card class="pa-3">
            <v-toolbar class="login-bar">
              <v-toolbar-title class="white--text login-header">{{ $t("OpenPaaS Login") }}</v-toolbar-title>
            </v-toolbar>
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
            <v-card-actions>
              <v-layout justify-space-between>
                <router-link :to="{ name: routeNames.RESET_PASSWORD }" target="_blank">
                  {{ $t("Reset Password") }}
                </router-link>
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
export default {
  data() {
    return {
      logMeIn: false,
      email: null,
      password: null
    };
  },
  computed: {
    routeNames() {
      return routeNames;
    }
  },
  methods: {
    login() {
      this.logMeIn = true;
      this.$auth
        .login({
          url: "api/jwt/generate",
          auth: {
            username: this.email,
            password: this.password
          },
          rememberMe: false,
          redirect: { name: routeNames.HOME }
        })
        .then(response => {
          this.$store.dispatch("session/setJWTToken", response.data);
          this.$store.dispatch("user/fetchUser");

          return response.data;
        })
        .catch(() => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: "Login error, please retry"
          });
        })
        .finally(() => {
          setTimeout(() => (this.logMeIn = false), 300);
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
  height: 60vh;
}
</style>
