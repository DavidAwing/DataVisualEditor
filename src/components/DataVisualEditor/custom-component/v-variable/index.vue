<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="v-variable" style="position: absolute; left: 0;top: 0; width: 100%;height: 100%;">
    <v-variable-component ref="variable-component" />
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
  import { getStyle } from "../../utils/style";

  const JSONfn = require('jsonfn').JSONfn;

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
        component: null
      };
    },
    computed: {
      ...mapState([
      "canvasData"
    ]),
      list() {
        return []
      },
      GetComponentList() {

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

      eventBus.$on("onDrop", (name) => {
        console.log("添加组件");
      });

      this.$watch(() => this.element.data.componentName, async (val) => {

        if (!val) {
          return
        }

        const { data } = await axios.get(`/BI-API/Component/GetVueComponent?name=${val}`)
        if (!data) {
          console.warn(`可变组件${val}未找到`);
          return
        }

        const template = data.template
        const script = data.script
        const css = data.css
        const component = (await CompileToModule(script)).default


        const compiled = Vue.compile(template);
        component.render = compiled.render
        component.staticRenderFns = compiled.staticRenderFns


        // class绑定name

        this.$options.components['v-variable-component'] = component
        this.$forceUpdate()


        this.$nextTick(() => {
          // bi.utils.makeDraggable(document.getElementsByClassName('shape')[2])
          // console.log('可变移动', document.getElementsByClassName('shape')[2]);

        })

        // const component = {
        //   render: compiled.render,
        //   staticRenderFns: compiled.staticRenderFns,
        // data() {
        //   return {
        //     message: 'Hello world!'
        //   }
        // },
        // props: {
        //   ppp: {
        //     type: String,
        //     default: "测试默认数据"
        //   }
        // },
        // mounted() {
        //   console.log('测试模板数据111', this.ppp);

        //   setTimeout(() => {
        //     this.message = 'sdfsdf'
        //   }, 300);
        // },
        // methods: {
        //   test() {
        //     console.log('测试模板数据11133333', compiled);
        //   }
        // },
        // watch: {
        //   message: (val) => {
        //     console.log('测试模板数据1观察 ', val);
        //   }
        //   // message: {
        //   //   handler: function (val) {
        //   //     console.log('测试模板数据1观察 ', val);
        //   //   },
        //   //   deep: true,
        //   // },
        // }
        // }



      }, { immediate: true })

    },
    mounted() {
    //  $('.v-variable').parent('.shape').css('background-color', 'transparent')


    },
    updated() {

    },
    methods: {
      getComponentStyle() {
        return getStyle(this.element.style, this.element.styleUnit, this.canvasData.scale / 100);
      }
    }
  };
</script>

<style lang="less" scoped>
  @import 'index.less';
</style>
