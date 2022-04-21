<template>
  <v-container class="pl-2">
    <div class="vn-table vn-table-title" :style="styleTable">
      <slot v-for="(header, idx) in headers" :header="header" name="columnTitle">
        <span :key="idx"> {{ header }}</span>
      </slot>
    </div>
    <div class="vn-table" v-for="(item, idx) in list" :key="idx">
      <div :style="styleTable">
        <slot :item="item" name="content"> </slot>
      </div>
      <v-divider></v-divider>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "vuln-list",
  props: {
    list: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    grid: {
      type: String
    }
  },
  data() {
    return {};
  },
  computed: {
    styleTable() {
      return {
        display: "grid",
        gridTemplateColumns: this.grid,
        minHeight: "40px",
        gridGap: "15px",
        paddingLeft: "10px"
      };
    }
  }
};
</script>
<style scoped lang="stylus">
.vn-table > div {
  & > * {
    line-height: 30px;
    align-self: left;
  }
}

.vn-table-title {
  background: rgba(153, 153, 153, 0.05);

  & > * {
    text-align: left;
    width: 100%;
  }
}
</style>
