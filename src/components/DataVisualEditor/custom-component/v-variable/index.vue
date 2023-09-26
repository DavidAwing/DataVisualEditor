<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container">

    <my-component></my-component>

    <!-- <top-el-dialog
      :title="element.data.title"
      :visible.sync="element.data.show"
      width="35%"
      v-el-drag-dialog
      center
      v-if="false"
    >
      <div>1111</div>
    </top-el-dialog>

    <draggable class="component-list" :style="GetComponentList" :data-name='element.data.name' :data-on-drop='true'>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </draggable> -->
  </div>
</template>

<script lang="js">

/*

*/


import Vue from "vue";
import { mapState } from "vuex";
import axios from "axios";
import { keycodes } from "../../utils/shortcutKey";
import ComponentBase from "../ComponentBase";
import { getRandStr } from "../../utils/utils";
import VResize from 'v-resize'
import eventBus from '../../utils/eventBus'
import elDragDialog from "../../directive/el-drag-dialog";
import draggable from 'vuedraggable';
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
import BaseMixins from '../BaseMixins';

export default {
  extends: ComponentBase,
  mixins: [BaseMixins],
  components: {
    draggable,
  },
  directives: {
    resize: VResize,
    elDragDialog
  },
  props: {

  },
  mixins: [],
  data() {
    return {

    };
  },
  computed: {
    list() {
      return []
    },
    GetComponentList(){

      return {
        'height': '100%',
        'display': 'flex',
        'flex-direction': this.element.data.componentListFlexDirection,
        'flex-wrap': this.element.data.componentListFlexWrap
      }
    }
  },
  watch: {
    column: {
      handler: function (val) {
      },
      deep: true,
    },

    element: {
      handler: function (val, old) {
      },
      deep: true,
    },

  },
  beforeCreate() {

  },
  created() {

    eventBus.$on("onDrop", (name)=> {
      console.log("添加组件");
    });

  },
  mounted() {

    console.log("遮罩层...");

  },
  updated() {

  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
