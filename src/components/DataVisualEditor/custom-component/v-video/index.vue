<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">

    <video  :autoplay="element.data.autoplay" :controls="element.data.controls" :loop="element.data.loop"
    :muted="element.data.muted" :poster="element.data.poster">
      <source :src="element.data.video" type="video/webm" />
      <track kind="subtitles" src="foo.en.vtt" srclang="en" label="English">
      <track kind="subtitles" src="foo.sv.vtt" srclang="sv" label="中文">
    </video>

  </div>
</template>

<script lang="js">
  import Vue from "vue";
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
    elDragDialog
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
      }
    };
  },
  computed: {
    list() {
      return []
    }
  },
  watch: {

    element: {
      handler: function (val) {
      },
      deep: true,
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
      if (name !== this.element.data.name) return
      Vue.set(this.element.data, "editColumnsDialog", true)
    });

    // this.element.selectorList = [
    // { label: "奇数行颜色", value: "/deep/ .el-table tbody tr:nth-child(odd) .cell" }
    // ];
  },
  mounted() {

  },
  updated() {

    if (this.isFixedHead) {

      const tableContainer = document.querySelectorAll(".table-container")[1]
      const table = document.querySelectorAll(".table")[0]

      // todo 判断有没有滚动条
      // todo 获取滚动条宽度
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

        const columns = this.element.data.columns
        columns.push({ prop: value, label: value, width: 10, align: 'center' })
        Vue.set(this.element.data, "columns", columns)
        this.column = columns.slice(-1)[0]
        this.selected = this.column.prop
      }
    },

    removeColumn() {
      const columns = this.element.data.columns
      for (let i = 0; i < columns.length; i++) {
        const element = columns[i];
        if (element.prop === this.column.prop && element.label === this.column.label) {
          columns.splice(i, 1)
          if (columns[i]) {
            this.column = columns[i]
          } else if (columns.length > 0) {
            this.column = columns.slice(-1)[0]
          } else {
            this.column = {}
            this.selected = ""
            break
          }
          this.selected = this.column.prop
          break
        }
        Vue.set(this.element.data, "columns", columns)
      }
    }

  }
};
</script>

<style lang="less" scoped>
@import "index.less";
</style>
