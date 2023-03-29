<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <el-table
      :data="element.data.tableData"
      height="250"
      border
      style="width: 100%"
    >
      <template v-for="(column, index) in element.data.columns">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :min-width="column.width"
          v-bind:key="index"
        >
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="js">
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ComponentBase from "../ComponentBase";
import { getRandStr } from "../../utils/utils";
import VResize from 'v-resize'

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

    console.log("数据拿去", this.element);

    // this.element.selectorList = [
    // { label: "奇数行颜色", value: "/deep/ .el-table tbody tr:nth-child(odd) .cell" }
    // ];

    this.element.data = {
      columns: [
        { prop: "date", label: "日期", width: "20" },
        { prop: "name", label: "姓名", width: "20" },
        { prop: "address", label: "地址", width: "60" }
      ],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
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
