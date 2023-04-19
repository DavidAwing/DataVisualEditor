<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <div :id="element.data.chartId"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ChartComponentBase from "../ChartComponentBase";
import { getRandStr } from "../../utils/utils";
import * as echarts from "echarts";

export default {
  extends: ChartComponentBase,
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(["editMode"]),
  },
  watch: {
    element: {
      handler: function (val) {
        console.log("...");
      },
      deep: true,
    },
  },
  created() {


    console.log("创建组件created");
  },
  mounted() {
    console.log("创建组件mounted");


  },
  methods: {},
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
