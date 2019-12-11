<template>
  <v-card>
    <v-card-title class="light-blue lighten-1">
      <span class="title white--text">{{ !editing ? $t("Add commitment") : $t("Edit commitment") }}</span>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="mb-3">
      <v-form v-model="valid" class="" ref="form" lazy-validation>
        <v-layout row wrap align-center>
          <v-flex xs4 class="required-label">{{ $t("Request type") }}</v-flex>
          <v-flex xs6>
            <v-select
              v-model="commitment.request"
              :items="requestTypes"
              item-text="value"
              item-value="key"
              flat
              single-line
              :rules="[() => commitment.request.length > 0 || $i18n.t('Required field')]"
            ></v-select>
          </v-flex>

          <v-flex xs4 v-if="commitment.request === 'Other'"></v-flex>
          <v-flex xs6 v-if="commitment.request === 'Other'">
            <v-text-field v-model="commitment.custom_request" requried></v-text-field>
          </v-flex>

          <v-flex xs4 class="required-label">{{ $t("Severity") }}</v-flex>
          <v-flex xs6>
            <v-select
              v-model="commitment.severity"
              :items="severityTypes"
              item-text="value"
              item-value="key"
              flat
              single-line
              :rules="[() => commitment.severity.length > 0 || $i18n.t('Required field')]"
            >
            </v-select>
          </v-flex>
          <v-flex xs4 class="required-label">{{ $t("Ossa identifier") }}</v-flex>
          <v-flex xs6>
            <v-select
              v-model="commitment.idOssa"
              :items="ossaIds"
              item-text="value"
              item-value="key"
              flat
              single-line
              :rules="[() => commitment.idOssa.length > 0 || $i18n.t('Required field')]"
            >
              <template slot="item" slot-scope="data">
                <v-avatar :color="data.item.color" size="25">
                  <span class="white--text">{{ data.item.id }}</span>
                </v-avatar>
                <span class="pl-2"> {{ $t(data.item.key) }} </span>
              </template>
              <template slot="selection" slot-scope="data">
                <v-avatar :color="data.item.color" size="25">
                  <span class="white--text">{{ data.item.id }}</span>
                </v-avatar>
                <span class="pl-2"> {{ $t(data.item.key) }} </span>
              </template>
            </v-select>
          </v-flex>

          <v-flex xs4>{{ $t("treatment time range") }}</v-flex>
          <v-flex xs8>
            <v-layout>
              <v-flex xs6> {{ $t("Business hours") }} </v-flex>
              <v-flex xs6 v-if="contract.features && contract.features.nonBusinessHours"
                >{{ $t("Non business hours") }}
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs4 class="required-label">{{ $t("Supported") }}</v-flex>
          <v-flex xs8>
            <v-layout>
              <v-flex xs6>
                <v-layout>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('D')"
                      persistent-hint
                      v-model="commitment.supported.businessHours.days"
                      mask="###"
                      :rules="[() => isSetDaysOrHours(commitment.supported.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('H')"
                      persistent-hint
                      v-model="commitment.supported.businessHours.hours"
                      mask="##"
                      :rules="[() => isSetDaysOrHours(commitment.supported.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout v-if="nonBusinessHours">
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('d')"
                      persistent-hint
                      v-model="commitment.supported.nonBusinessHours.days"
                      mask="###"
                      :rules="[
                        () => isSetDaysOrHours(commitment.supported.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('h')"
                      persistent-hint
                      v-model="commitment.supported.nonBusinessHours.hours"
                      mask="##"
                      :rules="[
                        () => isSetDaysOrHours(commitment.supported.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs4 class="required-label">{{ $t("Bypassed") }}</v-flex>
          <v-flex xs8>
            <v-layout>
              <v-flex xs6>
                <v-layout>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('D')"
                      persistent-hint
                      v-model="commitment.bypassed.businessHours.days"
                      mask="###"
                      :rules="[() => isSetDaysOrHours(commitment.bypassed.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('H')"
                      persistent-hint
                      v-model="commitment.bypassed.businessHours.hours"
                      mask="##"
                      :rules="[() => isSetDaysOrHours(commitment.bypassed.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout v-if="nonBusinessHours">
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('d')"
                      persistent-hint
                      v-model="commitment.bypassed.nonBusinessHours.days"
                      mask="###"
                      :rules="[
                        () => isSetDaysOrHours(commitment.bypassed.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('h')"
                      persistent-hint
                      v-model="commitment.bypassed.nonBusinessHours.hours"
                      mask="##"
                      :rules="[
                        () => isSetDaysOrHours(commitment.bypassed.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs4 class="required-label">{{ $t("Resolved") }}</v-flex>
          <v-flex xs8>
            <v-layout>
              <v-flex xs6>
                <v-layout>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('D')"
                      persistent-hint
                      v-model="commitment.resolved.businessHours.days"
                      mask="###"
                      :rules="[() => isSetDaysOrHours(commitment.resolved.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('H')"
                      persistent-hint
                      v-model="commitment.resolved.businessHours.hours"
                      mask="##"
                      :rules="[() => isSetDaysOrHours(commitment.resolved.businessHours) || $i18n.t('Required field')]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout v-if="nonBusinessHours">
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('d')"
                      persistent-hint
                      v-model="commitment.resolved.nonBusinessHours.days"
                      mask="###"
                      :rules="[
                        () => isSetDaysOrHours(commitment.resolved.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <v-text-field
                      :hint="$t('h')"
                      persistent-hint
                      v-model="commitment.resolved.nonBusinessHours.hours"
                      mask="##"
                      :rules="[
                        () => isSetDaysOrHours(commitment.resolved.nonBusinessHours) || $i18n.t('Required field')
                      ]"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red lighten-2" flat @click="cancel">{{ $t("Cancel") }}</v-btn>
      <v-btn color="light-blue" flat @click="submit">{{
        !editing ? $t("Add commitment") : $t("Edit commitment")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "form-engagement",
  props: {
    editing: Boolean,
    isModalOpen: Boolean,
    commitment: Object,
    requestTypes: Array,
    severityTypes: Array,
    ossaIds: Array,
    contract: Object
  },
  data() {
    return {
      valid: false
    };
  },
  methods: {
    isSetDaysOrHours(value) {
      const { days, hours } = value;
      return days || hours ? true : false;
    },
    cancel() {
      this.$emit("closeFormModal");
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit("submit", this.commitment);
      } else {
        this.$store.dispatch("ui/displaySnackbar", {
          message: this.$i18n.t("the required fields must be filled"),
          color: "error"
        });
      }
    },
    resetOnCancel() {
      this.commitment = {
        request: "",
        severity: "",
        idOssa: "",
        supported: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        bypassed: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        resolved: {
          businessHours: {
            days: "",
            hours: ""
          },
          nonBusinessHours: {
            days: "",
            hours: ""
          }
        },
        description: ""
      };
    }
  },
  watch: {
    isModalOpen: function(value) {
      if (value && !this.editing) {
        this.resetOnCancel();
        this.$refs.form.resetValidation();
      }
    }
  },
  computed: {
    nonBusinessHours() {
      return this.contract.features && this.contract.features.nonBusinessHours;
    }
  }
};
</script>
