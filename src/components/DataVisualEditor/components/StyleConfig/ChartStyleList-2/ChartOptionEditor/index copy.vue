<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="container">


    <div v-if="getTypeName(option) === 'object'">
      <el-collapse v-model="attributeActiveCollapses">
        <el-collapse-item title="key" name="key + i" key="i">
          <div v-for="(item, key, index) in option">
            <div v-if="getTypeName(item) === 'string'">
              <div>
                {{ "B0-" + key + i + item }}
              </div>
            </div>
            <div v-else-if="getTypeName(item) === 'number'">
              {{ "B1-" + key + "-" + item }}
            </div>
            <div v-else-if="getTypeName(item) === 'string[]'">
              <div v-for="str in item">
                {{ "B2-" + key + "-" + str }}
              </div>
            </div>
            <div v-else-if="getTypeName(item) === 'number[]'">
              <div v-for="str in item">
                {{ "B3-" + key + "-" + str }}
              </div>
            </div>
            <div v-else-if="getTypeName(item) === 'object'">
              <ChartOptionEditor :option="item" />
            </div>
            <!-- <div v-else-if="getTypeName(item) === 'object[]'">
              <ChartOptionEditor :option="item" />
            </div> -->
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div v-if="getTypeName(option) === 'object[]'">
      <ChartOptionEditor :option="item" />
    </div>


  </div>
</template>

<script>
/*
  todo: css支持 for if 变量
*/
import { mapState } from "vuex";
import Vue from "vue";
import {
  styleData,
  addSelectorToStyle,
  isStyleExist,
  addStyleToHead,
  setStyleValues,
  getCssKeys,
  getStyleSelectorStrById,
  updateStyle,
  convertToCss,
  parseCssExpressions,
  addStyleListToHead,
  generateStyleId,
  removeAllStyleNotOfCanvasName,
} from "@/components/DataVisualEditor/utils/style";
import * as DB from "@/components/DataVisualEditor/utils/indexDB";
const toStyleString = require("to-style").string;
const toStyleObject = require("to-style").object;
import { toCSS, toJSON } from "cssjson";
import {
  strToBase64,
  isArrayInclude,
  removeWhitespace,
} from "@/components/DataVisualEditor/utils/utils";
import deepClone from "deep-clone";
import StyleBase from "../../StyleBase";
import axios from "axios";
import eventBus from "../../../../utils/eventBus";
import { CRUD } from "../../../../utils/chartUtils";

import { getRandStr } from "../../../../utils/utils";

export default {
  components: {},
  name: "ChartOptionEditor",
  data() {
    return {
      attributeActiveCollapses: [],
    };
  },
  props: {
    option: {
      type: [Object, Array],
      default() {
        return {};
      },
    },
  },
  computed: {
    ChartOptionEditor: this,
  },
  mounted() {
  },
  methods: {
    getRandStr,
    getTypeName(value) {
      let type = "";
      if (Object.prototype.toString.call(value) === "[object Object]")
        type = "object";
      else if (Object.prototype.toString.call(value) === "[object Array]") {
        type = this.getTypeName(value[0]) + "[]";
      } else if (Object.prototype.toString.call(value) === "[object String]")
        type = "string";
      else if (Object.prototype.toString.call(value) === "[object Number]")
        return "number";
      else if (Object.prototype.toString.call(value) === "[object Boolean]")
        type = "boolean";
      else type = "undefined";
      return type;
    },
  },
};
</script>

<style lang="less" scoped>
@import url(../../../../styles/hr-style.css);
@import url(index.less);
</style>
