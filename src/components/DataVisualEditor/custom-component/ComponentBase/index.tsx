

import Vue, { PropType, VNode, CreateElement } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { getRandStr } from "../../utils/utils";
import { stringToFunction, CompileSourcecode, CompileToModule, CompileTypescriptToIIFE } from '../../utils/compiler'
import axios from 'axios';


@Component({
  components: {},
})
export default class ComponentBase extends Vue {

  @Prop({ required: true }) element!: any;

  static EventMap: any = {}



  public async onEvent(name: string, data = {}) {

    let func = ComponentBase.EventMap[this.element.data.name + '.' + name];
    if (!func) {
      const event = this.element.events[name];

      if (!event) {
        console.warn(`onEvent|组件${this.element.data.name}未定义${name}事件`);
        return
      }

      let lines = null
      const AIIndex: number[] = []
      const isAI = (index: number) => {

        if (AIIndex.length === 1) {
          if (index > AIIndex[0]) {
            return true
          } else {
            return false
          }
        }

        for (let i = 0; i < AIIndex.length; i += 2) {
          if (index > AIIndex[i] && index < AIIndex[i + 1]) {
            return true
          }
        }
        return false
      }

      if (/@AI/i.test(event)) {
        const parts = event.split(/(@AI)+/) as string[];
        lines = parts.filter(part => part.trim() !== '').flatMap(text => {
          return text.split(/\r\n|\r|\n/).filter(str => str)
        });

        lines.forEach((str, i) => {
          // 单个语句
          if (/^@AI\s+\w+/i.test(str)) {
            return null
          }
          // 多个语句
          else if (/^@AI/i.test(str)) {
            AIIndex.push(i)
          }
        })

        lines.filter(str => str.toUpperCase() !== '@AI')
      } else {
        lines = event.split(/\r\n|\r|\n/)
      }

      const conversionCode = async (lines: string[]) => {


        const resolvedArr = await Promise.all(lines.map(async (line: string, index: number) => {

          line = line.trim();

          if (line.toUpperCase() === '@AI') {
            return null;
          } else if (/^@AI\s+\w+/i.test(line)) {
            line = line.substring(4).trim()
          } else {
            if (!isAI(index)) {
              return line
            }
          }

          const { state, data } = (await axios.post(`/BI-API/AI/ConversionCode`, { code: line, component: this.element.component }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })).data

          if (state !== 200) {
            throw new Error(`onEvent|转换代码异常|code: ${line},component: ${this.element.component}`);
          }

          switch (data.type) {
            case 'Link':

              break;
            case 'Script':
            case 'Function':
              return data.code
            case 'ParseFunction': {

              const arr = line.split(/\s+/).splice(1).map((s: any) => {
                if (s.toLowerCase() === 'false') {
                  return false
                } else if (s.toLowerCase() === 'true') {
                  return true
                }
                return isNaN(s) ? s : Number(s)
              })

              const func = (await Promise.resolve(stringToFunction(data.code)(line)))

              let parameters = ""
              arr.forEach(item => {
                if (typeof item === 'boolean' || typeof item === 'number') {
                  parameters += item + ","
                } else if (typeof item === 'string') {
                  parameters += '"' + item + "\","
                } else {
                  parameters += item + ","
                }
              })

              return '(' + func.toString() + ')' + `(${parameters.substring(0, parameters.length - 1)})`;
            }
            default:
              console.error('onEvent|AI编译|无法识别的输入', line);
              return line;
          }

        }))

        return (resolvedArr.map((statement: any) => {
          switch (typeof statement) {
            case 'string':
              return statement.endsWith(';') ? statement : statement + ";";
            case 'function': {
              return '(' + statement.toString() + ')' + '();'
            }
            default:
              return null;
          }
        }).filter((item: any) => item).join(''))
      }

      const codeStatements = await conversionCode(lines)

      func = stringToFunction(`function ${name}(param) {${codeStatements}}`)

      if (!func) {
        console.warn(`onEvent|组件${this.element.data.name}未定义${name}事件`);
        return;
      }

      if (typeof func != 'function') {
        console.warn(`onEvent|组件${this.element.data.name}的${name}事件不是function`);
        return;
      }

      if (!location.hash.includes('/editor')) {
        ComponentBase.EventMap[this.element.data.name + '.' + name] = func
      }
    }

    func.bind(this)({
      component: this,
      data: { ...data },
      element: this.element
    });
  }

  // todo: 撑满父组件

  constructor() {
    super()
    this.$watch('element', (newValue, oldValue) => {
      console.log("");
    }, { deep: true, immediate: true });
  }

  // render(createElement: CreateElement) {
  //   const baseId = getRandStr()
  //   return createElement(
  //     'div',   // 标签名称
  //     {
  //       attrs: {
  //         id: this.element.data.baseId ?? baseId
  //       }
  //     },
  //     this.$slots.default // 子节点数组
  //   )
  // }

  public created() {
    // this.element.data.p = "父组件挂载的数据"
    this.onEvent('onCreated')

    Vue.set(this.element, '_', this)
    Object.defineProperty(this.element, "_", { enumerable: false })

    if (!this.element.eventOptions)
      this.element.eventOptions = []

    if (!this.element.eventOptions.find((m: any) => m.label === "创建前")) {
      this.element.eventOptions.unshift({
        label: "销毁后",
        value: "onDestroy"
      })
      this.element.eventOptions.unshift({
        label: "销毁前",
        value: "onBeforeDestroy"
      })
      this.element.eventOptions.unshift({
        label: "更新后",
        value: "onUpdated"
      })
      this.element.eventOptions.unshift({
        label: "更新前",
        value: "onBeforeUpdate"
      })
      this.element.eventOptions.unshift({
        label: "挂载后",
        value: "onMounted"
      })
      this.element.eventOptions.unshift({
        label: "挂载前",
        value: "onBeforeMount"
      })
      this.element.eventOptions.unshift({
        label: "创建后",
        value: "onCreated"
      })
      this.element.eventOptions.unshift({
        label: "创建前",
        value: "onBeforeCreate"
      })
    }
  }

  public mounted() {
    this.onEvent('onMounted')




    // <top-el-dialog
    // id="test-dialog"
    //   title="编辑表头"
    //   :visible.sync="visible"
    //   :isModalDialog="isModalDialog"
    //   width="35%"
    //   v-el-drag-dialog
    //   center
    //   v-if="sssssss"
    // >

    // <div style="display: inline;">1113213232132</div>
    // <span slot="footer" class="dialog-footer">
    //   <el-button>取 消</el-button>
    //   <el-button type="primary">确 定</el-button>
    // </span>
    // </top-el-dialog>

  }



}
