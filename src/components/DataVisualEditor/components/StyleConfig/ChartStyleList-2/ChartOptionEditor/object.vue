<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="container">

    <template v-for="(value, key, i) in option">
      <!-- <div v-if="getTypeName(value) === 'string'">
        <div>
          {{ "A1-" + key + "-" + value }}
        </div>
      </div>
      <div v-else-if="getTypeName(value) === 'number'">
        {{ "A1-" + key + "-" + value }}
      </div>
      <div v-else-if="getTypeName(value) === 'string[]'">
        <div v-for="str in value">
          {{ "A2-" + key + "-" + str }}
        </div>
      </div>
      <div v-else-if="getTypeName(value) === 'number[]'">
        <div v-for="str in value">
          {{ "A3-" + key + "-" + str }}
        </div>
      </div> -->

      <div v-if="getTypeName(value) === 'object'">

        <el-collapse v-model="attributeActiveCollapses">
          <el-collapse-item :title="key" :name="key + i" :key="i">
            <div v-for="(item, key, index) in value">
              <div v-if="getTypeName(item) === 'string'">
                <div>
                  {{ "B0-" + key + "-" + item }}
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
              <div v-else-if="getTypeName(item) === 'object[]'">
                <ChartOptionEditor :option="item" />
              </div>
            </div>

            <!-- <div
              v-else-if="getTypeName(value) === 'object[]'"
              v-for="(item, index) in value"
            >
              <chart-option-editor :option="item" />
            </div> -->
          </el-collapse-item>

          <!-- <el-collapse-item
            v-else-if="getTypeName(value) === 'object[]'"
            v-for="(item, j) in value"
            :title="key"
            :key="i * j + j"
          >
            <chart-option-editor :option="value[j]" />
          </el-collapse-item> -->
        </el-collapse>

      </div>


      <div
        v-else-if="getTypeName(value) === 'object[]'"
        v-for="(item, index) in value"
      >

        <ChartOptionEditor :option="item" />

      </div>


    </template>
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
  computed: {},
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
