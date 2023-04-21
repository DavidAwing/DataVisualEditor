import Vue, { PropType, VNode } from "vue";
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import axios from "axios";
import * as tsx from "vue-tsx-support";
import { Component as tsc } from "vue-tsx-support";
import {
  generateStyleId,
  removeStyleById
} from "@/components/DataVisualEditor/utils/style";
const JSONfn = require("jsonfn").JSONfn;


(window as any)['getArrayLength'] = (arr:any[])=>{
  return arr.length
}

(window as any)['setValue'] = (target:any, key:string, value:any)=>{
  Vue.set(target, key, value)
  return "数据设置成功"
}

@Component({
  components: {},
})
export default class StyleListBase extends tsc<Vue> {

  isStyleListInterrupt = false
  isSwitchToStyle = false
  styleMap: any = {} as any
  curStyle: any = {} as any
  curSelector: any = ""
  selectedStyle: any = null

  get addedStyleTags() {
    if (this.curComponent.styleList == null) return [];
    return this.curComponent.styleList;
  }


  /**
   * 解释器方法: todo:  获取from对象的数据
   */
  getValueByAttributePath(from: any, attributePath: string) {
 
    const properties = attributePath.split(".").map(x => x.trim());
    let currentObj: any = (from === undefined || from === null || from.constructor.name === 'VueComponent') ? (this) : JSONfn.parse(JSONfn.stringify(from))

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (property === "this")
        continue

      const isArray = /^[a-zA-Z]\w*\[(\d+|\w+)\]$/.test(property);
      if (isArray) {
        const match = property.match(/([a-zA-Z]+)\[(\d|\w+)\]/);
        if (match === null || match.length !== 3) {
          throw Error("setJsonAttribute,格式匹配错误: " + attributePath);
        }
        let index = parseInt(match[2]);
        if (isNaN(index))
          throw Error("setJsonAttribute,格式不正确: " + attributePath);
        if (i === properties.length - 1) {
          if (currentObj[match[1]][index] !== undefined) {
            return currentObj[match[1]][index]
          } else {
            throw Error(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`)
          }
        }
        currentObj = currentObj[match[1]][index];
      } else if (
        Object.prototype.toString.call(currentObj) === "[object Object]"
      ) {
        if (i === properties.length - 1) {
          if (currentObj[property] !== undefined) {
            return currentObj[property]
          } else {
            throw Error(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`)
          }
        }
        currentObj = currentObj[property];
      }
    }
    return currentObj
  }


        // '$getArrayLength123  (   "1this.curComponent.data.option.series", aa,  ccc   ,   dd  ,    pp2323,  sdfds5465)'.match(/(?<=,*\s*)"{0,1}\x20*\w+(\w|\.|\x20)*"{0,1}(?=\s*,|\))/g)
      // "$setValue(this.curComponent.data.option, \"max\", $getArrayLength(this.curComponent.data.option.series))".match(/(?<=,*\s*)"{0,1}\x20*\w+(\w|\.|\x20)*"{0,1}(?=\s*,|\))/g) 
      // 如果 双引号括起来的,直接传递给方法,如果是@开头或者是字母开头的,是变量,取变量再传给方法, 如果变量是this开头,取this,如果是带.的,
  // todo, 解释器方法: 使用递归解析字符串,并执行字符串, 并返回执行的结果
        // '(this.curStyle.attrList[0].options, "max", $getArrayLength(this.curComponent.data.option.series)+1)'.match(/(?<=,{0,1}\s*)("|\$){0,1}\x20*(\w|\[|\]|\.)+\({0,1}(\w|\.|\x20)*("|\)){0,1}(?=\s*,|\))/g)
  // value也可以是抽象语法树,现在解析字符串是可以了
  executionString(value: any):any {

    value = typeof value === 'string' ? value.trim() : value

    if (typeof value === 'string' && value.startsWith("$")) {
      const functionNameMatches: RegExpMatchArray | null = value.match(/(?<=\$)\w+(?=\x20*\()/g)
      if (functionNameMatches === null) {
        console.warn("executionString|未匹配到方法名称", value);
        return
      }
      const functionName = functionNameMatches[0];
      let argumentList = []
      const argumentsMatches: RegExpMatchArray | null = value.substring(functionName.length + 1).match(
        /(?<=,{0,1}\s*)("|\$|\w|\+|\.|\x20|\+|\*|-|\/|\)|\[|\]|\.)*\x20*(\w)+\x20*\({0,1}(\w|\.|\x20|\+|\*|-|\/|\)|\[|\]|\.)*("){0,1}(?=\s*,|\))/g
        )
      if (argumentsMatches === null) {
        console.warn("executionString|未匹配到方法参数", value);
      } else {
        argumentList = argumentsMatches.map((val: string) => {
          val = val.trim()
          if (val.startsWith("\"") && val.endsWith("\"")) {
            return val.substring(1, val.length-1)
          } else if (val.includes("+") || val.includes("-") || val.includes("*") || val.includes("/")) {
  
            // 通过运算符分割字符串
            function splitByOperators(str:string):string[] {
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
            let expressionNodeList:any[] = splitByOperators(val);  // 递归分割

              for (let i = 0; i < expressionNodeList.length; i++) {
                const expressionNode = expressionNodeList[i].trim();
                if (expressionNode.includes("$")) {
                  const returnedValue = this.executionString(expressionNode)
                  val = val.replaceAll(expressionNode, returnedValue)
                }
                // todo 如果是变量?
              }

              // todo eval需要替换成更好的方式
             return  eval(val)
          } else if (val.includes("$")) {
            return this.executionString(val)
          } else if(val.startsWith("this")) {
            return this.getValueByAttributePath(this, val)
          }  else if (false) {
            // todo 如果是变量?
          } else {
            return val
          }
        });
      }
      return (window as any)[functionName](...argumentList);
    }
    return value
  }

  get curComponent() {
    this.isSwitchToStyle = true;
    return this.$store.state.curComponent;
  }

  get showStyleDetails() {
    return JSON.stringify(this.curStyle) === "{}";
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

  get selectorList() {
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

  constructor() {
    super()
    console.log("样式组件基类创建组件");
  }

  public created() {
    console.log("样式组件基类创建组件: created");
    this.isStyleListInterrupt = false;
    this.isSwitchToStyle = false;

    this.$watch('curStyle', (val, old) => {
      this.isSwitchToStyle = false
    })

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

      // todo, 需要切换到组件最后一次编辑的项
      const style = this.addedStyleTags[0];

      this.handleStyleChange(this.getHierarchy(style.hierarchy));
      this.switchToStyle(style);
      this.isSwitchToStyle = false;

    }, { deep: true, immediate: true });

    this.$watch('selectedStyle', (val, old) => {
      this.handleStyleChange(val);
    }, { deep: true })
  }

  public mounted() {
    console.log("样式组件基类创建组件: mounted");
  }

  // 获取当前样式的层级
  getHierarchy(hierarchy: string) {

    // const regex = /\[([^\]\s]*)\]/g;

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

    if (closeStyle.type === "chart") {
      const index = this.curComponent.styleList.indexOf(closeStyle);
      const style = this.curComponent.styleList[index];
      this.curComponent.styleList.splice(index, 1);
      // todo 移除样式,恢复为echarts默认的样式
      // removeStyleById();
    } else if (closeStyle.type === "css") {
      const index = this.curComponent.styleList.indexOf(closeStyle);
      const style = this.curComponent.styleList[index];
      this.curComponent.styleList.splice(index, 1);
      removeStyleById(generateStyleId(style.styleId, this.curComponent.id));
    } else {
      console.warn(`handleStyleTagsClose|无法删除的样式`, closeStyle);
    }

  }

  switchToStyle(style: any) {

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
    });
  }


  // todo 处理属性的数据改变事件
  onStyleAttrValueChange(...args: any[]) {
    console.log("样式数据发生改变", args) // 显示一个对象的所有属性和方法

    console.log("解析数据0", this.curStyle.attrList[0].options    );

    // todo 解析字符串设置数据
    this.$nextTick(()=>{
      for (let i = 0; i < args[0].length; i++) {
        const str = args[0][i];
        const res = this.executionString(str)
        console.log("解析数据1", this.curStyle.attrList[0].options);
        console.log("解析数据2", res);
      }
    })


    

    // restoreAttrList: 恢复
    /**
     * attrList[attrIndex].variable如果在style.css里没有,则设置style.value里面的同名变量,并恢复之前保存的数据
     */

  }







}
