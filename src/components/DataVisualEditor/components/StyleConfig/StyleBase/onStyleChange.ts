
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
import { stringToFunction, CompileTypescriptToIIFE, CompileToModule } from "../../../utils/compiler";
import {
  CRUD, getValueByAttributePath, setJsonAttribute, SetValueAndAttributePathFromKey,
  typeEqual
} from "../../../utils/chartUtils";
import * as echarts from "echarts";
import { EsModule } from "vue/types/options";

const JSONfn = require("jsonfn").JSONfn;
const equal = require('fast-deep-equal')


let StyleChangeState: any = {
  code: "",
  date: new Date()
}

export default async function onStyleChange(this: any, val: any, old: any) {

  if (StyleChangeState.code === "TAG-0") {
    const diff = new Date().getTime() - StyleChangeState.date.getTime();
    console.log("导致无限循环的时间差", diff);
    if (diff < 50) {
      return
    }
  }

  const curStyle = val
  if (JSONfn.stringify(curStyle) === "{}")
    return


  console.log("无限循环AAA1");


  // 解决修改数据死循环
  // this.functionTimeList.push(new Date())
  // const size = 2
  // if (this.functionTimeList.length > size) {
  //   let totalDiff = 0;
  //   for (let i = 1; i < this.functionTimeList.length; i++) {
  //     const diff = this.functionTimeList[i].getTime() - this.functionTimeList[i - 1].getTime();
  //     totalDiff += diff;
  //   }
  //   this.functionTimeList = []
  //   if (totalDiff / size < 100) {
  //     console.log("解决修改数据死循环");
  //     return
  //   }
  // }

  const onWatch = val.lifecycle && val.lifecycle.onWatch
  if (onWatch !== undefined && onWatch !== null && typeof onWatch === 'string' && onWatch.startsWith("SCRIPT*")) {

    const arr = onWatch.trim().split("*")
    const scriptPath = arr[1].trim()
    const methodName = arr[2]
    const extraData: any = {}

    const scriptData = await axios.get("/BI-API/Component/GetScript", {
      params: { name: scriptPath },
      timeout: 1000 * 6,
    })

    if (scriptData !== undefined && scriptData !== null && scriptData.data !== undefined && scriptData.data !== null) {
      if (scriptData.data.state !== 200) {
        console.warn("获取脚本异常", scriptData);
        return
      }
      const code = scriptData.data.data;
      if (scriptPath.endsWith("ts")) {
        const iife = CompileTypescriptToIIFE(code);
        const instance = new iife();
      } else if (scriptPath.endsWith("js")) {
        CompileToModule(code).then((module: EsModule<any>) => {

          if (Object.prototype.toString.call(module) === "[object Module]") {
            if ((methodName === undefined || methodName === null || module[methodName] === undefined || module[methodName] === null) && module.default !== undefined) {
              extraData.ParameterString = methodName
              module.default.bind(this)(extraData)
            } else if (Object.prototype.toString.call(methodName) === "[object String]" &&
              Object.prototype.toString.call(module[methodName]) === "[object Function]") {
              module[methodName].bind(this)(extraData)
            } else {

            }
          } else if (Object.prototype.toString.call(module.default) === '[object Function]') {
            const instance = new module.default();
          } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
            const instance = module.default;
          }
        });
      }
    }
  }

  // 是否切换了样式
  const isSwitchStyle = val.hierarchy !== old.hierarchy

  const execution = () => {
    if (curStyle !== undefined && curStyle.attrList !== undefined) {
      for (let i = 0; i < curStyle.attrList.length; i++) {
        const attr = curStyle.attrList[i];
        if (attr === undefined)
          continue
        if (Object.prototype.toString.call(attr.options) === "[object Object]") {
          const keys = Object.keys(attr.options)
          keys.filter(key => key.startsWith("on")).forEach((key: string) => {
            let str = attr.options[key]
            if (Array.isArray(str))
              str = str.join(";")
            const returnedValue = this.executionString(str)
          })
        }
      }
    }
  }

  let attributePath = curStyle.value.split("~~~")[0]
  const cssData: any = { dataExcludeList: [] };
  const pathVariables: string[] = []
  curStyle.attrList.forEach((attr: any) => {
    const variable = attr.variable.trim();
    let attrKey = variable.startsWith("@") ? variable.substring(1) : variable;
    if (attrKey === undefined || attrKey.trim() === "")
      return

    if (attrKey.includes("@")) {

      const regex = /@[^\\.\\[\s]+/g;
      const match = attrKey.match(regex); // ['@index', '@aaindex']
      if (match !== null) {
        match.forEach((placeholder: string) => {
          placeholder = placeholder.trim()
          if (placeholder === "" || placeholder.trim() === "@")
            return
          if (placeholder.endsWith("]") || placeholder.endsWith("."))
            placeholder = placeholder.substring(0, placeholder.length - 1)
          const attrKey = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder;
          const findAttr = curStyle.attrList.find((item: any) => item.variable === placeholder || item.variable === placeholder.substring(1))
          if (findAttr.options.dataExclude === true)
            cssData.dataExcludeList.push(variable)
          cssData[attrKey] = findAttr.value;
        });
      }
    }

    if (attr.type === "color-picker" && attr.options !== undefined && attr.options.gradientType !== undefined && attr.options.gradientType === 'linear') {
      const gradient = attr.options.value
      if (attr.options.dataExclude === true)
        cssData.dataExcludeList.push(attrKey)
      cssData[attrKey] = new echarts.graphic.LinearGradient(gradient.x, gradient.y, gradient.x2, gradient.y2, gradient.colorStops)
      return
    }
    if (attrKey.includes("@")) {
      const regex = /@[^\\.\\[\s]+/g;
      const match = attrKey.match(regex); // ['@index', '@aaindex']
      if (match !== null) {
        match.forEach((placeholder: string) => {
          placeholder = placeholder.trim()
          if (placeholder === "" || placeholder.trim() === "@")
            return
          if (placeholder.endsWith("]") || placeholder.endsWith("."))
            placeholder = placeholder.substring(0, placeholder.length - 1)
          const key = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder
          pathVariables.push(key)
          attrKey = attrKey.replaceAll(placeholder, cssData[key])
        });
      }
    }
    if (attr.options.dataExclude === true)
      cssData.dataExcludeList.push(attrKey)
    cssData[attrKey] = attr.value;
  });

  if (attributePath.includes("@")) {
    const regex = /@\w+(?=[\x20\].])/g;
    const match = attributePath.match(regex); // ['@index', '@aaindex']
    if (match !== null) {
      match.forEach((placeholder: string) => {
        placeholder = placeholder.trim()
        if (placeholder === "" || placeholder.trim() === "@")
          return
        const key = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder;
        pathVariables.push(key)
        attributePath = attributePath.replaceAll(placeholder, cssData[key]);   // 变量赋值
        delete cssData[key]
      });
    }
  }

  if (attributePath.includes("@")) {
    const regex = /@[^\\.\\[\s]+/g;
    const match = attributePath.match(regex); // ['@index', '@aaindex']
    if (match !== null) {

      match.forEach((placeholder: string) => {

        placeholder = placeholder.trim()
        if (placeholder === "" || placeholder.trim() === "@")
          return
        if (placeholder.endsWith("]") || placeholder.endsWith("."))
          placeholder = placeholder.substring(0, placeholder.length - 1)
        const key = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder;
        pathVariables.push(key)
        attributePath = attributePath.replaceAll(placeholder, cssData[key]);  // 变量赋值
        delete cssData[key]
      });
    }
  }

  this.$nextTick(() => {
    execution()
  })

  // 切换过来的
  if (isSwitchStyle) {

    if (curStyle.type === "chart") {

      let optionValue = getValueByAttributePath(this.curComponent.data.option, attributePath)
      if (optionValue === undefined || optionValue === null) {

        // todo 找不到的数据从echart实例获取

        cssData.dataExcludeList.forEach((key: string) => {
          delete cssData[key]
        });

        Object.keys(cssData).forEach(key => {
          if (key.includes("[") || key.includes("."))
            delete cssData[key]
        })
        delete cssData.dataExcludeList

        optionValue = {}
        optionValue = { ...cssData }
        let newOption = setJsonAttribute(this.curComponent.data.option, attributePath, optionValue)
        newOption = SetValueAndAttributePathFromKey(newOption, attributePath, optionValue)
        // 设置新的newOption
        eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
      } else {
        // 绑定图形option数据
        curStyle.attrList.forEach((attr: any) => {
          let variable = attr.variable
          if (variable === undefined || variable === null)
            return
          variable = variable.startsWith("@") ? variable.substring(1).trim() : variable.trim()

          if (variable.includes("@")) {
            const regex = /@[^\\.\\[\s]+/g;
            const match = variable.match(regex); // ['@index', '@aaindex']
            if (match !== null) {
              match.forEach((placeholder: string) => {
                placeholder = placeholder.trim()
                if (placeholder === "" || placeholder.trim() === "@")
                  return
                if (placeholder.endsWith("]") || placeholder.endsWith("."))
                  placeholder = placeholder.substring(0, placeholder.length - 1)
                const key = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder
                variable = variable.replaceAll(placeholder, cssData[key])
              });
            }
          }

          let value = getValueByAttributePath(optionValue, variable)

          if (value === undefined || value === null)
            return

          // Vue.set(attr, "value", value)

          if (attr.type === "color-picker" && typeof value === "object" && value.type === "linear") {
            attr.options.gradientType = "linear"
            attr.options.value.x = value.x
            attr.options.value.x2 = value.x2
            attr.options.value.y = value.y
            attr.options.value.y2 = value.y2
            attr.options.value.colorStops = value.colorStops
            attr.options.iconList[1].show = true
            attr.options.iconList[2].show = true
          } else {
            // let newOption = setJsonAttribute(this.curComponent.data.option, attributePath + "." + variable, value)
            // newOption = SetValueAndAttributePathFromKey(newOption, attributePath + "." + variable, value)
            // eventBus.$emit("SetOption", this.curComponent.data.name, newOption)

            attr.value = value
          }
        })
        this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
      }
      // this.isSwitchToStyle = false
    } else if (curStyle.type === "css") {

      let findStyle = null
      // 从选择器中选择了样式
      for (let i = 0; i < this.addedStyleTags.length; i++) {
        const style = this.addedStyleTags[i];
        if (style.hierarchy === curStyle.hierarchy && style.selector === this.curSelector) {
          findStyle = style
          break
        } else if (style.hierarchy === curStyle.hierarchy) {
          findStyle = style
        }
      }
      if (findStyle !== null) {
        this.handleStyleChange(this.getHierarchy(findStyle.hierarchy));
        this.switchToStyle(findStyle);
      }
    }

  } else {

    if (curStyle.type === "chart") {

      // 如果是路径变量修改,则把数据绑定回来
      let isPathChange = false
      if (this.oldStyle.value === curStyle.value) {
        const newValueList: any[] = []
        const oldValueList: any[] = []
        for (let i = 0; i < pathVariables.length; i++) {
          const pathVariable = pathVariables[i];
          for (let j = 0; j < curStyle.attrList.length; j++) {
            const attr = curStyle.attrList[j]
            if (attr.variable === pathVariable)
              newValueList.push(attr.value)
          }
          for (let j = 0; j < this.oldStyle.attrList.length; j++) {
            const attr = this.oldStyle.attrList[j]
            if (attr.variable === pathVariable)
              oldValueList.push(attr.value)
          }
        }
        if (JSON.stringify(newValueList) !== JSON.stringify(oldValueList))
          isPathChange = true
      }
      // todo 从别的项目回到这里会
      // 路径改变, 需要绑定原有的数据
      if (isPathChange) {
        let optionValue = getValueByAttributePath(this.curComponent.data.option, attributePath)
        if (optionValue === undefined || optionValue === null) {
          console.warn("获取不到数据", attributePath, this.curComponent.data.option);
          cssData.dataExcludeList.forEach((key: string) => {
            delete cssData[key]
          });
          delete cssData.dataExcludeList
          optionValue = { ...cssData }
          let newOption = SetValueAndAttributePathFromKey(this.curComponent.data.option, attributePath, optionValue)
          newOption = setJsonAttribute(newOption, attributePath, optionValue)

          // 设置新的newOption
          eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
          this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
          return
        }

        if (typeof optionValue !== "object") {
          console.warn(`通过${attributePath}找到的数据不正确`, optionValue);
          return
        }

        curStyle.attrList.forEach((attr: any) => {

          let variable = attr.variable
          if (variable === undefined || variable === null)
            return
          if (variable.includes("@")) {
            const regex = /@[^\\.\\[\s]+/g;
            const match = variable.match(regex); // ['@index', '@aaindex']
            if (match !== null) {
              match.forEach((placeholder: string) => {
                placeholder = placeholder.trim()
                if (placeholder === "" || placeholder.trim() === "@")
                  return
                if (placeholder.endsWith("]") || placeholder.endsWith("."))
                  placeholder = placeholder.substring(0, placeholder.length - 1)
                const key = placeholder.startsWith("@") ? placeholder.substring(1) : placeholder
                variable = variable.replaceAll(placeholder, cssData[key])
              });
            }
          }

          if (variable === undefined || variable === null)
            return
          if (cssData.dataExcludeList.includes(variable))
            return
          const value = getValueByAttributePath(optionValue, variable)

          if (value === undefined || value === null) {
            attr.value = ""
            return
          }

          if (attr.type === "color-picker" && typeof value === "object" && value.type === "linear") {
            attr.options.gradientType = "linear"
            attr.options.value.x = value.x
            attr.options.value.x2 = value.x2
            attr.options.value.y = value.y
            attr.options.value.y2 = value.y2
            attr.options.value.colorStops = value.colorStops
            attr.options.iconList[1].show = true
            attr.options.iconList[2].show = true
          } else if (attr.type === "color-picker" && typeof value === "object" && (value.type === undefined || value.type === "undefined")) {
            attr.value = value
            attr.options.gradientType = "undefined"
            attr.options.iconList[1].show = false
            attr.options.iconList[2].show = false
          } else {
            attr.value = value
          }

        })
        this.oldStyle = JSONfn.parse(JSONfn.stringify(val))
        // if (this.STYLE_STATE === StyleState.created) {
        //   this.STYLE_STATE = StyleState.recovered
        // }
      } else {

        cssData.dataExcludeList.forEach((key: string) => {
          delete cssData[key]
        });
        delete cssData.dataExcludeList

        //  todo 设置单位,需要放在最后
        const keys = Object.keys(cssData)
        curStyle.attrList.forEach((attr: any) => {
          if (attr.type !== "integer" && attr.type !== "number")
            return
          if (attr.options.unit === undefined || attr.options.unit === null || attr.options.unit.trim() === "")
            return
          if (attr.options.unit.trim() !== "px" && attr.options.unit.trim() !== "%")
            return
          if (keys.includes(attr.variable)) {
            let newValue = parseFloat(attr.value)
            if (isNaN(newValue))
              newValue = 0
            cssData[attr.variable] = newValue + attr.options.unit
          }
        });

        let newOption = SetValueAndAttributePathFromKey(this.curComponent.data.option, attributePath, cssData)
        newOption = setJsonAttribute(newOption, attributePath, cssData)

        eventBus.$emit("SetOption", this.curComponent.data.name, newOption)
        // this.STYLE_STATE = StyleState.latest
        this.oldStyle = JSONfn.parse(JSONfn.stringify(val))

        StyleChangeState.code = "TAG-0"
        StyleChangeState.date = new Date()
      }

    }
  }

}
