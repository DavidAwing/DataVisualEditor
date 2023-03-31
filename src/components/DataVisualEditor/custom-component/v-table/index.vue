<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <el-table
      :data="element.data.tableData"
      height="250"
      :border="false"
      style="width: 100%"
    >
      <template v-for="(column, index) in element.data.columns">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :min-width="column.width"
          v-bind:key="index"
        >
        </el-table-column>
      </template>
    </el-table>

    <top-el-dialog
      title="表头编辑"
      :visible.sync="editColumnsDialog"
      width="35%"
      v-el-drag-dialog
      center
    >
      <el-form :inline="true" label-width="80px">
        <el-form-item label="列名" class="full-width">
          <el-select
            v-model="selected"
            clearable
            filterable
            placeholder=""
            autocomplete="off"
            @blur="addColumn"
            @clear="removeColumn"
          >
            <el-option
              v-for="(item, index) in element.data.columns"
              :key="index"
              :label="item.label"
              :value="item.prop"
            >
            </el-option>
          </el-select>
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

        <el-form-item label="对齐" class="full-width">
          <div>
            <el-select v-model="column.align" placeholder="" autocomplete="off">
              <el-option label="left" value="left"> </el-option>
              <el-option label="center" value="center"> </el-option>
              <el-option label="right" value="right"> </el-option>
            </el-select>
          </div>
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
      column: {},
      selected: "",

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
        //
      },
      deep: true,
    },

    editColumnsDialog(val) {
      if (!val)
        return
      if ((!this.column.label || !this.column.prop) && this.element.data.columns.length > 0) {
        this.column = this.element.data.columns[0]
        this.selected = this.column.prop
      }
    },

    selected(value) {
      for (let i = 0; i < this.element.data.columns.length; i++) {
        const element = this.element.data.columns[i];
        if (element.prop === value) {
          this.column = element
          break
        }
      }
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
      const value = event.target.value
      if (!value)
        return
      const hasLabel = this.element.data.columns.some(obj => obj.label === value);
      if (!hasLabel) {
        this.element.data.columns.push({ prop: value, label: value, width: 10, align: 'center' })
        this.column = this.element.data.columns.slice(-1)[0]
        this.selected = this.column.prop
      }
    },

    removeColumn() {
      for (let i = 0; i < this.element.data.columns.length; i++) {
        const element = this.element.data.columns[i];
        if (element.prop === this.column.prop && element.label === this.column.label) {
          this.element.data.columns.splice(i, 1)
          if (this.element.data.columns[i]) {
            this.column = this.element.data.columns[i]
          } else if (this.element.data.columns.length > 0) {
            this.column = this.element.data.columns.slice(-1)[0]
          } else {
            this.column = {}
            this.selected = ""
            break
          }
          this.selected = this.column.prop
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
