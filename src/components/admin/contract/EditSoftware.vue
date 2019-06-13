<template>
  <v-card class="mt-4 px-4">
    <v-card-title primary-title class="pl-0">
      <div>
        <h3 class="title mb-0">{{ $t("Software") }}</h3>
      </div>
    </v-card-title>
    <v-data-table :items="contract.relatedSoftware" :headers="softwareHeaders" hide-actions>
      <template v-slot:items="props">
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.version }}</td>
        <td class="text-xs-center">{{ props.item.os }}</td>
        <td class="text-xs-center">
          {{ $t("S") }}: {{ props.item.SupportDate.start }}
          <br />
          {{ $t("E") }}: {{ props.item.SupportDate.end }}
        </td>
        <td class="text-xs-center">
          <v-chip color="red" text-color="white" label v-if="props.item.critical">{{ $t("Yes") }}</v-chip>
          <v-chip label v-else>{{ $t("No") }}</v-chip>
        </td>
        <td class="text-xs-center">
          <span v-if="props.item.generic == 'yes'">
            {{ $t("yes") }}
          </span>
          <router-link v-else to="#">repo</router-link>
        </td>
        <td class="text-xs-center">{{ props.item.technicalReferent }}</td>
        <td class="text-xs-center">
          <v-btn color="error" flat small @click="removeSoftware(props.item.id)">
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
        <form v-if="addSoftware" class="pt-4 px-4 mr-4 grey lighten-3">
          <h3 class="title mb-0">{{ $t("Add software") }}</h3>
          <v-layout row wrap align-center>
            <v-flex xs3>{{ $t("Software") }}</v-flex>
            <v-flex xs9>
              <v-select
                v-model="newSoftwareName"
                :items="softwareList"
                item-text="name"
                item-value="name"
                flat
                return-object
                single-line
              ></v-select>
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
                    v-model="newSoftware.SupportDate.start"
                    persistent-hint
                    prepend-icon="event"
                    @blur="newSoftware.startDate = parseDate(newSoftware.SupportDate.start)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newSoftware.SupportDate.start"
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
                    v-model="newSoftware.SupportDate.end"
                    persistent-hint
                    prepend-icon="event"
                    @blur="newSoftware.SupportDate.end = parseDate(newSoftware.SupportDate.end)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newSoftware.SupportDate.end"
                  no-title
                  @input="endDateModel = false"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs3>{{ $t("Critical") }}</v-flex>
            <v-flex xs9>
              <v-btn-toggle :value="newSoftware.critical" v-model="newSoftware.critical">
                <v-btn :value="true" flat :class="{ error: newSoftware.critical }">{{ $t("Yes") }}</v-btn>
                <v-btn :value="false" flat :class="{ white: newSoftware.critical }">{{ $t("No") }}</v-btn>
              </v-btn-toggle>
            </v-flex>
            <v-flex xs3>{{ $t("Version") }}</v-flex>
            <v-flex xs9>
              <v-text-field v-model="newSoftware.version" required></v-text-field>
            </v-flex>
            <v-flex xs3>{{ $t("OS") }}</v-flex>
            <v-flex xs9>
              <v-text-field v-model="newSoftware.os" required></v-text-field>
            </v-flex>
            <v-flex xs3>{{ $t("Referent") }}</v-flex>
            <v-flex xs9>
              <v-select v-model="newSoftware.technicalReferent" :items="refs" required></v-select>
            </v-flex>
            <v-flex xs3 class="pt-3">{{ $t("Generic") }}</v-flex>
            <v-flex xs9>
              <v-radio-group v-model="newSoftware.generic" row>
                <v-radio :label="$t('yes')" value="yes"></v-radio>
                <v-radio :label="$t('no')" value="repo"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs3 class="pt-3" v-if="newSoftware.generic && newSoftware.generic != 'yes'">{{
              $t("repo link")
            }}</v-flex>
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
        <v-btn @click="createAccount" class="success" :disabled="addSoftware">{{ $t("Validate changes") }}</v-btn>
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
        name: "",
        critical: true,
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
      if (!this.contract.relatedSoftware.filter(software => software.id == this.newSoftwareName.id).length) {
        this.newSoftware.name = this.newSoftwareName.name;
        this.newSoftware.id = this.newSoftwareName.id;
        this.newSoftwareName = {};
        this.contract.relatedSoftware.push(Object.assign({}, this.newSoftware));
      }
    },

    removeSoftware(softwareId) {
      this.contract.relatedSoftware = this.contract.relatedSoftware.filter(software => software.id != softwareId);
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
  created() {
    this.softwareList = require("@/assets/data/software.json");
    this.contract = require("@/assets/data/contract.json");
  }
};
</script>

<style lang="stylus" scoped></style>
