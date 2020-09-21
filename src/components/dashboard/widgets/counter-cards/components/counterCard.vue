<template>
  <v-card flat tile class="white--text" :class="cardClass">
    <v-card-text class="pl-2">
      <div class="mb-2">
        <span class="text-truncate d-block font-weight-medium">
          {{ title }}
        </span>
      </div>
      <div class="display-1 mb-2" v-if="$vuetify.breakpoint.width >= '768'">{{ value }}</div>
      <div v-else class="display-1 mb-2 d-flex justify-center">{{ value }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CounterCard",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      default: 0
    },
    colorCard: {
      type: String,
      default: "primary"
    }
  },
  computed: {
    cardClass() {
      return `card-${this.colorCard}`;
    }
  }
};
</script>

<style lang="stylus" scoped>
$primary-color = #1f1498;
$secondary-color = #2982cc;
$info-color = #f6960b;
$critical-color = #d93737;
$total-color = #00b4cc;
$not-critical-color = #4caf50;

.card-primary
  background: linear-gradient(45deg, #321fdb, $primary-color);
  border-color: $primary-color;

.card-secondary
  background: linear-gradient(45deg, #39f, $secondary-color);
  border-color: $secondary-color;

.card-info
  background: linear-gradient(45deg, #f9b115, $info-color);
  border-color: $info-color;

.card-critical
  background: linear-gradient(45deg, #f4857f, $critical-color);
  border-color: $critical-color;

.card-total
  background: linear-gradient(45deg, #6ACCDB, $total-color);
  border-color: $total-color;

.card-not-critical
  background: linear-gradient(45deg, #abdc28, $not-critical-color);
  border-color: $not-critical-color;
</style>
