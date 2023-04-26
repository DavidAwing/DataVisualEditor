import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import axios from "axios";
import * as tsx from "vue-tsx-support";
import { Component as tsc } from "vue-tsx-support";
import {
  generateStyleId,
  removeStyleById
} from "@/components/DataVisualEditor/utils/style";
import {
  removeWhitespace
} from "@/components/DataVisualEditor/utils/utils";
import { mapState } from "vuex";
import eventBus from "../../../utils/eventBus";
import { CRUD, getValueByAttributePath, setJsonAttribute } from "../../../utils/chartUtils";
const JSONfn = require("jsonfn").JSONfn;
const equal = require('fast-deep-equal')




class Job {

  static isFlushing = false
  static queue = new Set<Function>()
  static p = Promise.resolve()

  public static queueJob = (job: Function) => {
    Job.queue.add(job)
    if (!Job.isFlushing) {

      Job.isFlushing = true
      Job.p.then(() => {
        try {

          Job.queue.forEach((job: Function) => job())

        } finally {
          Job.isFlushing = false
          Job.queue.clear()
        }

      })
    }
  }

}



(window as any)['getArrayLength'] = (arr: any[]) => {
  return arr.length
}

(window as any)['setValue'] = (target: any, key: string, value: any) => {
  const old = target[key];
  Vue.set(target, key, value)
  return old
}

@Component({
  components: {},
})
export default class StyleListBase extends tsc<Vue> {

  isStyleListInterrupt = false
  isSwitchToStyle = false
  styleMap: any = {} as any
  curStyle: any = {} as any
  oldStyle: any = {} as any
  curSelector: any = ""
  selectedStyle: any = null


  test1() {
    console.log("测试1");
  }

  test2() {
    console.log("测试2");
  }

  protected render(createElement: any) {
    console.log("渲染函数测试", createElement);
  }

  getCurSerieName(index: number | string) {
    if (this.curComponent.data.option === undefined)
      return ""
    const serie = this.curComponent.data.option.series[parseInt(index + "")]
    if (serie === undefined)
      return ""
    return serie.name || ""
  }

  setCurSerieName(index: number | string, extraData: any = undefined) {
    if (this.curComponent.data.option === undefined)
      return
    const serie = this.curComponent.data.option.series[parseInt(index + "")]
    if (serie === undefined)
      return
    if (extraData === undefined)
      return
    serie.name = extraData.eventData.val
  }

  get addedStyleTags() {
    if (this.curComponent.styleList == null) return [];
    return this.curComponent.styleList;
  }

  /**
   * 解释器方法: todo:  获取from对象的数据
   */
  // getValueByAttributePath(from: any, attributePath: string) {

  //   try {
  //     const properties = attributePath.split(".").map(x => x.trim());
  //     let currentObj: any = (from === undefined || from === null || from.constructor.name === 'VueComponent') ? (this) : JSONfn.parse(JSONfn.stringify(from))

  //     for (let i = 0; i < properties.length; i++) {
  //       const property = properties[i];
  //       if (property === "this")
  //         continue

  //       const isArray = /^[a-zA-Z]\w*\[(\d+|\w+)\]$/.test(property);
  //       if (isArray) {
  //         const match = property.match(/([a-zA-Z]+)\[(\d|\w+)\]/);
  //         if (match === null || match.length !== 3) {
  //           throw Error("getValueByAttributePath,格式匹配错误: " + attributePath);
  //         }
  //         let index = parseInt(match[2]);
  //         if (isNaN(index))
  //           throw Error("getValueByAttributePath,格式不正确: " + attributePath);
  //         if (i === properties.length - 1) {
  //           if (currentObj[match[1]][index] !== undefined) {
  //             return currentObj[match[1]][index]
  //           } else {
  //             throw Error(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`)
  //           }
  //         }
  //         currentObj = currentObj[match[1]][index];
  //       } else if (
  //         Object.prototype.toString.call(currentObj) === "[object Object]"
  //       ) {
  //         if (i === properties.length - 1) {
  //           if (currentObj[property] !== undefined) {
  //             return currentObj[property]
  //           } else {
  //             throw Error(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`)
  //           }
  //         }
  //         currentObj = currentObj[property];
  //       }
  //     }
  //     return currentObj
  //   } catch (error) {
  //     console.error("getValueByAttributePath|异常信息", from, attributePath);
  //     throw new Error(`getValueByAttributePath|` + error);
  //   }
  // }

