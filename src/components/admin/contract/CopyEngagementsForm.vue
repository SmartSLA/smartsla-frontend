<template>
  <v-card>
    <v-card-title class="light-blue lighten-1">
      <span class="title white--text"> {{ $t("Copy from an existing contract") }} </span>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p class="font-italic">
        {{ $t("This feature allows you to copy softwares and engagment from an existing contract.") }}
      </p>
      <br />
      <v-autocomplete
        v-model="contractToCopyFrom"
        :items="contractsList"
        item-text="name"
        prepend-icon="note"
        :label="$i18n.t('Contract')"
        outlined
        return-object
      >
      </v-autocomplete>
      <v-list v-if="contractToCopyFrom">
        <v-subheader>{{ $t("Copy with") }} :</v-subheader>
        <v-list-tile>
          <v-list-tile-action>
            <v-checkbox v-model="withSoftwares"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t("Softwares") }}</v-list-tile-title>
            <v-list-tile-sub-title>
              {{
                $t("Copy the softwares from the contract: {contractName}", { contractName: contractToCopyFrom.name })
              }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-checkbox v-model="withEngagements"></v-checkbox>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t("Engagements") }}</v-list-tile-title>
            <v-list-tile-sub-title>
              {{
                $t("Copy the engagments from the contract: {contractName}", { contractName: contractToCopyFrom.name })
              }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="light-blue" flat @click="submit" :disabled="!(withEngagements || withSoftwares)">
        {{ $t("Copy") }}
      </v-btn>
      <v-btn color="red lighten-2" flat @click="cancel">{{ $t("Cancel") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    contract: Object,
    isModalOpen: Boolean
  },
  data: () => ({
    dialog: false,
    contractToCopyFrom: null,
    withSoftwares: true,
    withEngagements: false
  }),
  methods: {
    cancel() {
      this.$emit("closeFormModal");
      this.contractToCopyFrom = null;
    },
    submit() {
      let modifiedContract = this.contract;

      if (this.withSoftwares) {
        modifiedContract = {
          ...modifiedContract,
          software: this.contractToCopyFrom.software
        };
      }

      if (this.withEngagements) {
        modifiedContract = {
          ...modifiedContract,
          Engagements: this.contractToCopyFrom.Engagements
        };
      }

      this.$emit("submit", modifiedContract);
      this.contractToCopyFrom = null;
    }
  },
  mounted() {
    if (!this.contractsList.length) {
      this.$store.dispatch("contract/fetchContracts");
    }
  },
  computed: {
    ...mapGetters({
      contractsList: "contract/getContracts"
    })
  }
};
</script>
