<template>
  <v-card flat tile class="white--text" :class="cardClass">
    <v-card-text>
      <div class="display-1 mb-2">
        <span class="title font-weight-normal mb-2">{{ title }} </span>
        <v-icon dark right>{{ icon }}</v-icon>
      </div>
      <div class="display-1 mb-2">{{ value }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CounterCard",
  props: {
    icon: {
      type: String,
      required: true
    },
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
  background: linear-gradient(45deg, #e55353, $critical-color);
  border-color: $critical-color;
</style>