  // '$getArrayLength123  (   "1this.curComponent.data.option.series", aa,  ccc   ,   dd  ,    pp2323,  sdfds5465)'.match(/(?<=,*\s*)"{0,1}\x20*\w+(\w|\.|\x20)*"{0,1}(?=\s*,|\))/g)
  // "$setValue(this.curComponent.data.option, \"max\", $getArrayLength(this.curComponent.data.option.series))".match(/(?<=,*\s*)"{0,1}\x20*\w+(\w|\.|\x20)*"{0,1}(?=\s*,|\))/g)
  // 如果 双引号括起来的,直接传递给方法,如果是@开头或者是字母开头的,是变量,取变量再传给方法, 如果变量是this开头,取this,如果是带.的,
  // todo, 解释器方法: 使用递归解析字符串,并执行字符串, 并返回执行的结果
  // '(this.curStyle.attrList[0].options, "max", $getArrayLength(this.curComponent.data.option.series)+1)'.match(/(?<=,{0,1}\s*)("|\$){0,1}\x20*(\w|\[|\]|\.)+\({0,1}(\w|\.|\x20)*("|\)){0,1}(?=\s*,|\))/g)
  // value也可以是抽象语法树,现在解析字符串是可以了
  executionString(value: any, extraData: any = undefined): any {
    value = typeof value === 'string' ? value.trim() : value

    if (typeof value === 'string' && (value.startsWith("$") || value.startsWith("$this_"))) {

      if (value.includes(";")) {
        const expressionList = value.split(";")

        for (let i = 0; i < expressionList.length; i++) {
          const expression = expressionList[i]
          if (expression.includes(";"))
            throw new Error("表达式异常: " + value);
          this.executionString(expression)
        }
        return undefined
      }

      const functionNameMatches: RegExpMatchArray | null = value.match(/(?<=\$)\w+(?=\x20*\()/g)
      if (functionNameMatches === null) {
        console.warn("executionString|未匹配到方法名称", value);
        return
      }
      const functionName = functionNameMatches[0];
      let argumentList = []
      const argumentsMatches: RegExpMatchArray | null = value.substring(functionName.length + 1).match(
        /(?<=,{0,1}\s*)("|\$|\w|\+|\.|\x20|\+|\*|-|\/|\)|\[|\]|\.|_)*\x20*(\w)+\x20*\({0,1}(\w|\.|\x20|\+|\*|-|\/|\)|\[|\]|\.)*("){0,1}(?=\s*,|\))/g
      )
      if (argumentsMatches === null) {
        console.warn("executionString|未匹配到方法参数", value);
      } else {
        argumentList = argumentsMatches.map((val: string) => {
          val = val.trim()
          if (val.startsWith("\"") && val.endsWith("\"")) {
            return val.substring(1, val.length - 1)
          } else if (val.includes("+") || val.includes("-") || val.includes("*") || val.includes("/")) {

            // 通过运算符分割字符串
            function splitByOperators(str: string): string[] {
              let operators = ['+', '-', '*', '/'];
              let index = -1;
              for (let i = str.length - 1; i >= 0; i--) {
                if (operators.includes(str[i])) {
                  index = i;
                  break;
                }
              }
              if (index === -1) {
                return [str];
              } else {
                let left = str.slice(0, index);
                let right = str.slice(index + 1);
                let leftParts = splitByOperators(left);
                let rightParts = splitByOperators(right);
                return [...leftParts, str[index], ...rightParts];
              }
            }
            // let expressionNodeList:any[] = val.split(/[+\-*/]/); // 正则分割
            let expressionNodeList: any[] = splitByOperators(val);  // 递归分割

            for (let i = 0; i < expressionNodeList.length; i++) {
              const expressionNode = expressionNodeList[i].trim();
              if (expressionNode.startsWith("$")) {
                const returnedValue = this.executionString(expressionNode)
                val = val.replaceAll(expressionNode, returnedValue)
              }
              // todo 如果是变量?
            }

            // todo eval需要替换成更好的方式
            return eval(val)
          } else if (val.startsWith("$")) {
            return this.executionString(val)
          } else if (val.startsWith("this")) {

            if (val.endsWith(")") && !val.includes("("))
              val = val.substring(0, val.length - 1)
            return getValueByAttributePath.bind(this)(this, val)
          } else if (false) {
            // todo 如果是变量?
            return undefined
          } else {
            return val
          }
        });
      }

      let isUndefined = false
      if (argumentList === undefined || argumentList === null || argumentList.length === 0)
        isUndefined = true
      if (Array.isArray(argumentList)) {
        argumentList.forEach(argument => {
          if (argument === undefined || argument === null)
            isUndefined = true
        });
      }

      try {
        return functionName.startsWith("this_") ? (this as any)[functionName.substring(5)](...argumentList, extraData) : (window as any)[functionName](...argumentList, extraData);
      } catch (error) {
        throw new Error(`executionString|方法执行出现异常: functionName=${functionName}    argumentList=${argumentList.join(",")}`);
      }
    }
    return value
  }


