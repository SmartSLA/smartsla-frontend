<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-card-text class="pa-0">
          <v-layout v-bind:column="isMobile" fill-height>
            <v-flex xs12 sm6 md5 lg5>
              <time-duration-changer-dropdown />
            </v-flex>
            <v-flex xs12 sm4 md5 lg5>
              <v-select
                flat
                v-model="selectedContracts"
                multiple
                solo
                chips
                small-chips
                item-text="name"
                item-value="_id"
                persistent-hint
                return-object
                :items="contractsList"
                hide-details
                :label="$i18n.t('Contract')"
                :no-data-text="$i18n.t('No data available')"
                @focus="onFocus"
              >
                <template v-slot:prepend-item>
                  <v-list-tile ripple @click="toggle">
                    <v-list-tile-action>
                      <v-icon>{{ icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ $t("All contracts") }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider class="mt-2"></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <v-text-field
                          ref="query"
                          full-width
                          v-model="querySearch"
                          :placeholder="$i18n.t('Please refine your search...')"
                          @input="filterContracts"
                        ></v-text-field>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider class="mt-2"></v-divider>
                </template>
                <template v-slot:item="data">
                  <text-highlight :queries="querySearch"> {{ data.item.name }}</text-highlight>
                  <v-spacer></v-spacer>
                  <span class="grey--text caption">
                    <text-highlight :queries="querySearch">{{ data.item.client }}</text-highlight>
                  </span>
                </template>
                <template v-slot:selection="data">
                  <v-chip v-if="data.index >= 0 && data.index < maxChips">
                    <span>{{ data.item.name }} {{ data.index }}</span>
                  </v-chip>
                  <span v-if="data.index === maxChips" class="grey--text caption"
                    >(+{{ selectedContracts.length - data.index }} {{ $t("Other") }})</span
                  >
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm2 md2 lg2 :class="isMobile ? 'align-self-end' : 'align-self-center'">
              <v-btn small color="info" @click="getDashboardData()">
                {{ $t("Apply") }}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import TimeDurationChangerDropdown from "@/components/dashboard/base/TimeDurationChangerDropdown.vue";
import { InsensitiveInclude } from "@/services/helpers/string";

export default {
  data() {
    return {
      selectedContracts: [],
      querySearch: "",
      localContractsClone: []
    };
  },
  created() {
    if (!this.contractsList.length) {
      this.$store.dispatch("contract/fetchContracts");
    }
  },
  computed: {
    ...mapGetters({
      contractsList: "contract/getContracts"
    }),
    icon() {
      if (this.allContracts) return "mdi-close-box";
      if (this.someContracts) return "mdi-minus-box";
      return "mdi-checkbox-blank-outline";
    },
    allContracts() {
      return this.selectedContracts.length === this.contractsList.length;
    },
    someContracts() {
      return !this.selectedContracts.length && !this.allContracts;
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        case "sm":
        case "md":
        case "lg":
        case "xl":
          return false;
      }
    },
    maxChips() {
      return this.isMobile ? 2 : 4;
    }
  },
  components: {
    TimeDurationChangerDropdown
  },
  methods: {
    onFocus() {
      setTimeout(() => {
        this.$nextTick(this.$refs.query.focus);
      }, 100);
    },

    getDashboardData() {
      let contracts = [];

      if (this.selectedContracts.length) {
        contracts = this.selectedContracts.map(contract => contract._id);
      }

      this.$store.dispatch("main/setContracts", contracts);
      this.$store.dispatch("main/updateWidgetFilters");
    },

    toggle() {
      if (this.allContracts) {
        this.selectedContracts = [];
      } else {
        this.selectedContracts = this.contractsList;
      }
    },

    filterContracts() {
      if (!this.querySearch) {
        this.localContractsClone = this.contractsList;
      }

      this.localContractsClone = this.contractsList.filter(({ name, client }) => {
        return InsensitiveInclude(name, this.querySearch) || InsensitiveInclude(client, this.querySearch);
      });
    }
  },
  mounted() {
    this.localContractsClone = [...this.contractsList];
  }
};
</script>

<style lang="stylus">

@media print {
  body { color-adjust: exact; }
  main.v-content { padding :0 !important; }
  .toolbar { display: none; }
  #dashboard_filters, #navigation_drawer { display: none; }
  .widget { page-break-after: always; }
  #line-chart { width: 100% !important; }
  #bar-chart { width: 100% !important; }
}
</style>
