<template>
   <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Users")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 56")}}</li>
                <li>{{$t("Last created at: le 19 juin 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add user")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Teams")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 7")}}</li>
                <li>{{$t("Last created at: le 12 avril 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add team")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Clients")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 48")}}</li>
                <li>{{$t("Last created at: le 22 Mars 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add client")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Contracts")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 32")}}</li>
                <li>{{$t("Last created at: le 05 Janvier 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add contract")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Softwares")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 7")}}</li>
                <li>{{$t("Last created at: le 12 avril 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add software")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 md4>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{$t("Contributions")}}</h3>
              </div>
            </v-card-title>
            <div>
              <ul>
                <li>{{$t("Total number: 105")}}</li>
                <li>{{$t("Last created at: le 22 mars 2019")}}</li>
              </ul>
            </div>
            <v-card-actions>
              <v-btn color="blue-background-color white-color">{{$t("Add contribution")}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
export default {
  data() {
    return {
      msg: this.$i18n.t("Administration")
    };
  },
  created() {
    this.$store.dispatch("sidebar/setSidebarComponent", "admin-main-side-bar");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("sidebar/resetCurrentSideBar");
    next();
  },
  beforeCreate() {
    if (!this.$auth.ready() || !this.$auth.check("admin")) {
      this.$router.push("/403");
    }
  }
};
</script>

<style lang="stylus" scoped></style>