  get curComponent() {
    this.isSwitchToStyle = true;
    return this.$store.state.curComponent;
  }

  get showStyleDetails() {
    return JSON.stringify(this.curStyle) !== "{}";
  }

  get styleList() {

    const key = "styleList:" + this.curComponent.component;
    if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return this.styleMap[key];

    if (this.isStyleListInterrupt) return [];

    this.isStyleListInterrupt = true;
    axios
      .get("/BI/Component/GetStyleList", {
        params: {
          name: this.curComponent.component,
        },
        timeout: 1000 * 60,
      })
      .then(({ data }) => {
        this.isStyleListInterrupt = false;
        if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return;
        if (data.data === undefined || data.data === null || data.data.length === 0) {
          console.warn("组件未配置样式");
          Vue.set(this.styleMap, key, []);
          return;
        }
        Vue.set(this.styleMap, key, data.data);
      })
      .catch((error) => {
        console.warn("获取样式异常: " + error);
        this.isStyleListInterrupt = false;
      });
    return [];
  }

  get componentStyleList() {
    return this.curComponent.styleList
  }

  get selectorList() {

    // chart
    if (this.curComponent.component.startsWith("vc-")) {

      const series = this.curComponent.data.option.series
      const selectorList = []
      for (let i = 0; i < series.length; i++) {
        selectorList.push(
          {
            label: series[i].name,
            value: series[i].id,
            type: series[i].type,
          }
        )
      }
      return selectorList
    } else if (this.curComponent.component.startsWith("v-")) {

      const key = "selectorList:" + this.curComponent.component;
      if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return this.styleMap[key];
      if (this.isStyleListInterrupt) return [];
      this.isStyleListInterrupt = true;
      axios
        .get("/BI/Component/GetSelectorList", {
          params: {
            name: this.curComponent.component,
          },
          timeout: 1000 * 60,
        })
        .then(({ data }) => {
          this.isStyleListInterrupt = false;
          if (Object.prototype.hasOwnProperty.call(this.styleMap, key)) return;
          if (data.data === undefined || data.data === null || data.data.length == 0) {
            console.warn("组件未配置选择器");
            return;
          }
          Vue.set(this.styleMap, key, data.data);
        })
        .catch((error) => {
          console.warn("获取选择器异常: " + error);
          this.isStyleListInterrupt = false;
        });

      return [];
    }

  }

  constructor() {
    super()
    console.log("样式组件基类创建组件");
  }

