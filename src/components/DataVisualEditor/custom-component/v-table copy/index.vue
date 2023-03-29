<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">

  <!--
border=1，意思就是给表格的每一格，及边框加上1像素的边框

                          v-resize="resize" -->

    <!-- 表格渲染后再渲染固定表头 -->
    <div class="table-container">
      <div class="thead" v-if="isFixedHead">
        <ul class="tr">
          <li class="th" v-if="showCheckbox">
            <input type="checkbox" />
          </li>
          <li class="th" v-for="(item, index) in titles" v-bind:key="index">
            <span>
              {{ item }}
            </span>

          </li>
        </ul>
      </div>
    </div>

    <div class="table-container">

      <table class="table" border="0" cellspacing="0" cellpadding="0" @scroll="tableScroll">
        <thead class="thead" v-if="!isFixedHead">
          <tr class="tr">
            <th class="th" v-if="showCheckbox">
              <input type="checkbox" />
            </th>
            <th class="th" v-for="(item, index) in titles" v-bind:key="index">
              {{ item }}
            </th>
          </tr>
        </thead>
        <tbody style="overflow: scroll;">
          <tr v-for="(obj, i) in list" v-bind:key="i">

            <td v-if="showCheckbox">
              <input type="checkbox" v-model="obj['checked']" />
            </td>

            <td v-for="(key, j) in Object.keys(obj)" v-bind:key="j" v-resize="VResizeOptions">
              {{ obj[key] }}
            </td>

          </tr>
        </tbody>
      </table>

    </div>

  </div>
</template >

<script lang="js">
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ComponentBase from "../ComponentBase";
import { getRandStr } from "../../utils/utils";
import VResize from 'v-resize'

// <div class="table" @scroll="tableScroll">
// <!-- 表头 -->
// <div class="thead">
//   <div class="th" v-if="showCheckbox">
//     <input type="checkbox" />
//   </div>
//   <div class="th" v-for="(item, index) in titles" v-bind:key="index">
//     {{ item }}
//   </div>
// </div>
// <div class="tbody">
//   <div class="tr" v-for="(obj, i) in list" v-bind:key="i">

//     <div class="td" v-if="showCheckbox">
//       <input type="checkbox" v-model="obj['checked']" />
//     </div>

//     <div class="td" v-for="(key, j) in Object.keys(obj)" v-bind:key="j">
//       {{ obj[key] }}
//     </div>

//   </div>
// </div>

export default {
  extends: ComponentBase,
  directives: {
    resize: VResize,
  },
  props: {

  },
  mixins: [],
  data() {
    return {
      canEdit: false,
      ctrlKey: 17,
      isCtrlDown: false,
      showCheckbox: true,
      isFixedHead: true,
      titles: [],
      VResizeOptions: {
        onResize(params) {
          console.log(params)
        },
        directions: ['right', 'bottom'],
      },
    };
  },
  computed: {
    list() {
      return [{ name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" },
      { name: "aaa", age: 12, test: "AB撒地方", test2: "AB撒地方" }]
    },
  },
  watch: {
    element: {
      handler: function (val) {
        console.log("element", this.element);
        this.titles = this.element.data.titles
      },
      deep: true,
    },
  },
  beforeCreate() {

  },
  created() {

    this.element.data = {
      "titles": [
        "区段名", "描述", "区段代码", "区段代码"
      ]
    }

    console.log("基类生命周期表格组件生命周期created", this.element);
  },
  mounted() {

    console.log("txt的组件生命周期mounted");
  },
  updated() {


    if (this.isFixedHead) {

      const tableContainer = document.querySelectorAll(".table-container")[1]
      const table = document.querySelectorAll(".table")[0]


      // 判断有没有滚动条
      // 获取滚动条宽度
      console.log("组件更新");
    }

  },
  methods: {
    handleInput(event) {
      this.$emit("input", this.element);
    },

    tableScroll(event) {
    },

    getRandStr
  },
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
