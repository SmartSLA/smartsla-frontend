<template>
  <v-layout row pb-2>
    <v-flex>
      <v-card>
        <v-card-text>
          <v-layout row align-center justify-center fill-height>
            <v-flex xs12 sm4 md2 lg4>
              <time-duration-changer-dropdown />
            </v-flex>
            <v-flex xs12 sm4 md6 lg4>
              <v-select
                flat
                v-model="selectedContracts"
                multiple
                solo
                chips
                small-chips
                item-text="name"
                persistent-hint
                return-object
                :items="contractsList"
                hide-details
                :label="$i18n.t('Contract')"
                :no-data-text="$i18n.t('No data available')"
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
                </template>
                <template v-slot:item="data">
                  <span>{{ data.item.name }}</span>
                  <v-spacer></v-spacer>
                  <span class="grey--text caption">{{ data.item.client }}</span>
                </template>
                <template v-slot:selection="data">
                  <v-chip v-if="data.index >= 0 && data.index < 4">
                    <span>{{ data.item.name }} {{ data.index }}</span>
                  </v-chip>
                  <span v-if="data.index === 4" class="grey--text caption"
                    >(+{{ selectedContracts.length - data.index }} {{ $t("Other") }})</span
                  >
                </template>
              </v-select>
            </v-flex>
            <v-flex xs12 sm4 md4>
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

export default {
  data() {
    return {
      selectedContracts: []
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
    }
  },
  components: {
    TimeDurationChangerDropdown
  },
  methods: {
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
    }
  }
};
</script>