  public created() {

    console.log("样式组件基类创建组件: created");
    this.isStyleListInterrupt = false;
    this.isSwitchToStyle = false;

    this.$watch('curStyle', (val, old) => {

      if (JSON.stringify(this.curStyle) === "{}")
        return
      let attributePath = this.curStyle.value.split("~~~")[0]
      const cssData: any = {};
      this.curStyle.attrList.forEach((attr: any) => {
        let attrKey = "";
        const variable = attr.variable.trim();
        !variable.startsWith("@")
          ? (attrKey = variable)
          : (attrKey = variable.substring(1));

        if (attrKey === undefined || attrKey.trim() === "")
          return
        cssData[attrKey] = attr.value;
      });

      const pathVariables: string[] = []
      if (attributePath.includes("@")) {
        const regex = /@\w+(?=[\x20\].])/g;
        const match = attributePath.match(regex); // ['@index', '@aaindex']
        match.forEach((placeholder: string) => {
          if (placeholder.trim() === "" || placeholder.trim() === "@")
            return
          const key = placeholder.substring(1);
          pathVariables.push(key)
          attributePath = attributePath.replaceAll(placeholder, cssData[key]);
        });
      }

      if (this.curStyle !== undefined && this.curStyle.attrList !== undefined) {
        for (let i = 0; i < this.curStyle.attrList.length; i++) {
          const attr = this.curStyle.attrList[i];
          if (attr === undefined)
            continue
          if (Object.prototype.toString.call(attr.options) === "[object Object]") {
            const keys = Object.keys(attr.options)
            keys.filter(key => key.startsWith("onOptionChange")).forEach((key: string) => {
              let str = attr.options[key]
              if (Array.isArray(str))
                str = str.join(";")
              const returnedValue = this.executionString(str)
            })
          }
        }
      }

      if (this.isSwitchToStyle) {
        console.log("修改样式A", val, JSON.stringify(this.curStyle) === "{}");
      } else {

        if (!(JSON.stringify(this.curStyle) === "{}")) {
          if (this.curStyle.type === "chart") {
            // 如果是路径变量修改,则把数据绑定回来
            let isPathChange = false
            if (JSONfn.stringify(this.oldStyle) !== "{}" && this.oldStyle.value === this.curStyle.value) {
              const newValueList: any[] = []
              const oldValueList: any[] = []
              for (let i = 0; i < pathVariables.length; i++) {
                const pathVariable = pathVariables[i];
                for (let j = 0; j < this.curStyle.attrList.length; j++) {
                  const attr = this.curStyle.attrList[j]
                  if (attr['variable'] === pathVariable)
                    newValueList.push(attr.value)
                }
                for (let j = 0; j < this.oldStyle.attrList.length; j++) {
                  const attr = this.oldStyle.attrList[j]
                  if (attr['variable'] === pathVariable)
                    oldValueList.push(attr.value)
                }
              }
              if (JSON.stringify(newValueList) !== JSON.stringify(oldValueList))
                isPathChange = true
            }

            if (isPathChange) {
              let optionValue = getValueByAttributePath(this.curComponent.data.option, attributePath)
              if (optionValue === undefined || optionValue === null) {
                console.warn("获取不到数据", attributePath, this.curComponent.data.option);
                optionValue = {}
                optionValue = { ...cssData }
                const newOption = setJsonAttribute(this.curComponent.data.option, attributePath, optionValue)
                // 设置新的newOption
                eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
                this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
                return
              }
              this.curStyle.attrList.forEach((attr: any) => {
                if (attr["variable"] !== undefined && optionValue[attr["variable"]] !== undefined
                  && attr["value"] !== optionValue[attr["variable"]]) {
                  attr["value"] = optionValue[attr["variable"]]
                }
              })
            } else {
              const newOption = setJsonAttribute(this.curComponent.data.option, attributePath, cssData)
              eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
            }
            this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
          }
          return
        }
      }

      if (JSON.stringify(this.curStyle) === "{}")
        return
      if (this.curStyle.type === "css") {
        this.isSwitchToStyle = false
      } else if (this.curStyle.type === "chart") {
        let optionValue = getValueByAttributePath(this.curComponent.data.option, attributePath)
        if (optionValue === undefined || optionValue === null) {
          optionValue = {}
          optionValue = { ...cssData }
          const newOption = setJsonAttribute(this.curComponent.data.option, attributePath, optionValue)
          // 设置新的newOption
          eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
        } else {
          if (!this.isSwitchToStyle)
            return
          // 绑定图形option数据
          this.curStyle.attrList.forEach((attr: any) => {
            if (attr["variable"] !== undefined && optionValue[attr["variable"]] !== undefined
              && attr["value"] !== optionValue[attr["variable"]]) {
              attr["value"] = optionValue[attr["variable"]]
            }
          })
          this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
        }
        this.isSwitchToStyle = false
      }
    }, { deep: true, immediate: false })


