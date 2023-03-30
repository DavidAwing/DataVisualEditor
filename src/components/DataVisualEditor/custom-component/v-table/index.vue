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

    <top-el-dialog
      title="表头编辑"
      :visible.sync="editColumnsDialog"
      width="30%"
      style="z-index: 3000"
      v-el-drag-dialog
      center
    >
      <el-form :inline="true" label-width="60px">
        <el-form-item label="列" class="full-width">
          <div>
            <el-select
              v-model="column"
              clearable
              filterable
              placeholder=""
              autocomplete="off"
              @blur="addColumn"
              @clear="removeColumn"
            >
              <el-option
                v-for="item in element.data.columns"
                :key="item.label"
                :label="item.label"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="prop" :style="{ width: '100%' }">
          <el-input
            v-model="column.prop"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>

        <el-form-item label="label" :style="{ width: '100%' }">
          <el-input
            v-model="column.label"
            autocomplete="off"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="width" :style="{ width: '100%' }">
          <el-input v-model="column.width" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editColumnsDialog = false">取 消</el-button>
        <el-button type="primary" @click="editColumnsDialog = false"
          >确 定</el-button
        >
      </span>
    </top-el-dialog>
  </div>
</template>

<script lang="js">
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ComponentBase from "../ComponentBase";
import { getRandStr } from "../../utils/utils";
import VResize from 'v-resize'
import eventBus from '../../utils/eventBus'
import draggable from 'draggable'

import elDragDialog from "../../directive/el-drag-dialog";


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
      editColumnsDialog: false,
      column:  {},
      selected: null,
    };
  },
  computed: {
    list() {
      return []
    }
  },
  watch: {
    column: {
      handler: function (val) {
        this.selected = val
      },
      deep: true,
    },

    editColumnsDialog(val) {

      if (!val)
        return
      if( (!this.column.label || !this.column.prop) &&this.element.data.columns.length > 0 )
        this.column = this.element.data.columns[0]

    }

  },
  beforeCreate() {

  },
  created() {

    eventBus.$on('onEditColumns', (name, event) => {

      if (name !== this.element.name) return


      console.log("event", event);

      this.editColumnsDialog = true

    });



    // this.element.selectorList = [
    // { label: "奇数行颜色", value: "/deep/ .el-table tbody tr:nth-child(odd) .cell" }
    // ];

    console.log("基类生命周期表格组件生命周期created", this.element);
  },
  mounted() {


    this.$parent.$watch('element', (newValue, oldValue) => {
        console.log('element changed:', newValue, oldValue);
      }, { deep: true });

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

    getRandStr,

    addColumn(event) {

      console.log("各种bug");
      if (!event.target.value)
        return
      const hasLabel = this.element.data.columns.some(obj => obj.label === event.target.value);
      if (!hasLabel) {
        this.element.data.columns.push({ prop: "", label: event.target.value, width: "" })
        this.column = this.element.data.columns.slice(-1)[0]
      }
    },

    removeColumn() {
      console.log("各种bug");

      for (let i = 0; i < this.element.data.columns.length; i++) {
        const element = this.element.data.columns[i];
        if (element.prop === this.selected.prop && element.label === this.selected.label) {
          this.element.data.columns.splice(i, 1)
          break
        }
      }
    }

  },
  directives: {
      elDragDialog
  }
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
