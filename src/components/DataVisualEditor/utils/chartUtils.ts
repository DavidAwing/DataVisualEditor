
import {
  removeWhitespace
} from "@/components/DataVisualEditor/utils/utils";
import { boolean } from "mathjs";
const JSONfn = require("jsonfn").JSONfn;


/**
 *
 * @param {json} json json格式的数据
 * @param {string|object} attributePath 属性的路径,xAxis.type,xAxis.data[0],series[0].data[0],series[0].data
 * @param {any} value
 * @returns
 */
export function setJsonAttribute(json: string | object, attributePath: string, value: any, isCopy = true) {

  const properties = removeWhitespace(attributePath).split(".");
  let currentObj: any = null
  if (isCopy) {
    currentObj = typeof json === 'object' ? JSONfn.parse(JSONfn.stringify(json)) : JSONfn.parse(json);
  } else {
    currentObj = typeof json === 'object' ? json : JSONfn.parse(json);
  }
  const originalObj = currentObj;
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
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
        if (currentObj[match[1]] === undefined || currentObj[match[1]] === null) {
          currentObj[match[1]] = []
          currentObj[match[1]][index] = value;
        } else if (
          Object.prototype.toString.call(currentObj[match[1]][index]) === "[object Object]" &&
          Object.prototype.toString.call(value) === "[object Object]") {
          currentObj[match[1]][index] = { ...currentObj[match[1]][index], ...value };
        } else {
          currentObj[match[1]][index] = value;
        }
        return originalObj;
      }
      if (currentObj[match[1]] === undefined || currentObj[match[1]] === null)
        currentObj[match[1]] = []
      if (currentObj[match[1]][index] === undefined ||
        currentObj[match[1]][index] === null) {
        currentObj[match[1]][index] = {}
      }
      currentObj = currentObj[match[1]][index];
    } else if (
      Object.prototype.toString.call(currentObj) === "[object Object]"
    ) {
      if (i === properties.length - 1) {
        if (Object.prototype.toString.call(currentObj[property]) === "[object Object]" &&
          Object.prototype.toString.call(value) === "[object Object]") {
          currentObj[property] = { ...currentObj[property], ...value }
        } else if (currentObj[property] === undefined) {
          currentObj[property] = value;
        } else {
          currentObj[property] = value;
        }
        return originalObj;
      }
      currentObj = currentObj[property];
    }
  }
  return originalObj
}

export function getValueByAttributePath(this: any, from: any, attributePath: string): any {

  // todo
  // const mathc = attributePath.match(/(?<=(\[{1}))(\w|.)+(?=(\]{1}))/g)
  // if (mathc !== null && mathc.length > 0) {
  //   for (let i = 0; i < mathc.length; i++) {
  //     const str = mathc[i];
  //    return getValueByAttributePath.bind(this)(from, str)
  //   }
  // }

  const properties = removeWhitespace(attributePath).split(".").map((x: any) => x.trim());
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

        if (currentObj[match[1]] === undefined || currentObj[match[1]] === null)
          return undefined
        if (currentObj[match[1]][index] !== undefined) {
          return currentObj[match[1]][index]
        } else {
          console.warn(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`);
          return undefined
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
          console.warn(`getValueByAttributePath|from: ${JSONfn.stringify(from)}, attributePath:${attributePath}, 找不到属性`)
          return undefined
        }
      }
      currentObj = currentObj[property];
    }
  }
  return currentObj
}





// variable是itemStyle.color或series[0]这样的格式
export function SetValueAndAttributePathFromKey(json: string | object, attributePath: string, value: any) {

  let newJson: any = json;
  const keys = Object.keys(value)
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i]
    if (!key.includes(".") && !(key.includes("[") && key.includes("]")))
      continue

    const val = value[key]

    const lastIndex = key.lastIndexOf(".")
    const name = key.substring(lastIndex + 1)
    const newAttributePath = attributePath + "." + key.substring(0, lastIndex)
    const newData: any = {}
    newData[name] = val
    console.log("获取数据异常");
    newJson = setJsonAttribute(newJson, newAttributePath, newData)
    delete value[key]
  }

  return newJson
}





/**
 * 测试字符串可转换的类型
 * @param str
 * @returns
 */
export function testString(str: string) {
  try {
    const obj = JSON.parse(str);
    if (Array.isArray(obj)) {
      return "array"
    } else if (typeof obj === 'object') {
      return "object"
    } else if (typeof obj === 'number') {
      return "number"
    } else if (typeof obj === 'boolean') {
      return "boolean"
    }
  } catch (error) {
    console.warn(`testString|测试字符串不是json格式: ${str}`);
    return "string"
  }
}


export enum CRUD {
  create,
  read,
  update,
  delete
}