    this.$watch('curSelector', (val: any, old) => {

      console.log("选择器改变", val);
      console.log("选择器改变", this.selectorList);

    }, { deep: true });


    this.$watch('styleList', (val, old) => {




      if (!this.isSwitchToStyle) return;
      if (
        this.addedStyleTags === undefined ||
        this.addedStyleTags.length === 0
      ) {
        console.warn("组件未应用任何样式...");
        return;
      }
      if (val === undefined || val.length === 0) {
        console.warn("组件未配置任何样式...");
        return;
      }


      if (this.curComponent.component.startsWith("v-")) {

      }

      // todo, 需要切换到组件最后一次编辑的项
      const style = this.addedStyleTags[0];
      this.handleStyleChange(this.getHierarchy(style.hierarchy));
      this.switchToStyle(style);
      this.isSwitchToStyle = false;


    }, { deep: true, immediate: true });

    this.$watch('selectedStyle', (val, old) => {
      this.handleStyleChange(val);
    }, { deep: true })


    this.$watch('componentStyleList', (val, old) => {

      console.log("当前样式修改解析数据0", this.curStyle.attrList);

    }, { deep: true, immediate: true })

  }

  public mounted() {
    console.log("样式组件基类创建组件: mounted");
  }

  get canvasName() {
    return mapState(["canvasName"])
  }

  // 获取样式id
  public getAddedStyleId(style: any): string | undefined {

    // const style = this.curStyle;
    const component = this.curComponent;
    if (style.css === undefined || style.css === null || style.css.trim().length === 0) {
      console.warn("请选择样式");
      return undefined;
    }

    const styleArr: string[] | undefined = this.getHierarchy(style.hierarchy);
    if (styleArr === undefined) {
      console.warn("没有找到...");
      return undefined
    }

    const cssData: any = {};
    this.curStyle.attrList.forEach((attr: any) => {
      let attrKey = "";
      const variable = attr.variable.trim();
      !variable.startsWith("@")
        ? (attrKey = variable)
        : (attrKey = variable.substring(1));
      cssData[attrKey] = attr.value;
    });

    let styleValue = this.curStyle.value;
    if (styleValue.includes("@")) {
      const regex = /@\w+(?=[\x20\].])/g;
      const match = styleValue.match(regex); // ['@index', '@aaindex']
      match.forEach((placeholder: string) => {
        const key = placeholder.substring(1);
        styleValue = styleValue.replaceAll(placeholder, cssData[key]);
      });
    }

    const styleId = removeWhitespace(
      this.canvasName +
      "-" +
      component.id +
      "-" +
      styleArr[0] + // 父样式
      "-" +
      styleValue
    );

    return styleId
  }

  public getAddedStyle(styleId: string | undefined = undefined) {

    if (styleId === undefined)
      styleId = this.getAddedStyleId(this.curStyle)
    if (styleId == undefined)
      return undefined
    if (styleId === undefined || styleId === null || typeof styleId !== "string" || styleId.trim().length === 0)
      return undefined

    for (let i = 0; i < this.curComponent.styleList.length; i++) {
      const style = this.curComponent.styleList[i];
      if (style.styleId === styleId)
        return style
    }
    return undefined
  }



  // 获取当前样式的层级
  getHierarchy(hierarchy: string) {

    // const regex = /\[([^\]\s]*)\]/g;

    if (hierarchy === undefined || !hierarchy.includes("[") || !hierarchy.includes("]")) {
      console.warn("getHierarchy|格式错误", hierarchy);
      return
    }
    const styleArr = [];
    const regex = /^\[(.+?)\]\[(.+?)\]$/;
    const match = hierarchy.match(regex);
    if (match !== null && match.length > 0) {
      styleArr[0] = match[1]
      styleArr[1] = match[2]
    } else {
      console.warn(`样式的hierarchy不正确`, hierarchy);
      return undefined;
    }

    // let match;
    // while ((match = regex.exec(hierarchy)) !== null)
    //   styleArr.push(match[1]);

    if (styleArr.length !== 2) {
      console.warn(`样式的hierarchy不正确`, hierarchy);
      return undefined;
    }
    return styleArr
  }

  handleStyleChange(nodes: any) {
    for (let i = 0; i < this.styleList.length; i++) {
      const category = this.styleList[i];
      if (category.children && category.value === nodes[0])
        for (let j = 0; j < category.children.length; j++) {
          const style = category.children[j];
          if (style.value === nodes[1]) {
            this.curStyle = style;
            this.curStyle.hierarchy = `[${nodes[0]}][${nodes[1]}]`;
            return;
          }
        }
    }
  }

  handleStyleTagsClose(closeStyle: any) {
    const index = this.curComponent.styleList.indexOf(closeStyle);
    Vue.delete(this.curComponent.styleList, index)
    if (closeStyle.type === "chart") {
      // todo 移除样式,恢复为echarts默认的样式
      const style = this.curComponent.styleList[index];
      // this.curComponent.styleList.splice(index, 1);
      // removeStyleById();
    } else if (closeStyle.type === "css") {
      // const index = this.curComponent.styleList.indexOf(closeStyle);
      const style = this.curComponent.styleList[index];
      // this.curComponent.styleList.splice(index, 1);
      removeStyleById(generateStyleId(style.styleId, this.curComponent.id));
    } else {
      console.warn(`handleStyleTagsClose|无法删除的样式`, closeStyle);
    }
  }

  switchToStyle(style: any) {

    if (style === undefined)
      return
    this.curSelector = style.selector;
    const styleArr = this.getHierarchy(style.hierarchy);
    if (styleArr === undefined || styleArr.length !== 2) return;
    this.selectedStyle = styleArr;
    if (this.curStyle === undefined || this.curStyle.attrList === undefined) {
      console.warn(`switchToStyle|当前样式异常: `, style);
      return;
    }

    this.$nextTick(() => {
      for (let i = 0; i < this.curStyle.attrList.length; i++) {
        const attr = this.curStyle.attrList[i];
        const key = attr.variable.startsWith("@")
          ? attr.variable.substring(1)
          : attr.variable;
        if (style.cssData !== undefined &&
          Object.prototype.hasOwnProperty.call(style.cssData, key))
          attr.value = style.cssData[key];
      }
    })
  }


  // todo 处理属性的数据改变事件
  onStyleAttrValueChange(...args: any[]) {
    console.log("样式数据发生改变", args) // 显示一个对象的所有属性和方法

    // const style = this.addedStyleTags[0];
    // console.log("样式解析数据0", args, style);

    // aaa-0-vc-series-series[1].backgroundStyle~~~series-backgroundStyle.js
    // aaa-0-vc-series-series[0].backgroundStyle~~~series-backgroundStyle.js
    // aaa-0-vc-series-series[0].backgroundStyle~~~series-backgroundStyle.js

    // todo 解析字符串设置数据
    this.$nextTick(() => {

    })

    args[0].forEach((str: string | undefined) => {
      if (typeof str !== 'string' || str.trim() === "")
        return
      this.executionString(str, args[1])
    });

    // restoreAttrList: 恢复
    /**
     * attrList[attrIndex].variable如果在style.css里没有,则设置style.value里面的同名变量,并恢复之前保存的数据
     */

  }

}