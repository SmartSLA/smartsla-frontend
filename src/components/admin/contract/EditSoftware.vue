<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <div>
        <h3 class="title mb-0">{{ $t("Software") }}</h3>
      </div>
    </v-card-title>
    <v-data-table :items="contract.software" :headers="softwareHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-center">{{ props.item.software.name }}</td>
        <td class="text-xs-center">{{ props.item.version }}</td>
        <td class="text-xs-center">{{ props.item.os }}</td>
        <td class="text-xs-center" v-if="props.item.SupportDate.start.length && props.item.SupportDate.start.length">
          {{ $t("S") }}: {{ props.item.SupportDate.start }}
          <br />
          {{ $t("E") }}: {{ props.item.SupportDate.end }}
        </td>
        <td v-else class="text-xs-center">{{ $t("contract in progress") }}</td>
        <td class="text-xs-center">
          <v-chip :color="critColor(props.item.critical)" :text-color="critTextColor(props.item.critical)" label>{{
            $t(props.item.critical)
          }}</v-chip>
        </td>
        <td class="text-xs-center">
          <span v-if="props.item.generic == 'yes'">{{ $t("yes") }}</span>
          <router-link v-else to="#">repo</router-link>
        </td>
        <td class="text-xs-center">{{ props.item.technicalReferent }}</td>
        <td class="text-xs-center">
          <v-btn color="error" flat small @click="removeSoftware(props.item)">
            <v-icon>remove_circle</v-icon>
            {{ $t("remove") }}
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-btn small flat class="pl-4 success--text" @click="addSoftware = !addSoftware">
      <v-icon class="success--text">add_circle</v-icon>
      {{ $t("Add") }}
    </v-btn>
    <v-layout row wrap align-center>
      <v-flex xs1></v-flex>
      <v-flex xs8>
        <form v-if="addSoftware" class="pt-4 px-4 mr-4 grey lighten-3" ref="form" lazy-validation>
          <h3 class="title mb-0">{{ $t("Add software") }}</h3>
          <v-layout row wrap align-center>
            <v-flex xs3 class="required-label">{{ $t("Software") }}</v-flex>
            <v-flex xs9>
              <v-select
                v-model="newSoftwareName"
                :items="softwareList"
                item-text="name"
                item-value="name"
                flat
                return-object
                single-line
                :rules="[() => Object.keys(newSoftwareName).length > 0 || $i18n.t('Required field')]"
              ></v-select>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Start of support") }}</v-flex>
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
                    v-model="newSoftware.SupportDate.start"
                    persistent-hint
                    prepend-icon="event"
                    @blur="newSoftware.startDate = parseDate(newSoftware.SupportDate.start)"
                    v-on="on"
                    :rules="[() => newSoftware.SupportDate.start.length > 0 || $i18n.t('Required field')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newSoftware.SupportDate.start"
                  no-title
                  @input="startDateModel = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("End of support") }}</v-flex>
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
                    v-model="newSoftware.SupportDate.end"
                    persistent-hint
                    prepend-icon="event"
                    @blur="newSoftware.SupportDate.end = parseDate(newSoftware.SupportDate.end)"
                    v-on="on"
                    :rules="[() => newSoftware.SupportDate.end.length > 0 || $i18n.t('Required field')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newSoftware.SupportDate.end"
                  no-title
                  @input="endDateModel = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Critical") }}</v-flex>
            <v-flex xs9>
              <v-btn-toggle :value="newSoftware.critical" v-model="newSoftware.critical">
                <v-btn value="critical" flat :class="{ error: newSoftware.critical == 'critical' }">{{
                  $t("critical")
                }}</v-btn>
                <v-btn value="sensible" flat :class="{ warning: newSoftware.critical == 'sensible' }">{{
                  $t("sensible")
                }}</v-btn>
                <v-btn value="standard" flat :class="{ white: newSoftware.critical == 'standard' }">{{
                  $t("standard")
                }}</v-btn>
              </v-btn-toggle>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Version") }}</v-flex>
            <v-flex xs9>
              <v-text-field
                v-model="newSoftware.version"
                :rules="[() => newSoftware.version.length > 0 || $i18n.t('Required field')]"
              ></v-text-field>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("OS") }}</v-flex>
            <v-flex xs9>
              <v-text-field
                v-model="newSoftware.os"
                :rules="[() => newSoftware.os.length > 0 || $i18n.t('Required field')]"
              ></v-text-field>
            </v-flex>
            <v-flex xs3 class="required-label">{{ $t("Referent") }}</v-flex>
            <v-flex xs9>
              <v-select
                v-model="newSoftware.technicalReferent"
                :items="refs"
                :rules="[() => newSoftware.technicalReferent.length > 0 || $i18n.t('Required field')]"
              ></v-select>
            </v-flex>
            <v-flex xs3 class="pt-3 required-label">{{ $t("Generic") }}</v-flex>
            <v-flex xs9>
              <v-radio-group
               v-model="newSoftware.generic"
               row
               :rules="[() => newSoftware.generic.length > 0 || $i18n.t('Required field')]"
               >
                <v-radio :label="$i18n.t('yes')" value="yes"></v-radio>
                <v-radio :label="$i18n.t('no')" value="repo"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs3 class="pt-3" v-if="newSoftware.generic && newSoftware.generic != 'yes'">
              {{ $t("repo link") }}
            </v-flex>
            <v-flex xs9 v-if="newSoftware.generic && newSoftware.generic != 'yes'">
              <v-text-field v-model="newSoftware.generic.repo"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <br />
            </v-flex>
            <v-flex xs3></v-flex>
            <v-flex xs9>
              <v-btn @click="appendSoftware" class="success">{{ $t("Add software") }}</v-btn>
              {{ $t("or") }}
              <v-btn @click="addSoftware = !addSoftware" class="error">{{ $t("Cancel") }}</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
    <br />
    <v-layout row wrap align-center>
      <v-flex xs4></v-flex>
      <v-flex xs3>
        <v-btn @click="validate" class="success" :disabled="addSoftware">{{ $t("Validate changes") }}</v-btn>
      </v-flex>
      <v-flex xs3></v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "edit-contract-software",
  data() {
    return {
      newSoftwareName: {},
      startDateModel: "",
      endDateModel: "",
      newSoftware: {
        software: {},
        critical: "standard",
        generic: false,
        technicalReferent: "",
        os: "",
        version: "",
        SupportDate: {
          start: "",
          end: ""
        }
      },
      addSoftware: false,
      softwareList: [],
      contract: {},
      refs: ["Florentin Roatta", "Jean-Michel Boutin", "Ismaeil Abouljamal", "Laurent Joguet", "Guillaume Boudreaux"]
    };
  },
  methods: {
    appendSoftware() {
      if (
        !this.contract.software.filter(software => JSON.stringify(software) == JSON.stringify(this.newSoftwareName))
          .length
      ) {
        this.newSoftware.software = this.newSoftwareName;
        this.newSoftwareName = {};
        this.contract.software.push(Object.assign({}, this.newSoftware));
      }

      this.addSoftware = false;
    },

    removeSoftware(selectedSoftware) {
      this.contract.software = this.contract.software.filter(
        software => JSON.stringify(software) != JSON.stringify(selectedSoftware)
      );
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    validate() {
      this.$http
        .updateContract(this.contract._id, this.contract)
        .then(response => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: this.$i18n.t("updated"),
            color: "success"
          });
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    },
    critColor(critLevel) {
      switch (critLevel) {
        case "critical":
          return "#f44336";
          break;
        case "sensible":
          return "#f4b336";
          break;
        case "standard":
          return "#e0e0e0";
          break;

        default:
          return "";
      }
    },

    critTextColor(critLevel) {
      switch (critLevel) {
        case "critical":
        case "sensible":
          return "white";
          break;
        default:
          return "black";
      }
    }
  },
  computed: {
    softwareHeaders() {
      return [
        { text: this.$i18n.t("Software"), value: "software" },
        { text: this.$i18n.t("Version"), value: "version" },
        { text: this.$i18n.t("OS"), value: "os" },
        {
          text: this.$i18n.t("Support date"),
          value: "supportDate"
        },
        { text: this.$i18n.t("Critical"), value: "critical" },
        { text: this.$i18n.t("Generic"), value: "generic" },
        {
          text: this.$i18n.t("Tech. referent"),
          value: "technicalReferent"
        },
        { text: "", value: "delete" }
      ];
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.$http
        .getContractById(this.$route.params.id)
        .then(response => {
          this.contract = response.data;
        })
        .catch(error => {
          this.$store.dispatch("ui/displaySnackbar", {
            message: error.response.data.error.details,
            color: "error"
          });
        });
    }
  },
  created() {
    this.$http
      .listSoftware()
      .then(response => {
        this.softwareList = response.data;
      })
      .catch(error => {
        this.$store.dispatch("ui/displaySnackbar", {
          message: "cannot fetch software list",
          color: "error"
        });
      });
  }
};
</script>

<style lang="stylus" scoped></style>
