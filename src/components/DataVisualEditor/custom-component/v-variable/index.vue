<!-- eslint-disable vue/no-v-html -->
<template>
  <div style="width: 100%;height: 100%;">
    <v-variable-component class="v-variable" ref="variable-component" />
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

      if (!location.hash.includes('/editor') && this.element.data.componentName) {
        this.element.style.backgroundColor = 'transparent'
      }

      this.$watch(() => this.element.data.componentName, async (val) => {

        console.log('可变组件');
        if (!val) {
          this.$options.components['v-variable-component'] = null
          this.$forceUpdate()
          return
        }

        const { data } = await axios.get(`/BI-API/Component/GetVueComponent?name=${val}`)
        if (!data) {
          console.warn(`可变组件${val}未找到`);
          this.$options.components['v-variable-component'] = null
          this.$forceUpdate()
          return
        }

        let vue = null
        if (data.type === 'VUE-SFC') {





          /**
           *
           * @param {string} script
           */
          const replaceImport = (script) => {

            const match = /.*export\s+default\s+{/.exec(script)
            let importArr = null
            let scriptBody = ''
            if (match != null) {
              importArr = script.substring(0, match.index).split('\n')
              scriptBody = script.substring(match.index)
            } else {
              return script
            }

            for (let i = 0; i < importArr.length; i++) {
              const str = importArr[i].trim();

              if (str === '') {
                continue
              }

              if (str.startsWith('//')) {
                continue
              }

              if (str.startsWith('\\*') && str.endsWith("*/")) {
                continue
              }

              let name = ''
              if (/import\s+[\w_]+\s+from\s+('|"){1}[\w-_]+('|"){1}/.test(str)) {  // import axios from 'axios'
                const end = str.indexOf('from')
                name = str.substring(6, end).trim()
              } else if (/import\s+\{{1}(.*)\}{1}\s+from\s+('|"){1}[\w-]+('|"){1}/g.test(str)) {  //  import { Dialog } from 'element-ui';
                const end = str.indexOf('from')
                let line = str.substring(6, end).trim()
                line = line.substring(1, line.length - 1)

                const moduleName = str.match(/(?<=from\s+('|")).*(?=('|"))/g)


                let importLine = ''
                line.split(',').forEach(name => {
                  name = name.trim()
                  importLine += `const ${name} = bi['${moduleName}.${name}'] ?? bi.utils.getModule(\`${str}\`, '${moduleName}.${name}');\n`
                })

                importArr[i] = importLine
                continue
              } else if (/const\s+[\w_]+\s+=\s+require\s*\(('|"){1}[\w-_]+('|")\)/.test(str)) {  // "const JSONfn = require('jsonfn').JSONfn;"
                const end = str.indexOf('=')
                name = str.substring(5, end).trim()
              }

              importArr[i] = `const ${name} = bi['${name}'] ?? bi.utils.getModule(\`${str}\`)`
            }

            return importArr.join('\n') + '\n' + scriptBody
          }



          /**
           *
           * @param {string} vueContents
           * * @param {string} lessContents
           * @returns
           */
          const convertVueFile = async (vueContents, lessContents) => {

            const vue = {
              'template': '',
              'script': '',
              'css': '',
            }

            let start = vueContents.search(/<script\s+lang\s*=\s*("|')js("|')\s*>/i)
            if (start === -1)
              start = vueContents.search(/<script\s*>/i)
            vue.script = vueContents.substring(start, vueContents.search(/<\/script\s+>/i))
            vue.script = vue.script.substring(vue.script.indexOf('>') + 1, vue.script.lastIndexOf('}') + 1).trim()
            vue.script = replaceImport(vue.script)
            // todo: 替换所有的import变量, import axios from 'axios'
            // @转换成v-on:         这里不用替换

            vue.template = vueContents.substring(0, start)
            vue.template = vue.template.substring(vue.template.indexOf('>') + 1)
            vue.template = vue.template.substring(0, vue.template.lastIndexOf('<')).trim()

            const lessOutput = await less.render(lessContents)
            vue.css = lessOutput.css

            return vue
          }

          vue = await convertVueFile(data.vue, data.less)
        } else {
          vue = data
        }

        const template = vue.template
        const script = vue.script
        const css = vue.css
        const component = (await CompileToModule(script)).default


        const compiled = Vue.compile(template);
        component.render = compiled.render
        component.staticRenderFns = compiled.staticRenderFns

        // todo class绑定name
        this.$options.components['v-variable-component'] = component



        this.$forceUpdate()

        this.$nextTick(() => {

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
