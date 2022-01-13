<template>
  <v-card>
    <v-card-title class="light-blue lighten-1">
      <span class="title white--text">{{ !editing ? $t("Add software") : $t("Edit software") }}</span>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-layout row wrap align-center>
          <v-flex xs3 class="required-label">{{ $t("Software") }}</v-flex>
          <v-flex xs9>
            <v-autocomplete
              v-model="software.software"
              :items="softwareList"
              item-text="name"
              item-value="name"
              flat
              return-object
              single-line
              :rules="[() => Object.keys(software.software).length > 0 || $i18n.t('Required field')]"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs3>{{ $t("Start of support") }}</v-flex>
          <v-flex xs9>
            <v-menu
              v-model="startDateModel"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="software.SupportDate.start"
                  persistent-hint
                  prepend-icon="event"
                  @blur="software.startDate = parseDate(software.SupportDate.start)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="software.SupportDate.start"
                no-title
                @input="startDateModel = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3>{{ $t("End of support") }}</v-flex>
          <v-flex xs9>
            <v-menu
              v-model="endDateModel"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="software.SupportDate.end"
                  persistent-hint
                  prepend-icon="event"
                  @blur="software.SupportDate.end = parseDate(software.SupportDate.end)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="software.SupportDate.end" no-title @input="endDateModel = false"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Critical") }}</v-flex>
          <v-flex xs9>
            <v-btn-toggle :value="software.critical" v-model="software.critical" mandatory>
              <v-btn value="critical" flat :class="{ error: software.critical == 'critical' }">{{
                $t("critical")
              }}</v-btn>
              <v-btn value="sensible" flat :class="{ warning: software.critical == 'sensible' }">{{
                $t("sensible")
              }}</v-btn>
              <v-btn value="standard" flat :class="{ white: software.critical == 'standard' }">{{
                $t("standard")
              }}</v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("Version") }}</v-flex>
          <v-flex xs9>
            <v-text-field
              v-model="software.version"
              :rules="[() => software.version.length > 0 || $i18n.t('Required field')]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class="required-label">{{ $t("OS") }}</v-flex>
          <v-flex xs9>
            <v-text-field
              v-model="software.os"
              :rules="[() => software.os.length > 0 || $i18n.t('Required field')]"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 v-if="configuration.isLinInfoSecEnabled && islinInfoSecEnabledForContract">
            {{ $t("Designation CPE") }}
            <v-tooltip max-width="300px" v-model="showCpeDescription" right>
              <template v-slot:activator="{}">
                <v-icon class="informationIcon" @click="showCpeDescription = !showCpeDescription">
                  mdi-information
                </v-icon>
              </template>
              <span>
                {{ $t("CPE designation of the software and operating system (if available).") }}
                {{ $t("The CPE designation of the software can be obtained") }}
                <a href="https://nvd.nist.gov/products/cpe/search" target="_blank"> {{ $t("Here.") }}</a>
                {{ $t("Leave empty if the contract does not include security monitoring.") }}
              </span>
            </v-tooltip>
          </v-flex>
          <v-flex xs9 v-if="configuration.isLinInfoSecEnabled && islinInfoSecEnabledForContract">
            <chip-list-input
              @CPEList:updated="updateLinifosecConfiguration"
              @CPEList:removed="deleteFromLinifosecConfiguration"
              :CPEValidation="software.lininfosecConfiguration"
            />
          </v-flex>
          <v-flex xs3>{{ $t("Referent") }}</v-flex>
          <v-flex xs9>
            <v-autocomplete
              :items="[...referents]"
              background-color="white"
              v-model="software.technicalReferent"
              item-text="name"
              item-value="user"
              return-object
              multiple
              hide-selected
              chips
            >
              <template v-slot:item="{ item }">
                <v-layout column wrap>
                  <v-flex>{{ item.name }}</v-flex>
                  <v-flex class="caption grey--text">{{ item.email }}</v-flex>
                </v-layout>
              </template>
              <template slot="selection" slot-scope="{ item, index }">
                <v-chip close @input="removeReferentItem(index)" class="ml-0" small>
                  {{ item.name }}
                </v-chip>
              </template>
            </v-autocomplete>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="light-blue" flat @click="submit">{{ !editing ? $t("Add") : $t("Edit") }}</v-btn>
      <v-btn color="red lighten-2" flat @click="cancel">{{ $t("Cancel") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { USER_TYPE } from "@/constants.js";
import { mapGetters } from "vuex";
import ChipListInput from "@/components/ChipListInput.vue";

export default {
  name: "form-software",
  props: {
    software: Object,
    isModalOpen: Boolean,
    editing: Boolean,
    islinInfoSecEnabled: Boolean
  },
  data: () => ({
    startDateModel: "",
    endDateModel: "",
    valid: true,
    syncTechnical: null,
    showCpeDescription: false
  }),
  watch: {
    isModalOpen(value) {
      if (value && !this.editing) {
        this.resetOnCancel();
        this.$refs.form.resetValidation();
      }
    }
  },
  components: {
    ChipListInput
  },
  computed: {
    ...mapGetters({
      softwareList: "software/getSoftwareList",
      configuration: "configuration/getConfiguration"
    }),

    referents() {
      const referentList = this.$store.getters["users/getUsersByType"](USER_TYPE.BENEFICIARY);

      return referentList.map(({ name, email, user }) => ({ id: user, name, email }));
    },

    islinInfoSecEnabledForContract() {
      return this.islinInfoSecEnabled;
    }
  },
  methods: {
    cancel() {
      this.$emit("closeFormModal");
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (!this.software.technicalReferent.length) {
          delete this.software.technicalReferent;
        }

        this.$emit("submit", this.software);
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },
    resetOnCancel() {
      this.software = {
        software: {},
        critical: "standard",
        os: "",
        version: "",
        technicalReferent: [],
        SupportDate: {
          start: "",
          end: ""
        },
        lininfosecConfiguration: []
      };
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    updateLinifosecConfiguration(cpeList) {
      this.software.lininfosecConfiguration = cpeList;
    },
    deleteFromLinifosecConfiguration(idx) {
      const conf = this.software.lininfosecConfiguration;
      this.software.lininfosecConfiguration = conf.slice(0, idx).concat(conf.slice(idx + 1, conf.length));
    },

    removeReferentItem(index) {
      this.software.technicalReferent.splice(index, 1);
    }
  },
  created() {
    this.$store.dispatch("software/fetchSoftwareList");
    this.$store.dispatch("users/fetchUsers").catch(() => {
      this.$store.dispatch("ui/displaySnackbar", {
        message: this.$i18n.t("cannot fetch experts list"),
        color: "error"
      });
    });
  }
};
</script>
<style lang="stylus" scoped>
.informationIcon {
  height: 17px;
  width: 22px;
}
</style>
