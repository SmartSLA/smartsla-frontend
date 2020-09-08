<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon color="grey">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-tile @click="exportWidgetAsImage()">
        <v-list-tile-title>{{ $t("Save as Image") }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    name: String,
    type: {
      type: String,
      default: "canvas"
    }
  },
  methods: {
    async exportWidgetAsImage() {
      if (this.$parent.$el && !this.$parent.$el.id) {
        return;
      }

      const element = document.querySelector(`#${this.$parent.$el.id} ${this.type}`);
      const options = {
        type: "dataURL",
        logging: false,
        scale: (1920 * 2) / window.innerWidth,
        backgroundColor: null
      };

      const outputUri = await this.$html2canvas(element, options);

      let link = document.createElement("a");
      link.download = this.name;
      link.setAttribute("href", outputUri);
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>
