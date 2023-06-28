<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">
    <el-table
      :data="element.data.tableData"
      height="250"
      :border="element.data.showBorder"
      style="width: 100%"
      ref="table"
      class="table-style"
    >
      <template v-for="(column, index) in element.data.columns">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :min-width="column.width"
          :key="index"
        >
        </el-table-column>
      </template>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="10" v-if="false"> </el-pagination>

    <top-el-dialog title="编辑表头" :visible.sync="element.data.editColumnsDialog" width="35%" v-el-drag-dialog center>
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
          <el-input v-model="column.prop" autocomplete="off" style="width: 100%"></el-input>
        </el-form-item>

        <el-form-item label="label" :style="{ width: '100%' }">
          <el-input v-model="column.label" autocomplete="off" style="width: 100%"></el-input>
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
        <el-button @click="element.data.editColumnsDialog = false">取 消</el-button>
        <el-button type="primary" @click="element.data.editColumnsDialog = false">确 定</el-button>
      </span>
    </top-el-dialog>

    <top-el-dialog title="编辑样式" :visible.sync="element.data.editStyleDialog" width="40%" v-el-drag-dialog center >
      <div class="block">
        <el-carousel trigger="click" height="350px" :autoplay="false" @change="index => (styleindex = index)">
          <el-carousel-item v-for="(item, index) in styleList" :key="index">
            <div style="height: 100%">
              <el-image style="width: 100%; height: 100%" :src="item.img" fit="contain"></el-image>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="element.data.editStyleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addStyle">确 定</el-button>
        <el-button type="primary" @click="removeStyle">移 除</el-button>
      </span>
    </top-el-dialog>
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
import tableFit from "../../directive/tableFit";
import {
  stringToFunction,
  CompileSourcecode,
  CompileToModule,
  CompileTypescriptToIIFE,
} from '../../utils/compiler.ts';

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
  removeStyleById,
  parseCssExpressions,
  addStyleListToHead,
  generateStyleId,
  removeAllStyleNotOfCanvasName,
} from '../../utils/style';


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
      },
      column: {},
      selected: "",
      maxRows: undefined,
      dom: undefined,
      styleList: null,
      styleindex: 0
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

    element: {
      handler: function (val, old) {

        if (this.element.data.editColumnsDialog === true) {
        }

        // if (!val)
        // return
        // if ((!this.column.label || !this.column.prop) && this.element.data.columns.length > 0) {
        //   this.column = this.element.data.columns[0]
        //   this.selected = this.column.prop
        // }

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

    eventBus.$on('onEditStyle', async (name, event) => {
      if (name !== this.element.data.name) return
      Vue.set(this.element.data, "editStyleDialog", true)

      if (this.styleList === undefined || this.styleList === null) {
        const { data } = await axios.get("/BI-API/Component/GetScript?name=Style/v-table-style/index.js")
        const module = await CompileToModule.bind(this)(data.data)
        let instance = null
        if (Object.prototype.toString.call(module) === '[object Module]' && module.default === undefined) {
        } else if (Object.prototype.toString.call(module.default) === '[object Function]') {
          instance = new module.default();
        } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
          instance = module.default;
        }

        instance.init().then((list) => {
          this.styleList = list
        })
      }

    });




    // this.element.selectorList = [
    // { label: "奇数行颜色", value: "/deep/ .el-table tbody tr:nth-child(odd) .cell" }
    // ];
  },
  mounted() {

    this.$parent.$watch('element', (newValue, oldValue) => {
    }, { deep: true });


    const getMaxRows = () => {
      try {
        const table = this.$refs.table
        const tableHeight = table.$el.clientHeight  // 表格高度
        const thHeight = table.$el.children[1].clientHeight // 表头高度
        const trHeight = table.$el.children[2].children[0].children[1].children[0].clientHeight // 表行高度
        return (tableHeight - thHeight) / trHeight  //最多显示行数
      } catch (error) {
        return Infinity
      }
    }

    const setMaxRows = () => {
      const maxRows = getMaxRows()
      // console.log("计算结果A", maxRows === Infinity, isNaN(maxRows), isFinite(maxRows), Number.isFinite(maxRows), Number.isFinite(maxRows));
      if (maxRows === Infinity || Number.isNaN(maxRows)) {
        setTimeout(() => {
          setMaxRows()
        }, 300);
      } else {
        this.maxRows = maxRows
      }
    }

    setMaxRows()

    if (this.element.data.showMode === "roll")
      this.rollTable()

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

    addStyle() {
      this.element.data.editStyleDialog = false
      const css = this.styleList[this.styleindex].css.replaceAll("--id",   "#component" + this.element.id)
      const canvasName =  bi.store.state.canvasName
      const styleId = canvasName + "-" + this.element.data.name + "-style"
      removeStyleById(styleId)
      addStyleToHead(styleId, css, canvasName)
    },

    removeStyle() {
      const canvasName =  bi.store.state.canvasName
      const styleId = canvasName + "-" + this.element.data.name + "-style"
      removeStyleById(styleId)
      this.element.data.editStyleDialog = false
    },

    rollTable() {

      const data = this.element.data
      if (data.tableData === undefined || data.tableData === null) {
        setTimeout(this.rollTable.bind(this), 300);
        return
      }
      try {
        this.dom = this.$refs.table.$el.children[2].children[0].children[1]
        this.dom.style.transform = "translate3d(0px, 0px, 0px)"
        // this.dom.style.transform = "translateY(0px)"
      } catch (error) {
        setTimeout(this.rollTable.bind(this), 300);
        return
      }

      const tableHeight = this.$refs.table.$el.clientHeight  // 表格高度

      const rollingSpeed = data.rollingSpeed
      let fps = 60
      let fpsInterval = 1000 / fps
      let last = new Date().getTime() //上次执行的时刻



      let roll = () => {
        try {

          if (/*this.maxRows === Infinity || Number.isNaN(this.maxRows) || */ this.element.data.tableData.length <= this.maxRows) {
            setTimeout(() => {
              window.requestAnimationFrame(roll);
            }, 2000);
            return
          }

          let now = new Date().getTime()
          let elapsed = now - last;
          if (elapsed > fpsInterval) {

            let offsetHeight = -this.dom.offsetHeight + this.dom.offsetHeight / 5

            last = now - (elapsed % fpsInterval); //校正当前时间
            // translate3d的性能会更好,参考https://stackoverflow.com/questions/22111256/translate3d-vs-translate-performance
            // let domTop = this.dom.style.transform.match(/translateY\(([-+.\d]+)px\)/)[1]
            let domTop = this.dom.style.transform.match(/translate3d\(0px,\s*([\d.-]+)px,\s*0px\)/)[1]
            domTop = Number.parseFloat(domTop)
            if (domTop < offsetHeight) {
              this.dom.style.transform = `translate3d(0px, ${tableHeight / 2}px, 0px)`;
              // this.dom.style.transform = `translateY(${tableHeight}px)`;
            } else {
              this.dom.style.transform = `translate3d(0px, ${domTop - rollingSpeed}px, 0px)`;
              // this.dom.style.transform = `translateY(${domTop - rollingSpeed}px)`;
            }
          }
          window.requestAnimationFrame(roll);
        } catch (error) {
          console.log("表格滚动发生了异常", this.dom.style.transform);
          console.log("表格滚动发生了异常", error);
        }
      }
      window.requestAnimationFrame(roll);

    },

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
@import 'index.less';
@import 'table-style.less';
</style>
