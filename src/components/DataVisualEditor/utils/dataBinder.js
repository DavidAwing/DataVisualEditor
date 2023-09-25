import * as DB from "../utils/indexDB";
import { getRandStr, warn } from "../utils/utils";
import { CompileToModule, CompileTypescriptToIIFE, codeToInstance } from "../utils/compiler";
import CronExpressionValidator from "../utils/CronExpressionValidator";
import axios from 'axios'
import toast from "./toast";
import Vue from 'vue';
import eventBus from '../utils/eventBus';
// import cron from 'cron-validate'
const JSONfn = require("jsonfn").JSONfn;
const schedule = require("node-schedule");


const a = `
#你好啊
bbb,ccc
/select * from user


bb33b,ccc333
/select/rom/user

aaa,ccc
select * from user

[请求字符串每个请求]
ttt,sdf大师风范更多
*/23 * * * * *
select * from user
select * from user22222222

ttt2222的方式,sdf大师风范更多2222,
*/2 * * * * *
select * from user22222

ttt6666,sdf大师风范更多6666,
select * from user22222
select * from 士大夫士大夫士大夫



*/26 * * * * *
select * from user22222

ddd
select * from name

http士大夫士大夫大师傅


https://chat.openai.com/chat/3a780546-a1ba-43e3-8f60-48477bdc7121

帆帆帆帆
http://chat.openai.com/chat/3a780546-a1ba-43e3-8f60-48477bdc7121



KNPMCTeFywVLXRc
http://172.16.2.40:9096/#/project




[执行方法任务]
FMaCdstbaGGgThs
*/1 * * * * *
SCRIPT*AttributeEvent/testTask.js*Test2



`



export class TaskManager {

  static _taskMap = {}

  // 负责修改,更新,监听任务的数据
  static _dataBinder = {}

  static _addWatch(name, task) {
    const $watch = window.bi.$watch
    const getComponentData = window.bi.utils.getComponentData

    function invoke() {
      // 是否立即调用? 默认尽量调用
      const v = task.config['@watch_invoke'];
      if (v) {
        const isNotInvoke = /false/gi.test(v) || /0/g.test(v)
        !isNotInvoke && TaskManager.invoke(name)
      } else {
        TaskManager.invoke(name)
      }
    }

    function watchPlaceholder(p, placeholders) {

      const symbol = p.substring(2, p.length - 2).trim()

      const component = getComponentData(symbol)

      if (!component) {
        console.warn(`watchPlaceholder|找不到组件${symbol},无法监听组件数据`);
        return
      }
      if (component.component === "v-select") {
        placeholders[p] = component.data.selectedValue
      } else if (component.component === 'v-input') {
        placeholders[p] = component.data.text
      } else if (component.component === 'v-date-picker') {
        placeholders[p] = component.data.date
      } else {

      }

      let timeoutId = null
      const interval = 300
      $watch(() => {
        if (symbol.includes('.')) {

        } else {
          if (component.component === "v-select") {
            return component.data.selectedValue
          } else if (component.component === 'v-input') {
            return component.data.text
          } else if (component.component === 'v-date-picker') {
            return component.data.date
          } else {
          }
        }
      }, (val) => {

        placeholders[p] = val
        if (component.component === 'v-input') {
          window.clearTimeout(timeoutId)
          timeoutId = setTimeout(invoke, interval);
        } else {
          invoke()
        }

      }, { immediate: false })
    }

    if (task.dataSourceType === 'database') {
      if (/{{[^{}]*[\w]+[.+-/*]*[^{}]*}}/g.test(task.sql) && !TaskManager._dataBinder[name]) {
        const placeholders = task.sql.match(/{{[^{}]*[\w]+[.+-/*]*[^{}]*}}/g)
        // 添加字符串到监听器
        TaskManager._dataBinder[name] = {
          sql: task.sql,
          placeholders: {},
        }
        // 监听数据的改变
        placeholders.forEach(p => {

          const placeholders = TaskManager._dataBinder[name].placeholders
          if (/{{\s*arg_/i.test(p)) {
            const symbol = p.substring(2, p.length - 2).trim().substring('arg_'.length)
            const regex = new RegExp(`(?=${symbol}\\s*\\=)\\w*[^&]*`, "gi");
            const match = document.location.href.match(regex)
            match ? placeholders[p] = match[0].split('=')[1].trim() : console.warn(`watchPlaceholder|找不到查询参数${symbol}`);
          } else {
            watchPlaceholder(p, placeholders)
          }
        })
      }
    }
    return TaskManager._dataBinder[name]
  }

  static _updateTask(name, task, dataBinder) {

    if (!name)
      return

    if (!task) {
      task = TaskManager._taskMap[name].task
      if (!task) {
        console.warn(`_updateTask|未找到task: ${name}`);
        return
      }
    }
    if (!dataBinder) {
      dataBinder = TaskManager._dataBinder[name]
      if (!dataBinder) {
        console.warn(`_updateTask|未找到dataBinder: ${name}`);
        return
      }
    }

    // 更新数据
    let newSql = dataBinder.sql
    if (task.dataSourceType === 'database') {
      Object.keys(dataBinder.placeholders).forEach(key => {
        const value = dataBinder.placeholders[key]
        newSql = newSql.replaceAll(key, value)
      })
      task.sql = newSql
    }
  }

  static add(name, task, job) {
    const dataBinder = TaskManager._addWatch(name, task)
    TaskManager._updateTask(name, task, dataBinder)
    TaskManager._taskMap[name] = { task, job }
  }

  static invoke(name) {

    if (window.BI_DEBUG) {
      console.log('BI_DEBUG|TaskManager|invoke|task', TaskManager._taskMap[name].task);
      console.log('BI_DEBUG|TaskManager|invoke|dataBinder', TaskManager._dataBinder[name]);
    }

    TaskManager._updateTask(name)
    TaskManager._taskMap[name].task.call()
  }


}

// 解析数据配置表达式
// // const ttt = `This is a @test(a,b,c) and a @time(  ) expression.  @test2(a,  @b  ,   c)  @_AAAtest22222(a,  bddjj,  cff)  @test22222(a,  bddjj, @cff, ghhh,  @_o99  )  @test77777   @__test77777`;
// @test(a,b,c) 是函数,  @__test77777是变量
const extractExpressions = (text) => {
  // const regex = /(\$|@)[a-zA-Z_]+\s*\((\s*[^),]*\s*,)*(\s*[^),]*\s*)?\)/g;
  const expressions = [];

  const regex = /@([a-zA-Z_0-9]+)(\((\s*[\w@]*\s*,?)*\))?/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const name = match[1];

    const expression = match[0];
    const type =
      /^@[a-zA-Z_0-9]\w*\(\s*([a-zA-Z_0-9@]\w*(\s*,\s*[a-zA-Z_0-9@]\w*)*)?\s*\)/g.test(
        expression
      )
        ? "function"
        : "variable";

    let parameters;
    if (type === "function") {
      let str = match[2].trim();
      str = str.substring(1, str.length - 1);
      if (str != null && str.trim() !== "") {
        parameters = str.split(",").map((param) => param.trim());
      }
    }

    expressions.push({
      type,
      name,
      parameters,
      expression,
    });
  }
  return expressions;
}


function parseText(text) {

  const groups = text.split(/\n{2,}/g); // 将文本分割成组
  const list = groups.map((group) => {

    const lines = group.trim().split("\n"); // 将组分割成行
    const obj = { element: {}, source: "", type: undefined, cron: undefined, jobName: undefined, message: "" };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("//") || line.startsWith("#")) {
        // obj.annotation += line.trim() + "\n"
        continue
      }

      // console.log("验证字符串", CronExpressionValidator.validateCronExpression(line), line);

      if ((i === 0) && /^\[[^\]]+\]$/.test(line)) {
        obj.jobName = line.substring(1, line.length - 1);
      } else if ((i < 3) &&
        (/^select\b/i.test(line) ||
          /^insert\b/i.test(line) ||
          /^update\b/i.test(line) ||
          /^delete\b/i.test(line) ||
          /^https?:\/\//i.test(line) ||
          /^http?:\/\//i.test(line) ||
          /^\/(?!$)[^/]/.test(line) ||
          /^(\d{1,3}\.){3}\d{1,3}/.test(line)) &&
        (!/^(\*|[0-5]?\d)(\/\d+)?(\s+(\*|[01]?\d|2[0-3])(\/\d+)?){4}$/.test(line) &&
          !/^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line)) &&
        !line.startsWith("SCRIPT*")
      ) {
        // 是sql,http,cron
        obj.source += line.trim() + "\n";
      } else if ((i < 3) &&
        (/^(\*|[0-5]?\d)(\/\d+)?(\s+(\*|[01]?\d|2[0-3])(\/\d+)?){4}$/.test(line) ||
          /^(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)\s(\*|[0-9-/,*]+)(\s(\*|[0-9-/,*]+))?$/i.test(line) ||
          CronExpressionValidator.validateCronExpression(line)
        ) &&
        !line.startsWith("SCRIPT*")
      ) {
        // 是cron
        obj.cron = line;
      } else if ((i < 3) &&
        /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*(,[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z0-9]*)*(,)?$/.test(line) &&
        !line.startsWith("SCRIPT*")) {
        // 是name
        line.split(",").forEach(name => {
          name = name.trim()
          if (name === "")
            return
          obj.element[name] = {};
        });
      } else if (line.startsWith("SCRIPT*")) {
        obj.source = line
      } else {
        obj.source += line.trim() + "\n";
      }
    }

    const source = obj.source;
    if (
      // 匹配SQL语句的关键词
      /^select\b/i.test(source) ||
      /^insert\b/i.test(source) ||
      /^update\b/i.test(source) ||
      /^delete\b/i.test(source)
    ) {
      obj.type = "sql";
    } else if (
      /^https?:\/\//i.test(source) ||
      /^http?:\/\//i.test(source) ||
      /^(\d{1,3}\.){3}\d{1,3}/.test(source) ||
      /^\/(?!$)[^/]/.test(source)
    ) {
      // 匹配URL的正则表达式
      obj.type = "http";
    } else if (source.startsWith("SCRIPT*")) {
      obj.source = source.trim().substring("SCRIPT*".length);
      obj.type = "script"
    }

    if (obj.jobName === undefined)
      obj.jobName = getRandStr()  // todo 不能用随机字符串
    obj.source = obj.source.trim()

    if (obj.cron === undefined) {

    }

    return obj;
  });

  return list.filter(item => item.type !== undefined && item.jobName !== undefined);
}

function testTask(task) {

  return new Promise((resolve, reject) => {
    if (task.type === "http" && task.source.startsWith("/")) {
      axios.get(task.source, {
        timeout: 1000 * 60 * 3
      }).then(data => {
        task.type = "get"
        resolve(task)
      }).catch(error => {
        const errorResponse = JSON.parse(JSON.stringify(error))
        if (errorResponse.status === 405) {
          task.type = "post"
        } else {
          task.message = errorResponse
        }
        resolve(task)
      })
    } else {
      resolve(task)
    }
  })
}



// 先判断长度，再遍历比较
function ArrayCompare(array1, array2) {
  // 如果长度不一样，则直接不相等
  if (array1.length != array2.length) {
    return false;
  }
  // 如果长度一样，则for循环比较
  for (let i = 0; i < array1.length; i++) {
    // array1的元素是否都在array2中存在，有一个不存在就不相等
    if (!array2.includes(array1[i])) {
      return false;
    }
  }
  for (let i = 0; i < array2.length; i++) {
    // array2的元素是否都在array1中存在，有一个不存在就不相等
    if (!array1.includes(array2[i])) {
      return false;
    }
  }
  // 如果执行到这里，说明全部匹配
  return true;
}

function getDataTypeToken(data) {

  {

    // type: [n][n]{SameAttributeName}
    const data0 = [
      [
        {
          RUNCARD_QTY: 5
        },
        {
          RUNCARD_QTY: 3
        },
        {
          RUNCARD_QTY: 5
        },
        {
          RUNCARD_QTY: 5
        },
        {
          RUNCARD_QTY: 5
        },
        {
          RUNCARD_QTY: 5
        },
        {
          RUNCARD_QTY: 5
        }
      ],
      [
        {
          TARGET_QTY: 100
        },
        {
          TARGET_QTY: 0
        },
        {
          TARGET_QTY: 100
        },
        {
          TARGET_QTY: 1000
        },
        {
          TARGET_QTY: 1000
        }
      ]
    ]

    // type: [n][1]{NumberAttributeName}  /   [n][n]{NumberAttributeName}
    const data1 = [
      [
        {
          1: 120,
          2: 234,
          3: 41231,
          4: 231,
          5: 543,
          6: 652,
          7: 1232
        }
      ],
      [
        {
          1: 123,
          2: 224,
          3: 431,
          4: 631,
          5: 943,
          6: 602,
          7: 232
        }
      ]
    ]

    // type: [n][1]{StringAttributeName}   / [n][n]{StringAttributeName}
    const data2 = [
      [{ Mon: 5, Tue: 70, Wed: 15, Thu: 30, Fri: 55, Sat: 60, Sun: 15 }],
      [{ Mon: 5, Tue: 70, Wed: 15, Thu: 30, Fri: 55, Sat: 60 }],
    ]

  }

  if (Array.isArray(data) && data.every(item => Array.isArray(item))) {
    for (let i = 0; i < data.length; i++) {
      const objArr = data[i];
      // 检测是不是[n][n]{SameAttributeName}
      const keysList = []
      objArr.forEach(obj => {
        if (typeof obj !== "object")
          throw new Error("获取token异常,不是object类型", data, obj)
        keysList.push(Object.keys(obj))
      })

      for (let j = 0; j < keysList.length; j++) {
        if (j === keysList.length - 1) {
          if (keysList[j].every(item => item === keysList[j][0])) {
            return "[n][1]{SameAttributeName}"
          } else if (keysList.every(item => !isNaN(parseInt(item)))) {
            return data.some(arr => arr.length > 1) ? `[n][n]{NumberAttributeName}` : `[n][1]{NumberAttributeName}`
          } else {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].length; j++) {
                const obj = data[i][j];
                const keys = Object.keys(obj)
                const isPath = keys.every(key => /@PATH\s*(\w)+/i.test(key))
                if (!isPath) {
                  return data.some(arr => arr.length > 1) ? `[n][n]{StringAttributeName}` : `[n][1]{StringAttributeName}`
                }
              }
            }
            return "[n][n]{@PATH:value}"
          }
        }
        const arr1 = keysList[j];
        const arr2 = keysList[j + 1];
        const isEqual = ArrayCompare(arr1, arr2)
        if (!isEqual) {
          // 检测是不是[n][n]{NumberAttributeName}
          if (keysList.every(item => !isNaN(parseInt(item)))) {
            return data.some(arr => arr.length > 1) ? `[n][n]{NumberAttributeName}` : `[n][1]{NumberAttributeName}`
          } else {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < data[i].length; j++) {
                const obj = data[i][j];
                const keys = Object.keys(obj)
                const isPath = keys.every(key => /@PATH\s*(\w)+/i.test(key))
                if (!isPath) {
                  return data.some(arr => arr.length > 1) ? `[n][n]{StringAttributeName}` : `[n][1]{StringAttributeName}`
                }
              }
            }
            return "[n][n]{@PATH:value}"
          }
        }
      }
    }

    throw new Error("getDataTypeToken|无法解析的数据", data)
  } else if (Array.isArray(data) && data.every(item => Object.prototype.toString.call(item) === "[object Object]")) {
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      const keys = Object.keys(obj)
      const isPath = keys.every(key => /@PATH\s*(\w)+/i.test(key))
      if (!isPath) {
        throw new Error("暂时不支持")
      }
    }
    return "[n]{@PATH:value}"
  } else if (Array.isArray(data) && data.every(item => Array.isArray(item))) {

  }
}

function convertDataFormat(token, data) {

  const convertedData = { dataTypeToken: token, data: null }
  if (token === "[n][1]{SameAttributeName}") {
    convertedData.data = {}
    data.forEach(arr => {
      const key = Object.keys(arr[0])[0]
      const valueArr = []
      arr.forEach(obj => {
        valueArr.push(obj[key])
      })
      convertedData.data[key] = valueArr
    })
  } else if (token === "[n][1]{NumberAttributeName}") {
    convertedData.data = []
    data.forEach(arr => {
      const keys = Object.keys(arr[0])
      keys.sort((a, b) => a - b)
      const valueArr = []
      keys.forEach(key => {
        valueArr.push(arr[0][key])
      })
      convertedData.data.push(valueArr)
    })
  } else if (token === "[n][1]{StringAttributeName}" || token === "[n][n]{StringAttributeName}") {
    convertedData.data = []
    data.forEach(arr => {
      arr.forEach(obj => {
        convertedData.data.push(obj)
      })
    })
  } else if (token === "[n]{@PATH:value}" || token === "[n][n]{@PATH:value}") {
    convertedData.data = data
  } else {
    throw new Error("无法解析的token")
  }
  return convertedData
}

export function commitData(store, task, response) {

  if (
    (Array.isArray(response) &&
      (task.componentName !== undefined && task.componentName !== null && task.componentName.trim() !== "") &&
      task.dataSourceType && task.name) ||
    (response.data.headers === undefined &&
      response.data.request === undefined &&
      response.data.status === undefined &&
      response.attributeName !== undefined &&
      response.attributeName !== null &&
      response.attributeName.trim() !== "" &&
      typeof response === 'object' &&
      typeof response.name === "string")) {

    if (Array.isArray(response)) {

      if (response.length === 0)
        return
      response.forEach(item => {
        const { attributeName, name, data } = item
        store.commit("setCanvasComponentAttribute", [
          attributeName,
          name,
          data
        ]);
      })
      if (Array.isArray(response[0])) {
        console.log("多个sql查询", response);
      } else if (Object.prototype.toString.call(response[0]) === '[object Object]') {
      } else {
        console.warn("commitData|数据无法处理", task, response);
      }
    } else {
      const { attributeName, name, data } = response
      store.commit("setCanvasComponentAttribute", [
        attributeName,
        name,
        data
      ]);
    }
  } else if (response.attributeName === undefined || response.attributeName === null || response.attributeName === "" ||
    response.name === undefined || response.name === null || response.name === "") {

    if (task.componentName !== undefined && task.componentName !== null && task.componentName.trim() !== "" &&
      task.componentType !== undefined && task.componentType !== null && task.componentType.trim() !== "") {

      let attributeName = ""
      let data = null
      const item = response.data
      if (task.componentType === "vc-chart") {
        data = { data: item.data, dataTypeToken: item.dataTypeToken }
      } else if (task.componentType === "v-table") {
        attributeName = "data.tableData"
        data = Array.isArray(item) ? item : item.data
      } else if (task.componentType === "v-text") {
        if (Array.isArray(item) && item.length > 1) {
          throw Error("指定了组件名称的任务不能是多行,后续考虑兼容,类型:v-text,  组件名称: " + task.componentName)
        }
        const newItem = Array.isArray(item) ? item[0] : item
        const keys = Object.keys(newItem)
        attributeName = "data.text"
        data = newItem[keys[0]]
      } else if (task.componentType === "v-select") {
        if (Array.isArray(item) && item.length > 0 && item[0].label !== undefined && item[0].value !== undefined) {
          attributeName = "data.options"
          data = item
        }
      } else if (task.componentType === 'v-picture') {

        if (Array.isArray(item) && item.length > 1) {
          throw Error("指定了组件名称的任务不能是多行,后续考虑兼容,类型:v-picture,  组件名称: " + task.componentName)
        }
        const newItem = Array.isArray(item) ? item[0] : item
        const keys = Object.keys(newItem)

        data = newItem[keys[0]]
        if (data.startsWith("/") || data.startsWith("http")) {
          attributeName = "data.imageUrl"
        } else {
          attributeName = "data.image"
        }
      } else if (task.componentType === "v-video") {

        if (Array.isArray(item) && item.length > 1) {
          throw Error("指定了组件名称的任务不能是多行,后续考虑兼容,类型: v-video, 组件名称: " + task.componentName)
        }
        const newItem = Array.isArray(item) ? item[0] : item
        const keys = Object.keys(newItem)

        attributeName = "data.video"
        data = newItem[keys[0]]
      } else {
        throw Error("数据异常没有处理成功-f9828357-dc35-45eb-be88-1ee6a46143b0")
      }

      store.commit("setCanvasComponentAttribute", [
        attributeName,
        task.componentName,
        data
      ]);

    } else {

      for (let index = 0; index < response.data.length; index++) {
        const item = response.data[index];

        try {
          if (task.sqlMap !== undefined && task.sqlMap[`sql[${index}]`] !== undefined) {
            if (Object.prototype.toString.call(item) === '[object Array]') {

              let attributeName = ""
              let data = null
              const name = task.sqlMap[`sql[${index}]`].find(val => val.trim().startsWith("@NAME")).split(/\s+/g)[1].trim()

              const component = window.bi.utils.getComponentData(name)
              if (component === undefined) {
                console.log("未找到组件", name);
                continue
              }

              if (component.component === "vc-chart") {
                data = { data: item, dataTypeToken: getDataTypeToken(item) }
              } else if (component.component === "v-table") {
                attributeName = "data.tableData"
                data = item
              } else if (item.length === 1) {

                const newItem = item[0]
                const keys = Object.keys(newItem)
                keys.forEach(key => {
                  if (key.trim().startsWith("@NAME")) {
                    const name = key.trim().substring("@NAME".length).trim()
                    const component = window.bi.utils.getComponentData(name)
                    if (component === undefined) {
                      console.log("未找到组件", name);
                      return
                    }
                    let attributeName = ""
                    let data = null
                    if (component.component === 'v-text') {
                      attributeName = "data.text"
                      data = newItem[key]
                    } else if (component.component === 'v-picture') {
                      data = newItem[key]
                      if (data.startsWith("/") || data.startsWith("http")) {
                        attributeName = "data.imageUrl"
                      } else {
                        attributeName = "data.image"
                      }
                    } else if (component.component === "v-video") {
                      attributeName = "data.video"
                      data = newItem[key]
                    } else {
                      console.warn("无法设置数据", newItem);
                      return
                    }
                    if (attributeName === "" || data === undefined || data === null) {
                      console.log("组件数据错误");
                      return
                    }
                    store.commit("setCanvasComponentAttribute", [
                      attributeName,
                      name,
                      data
                    ]);
                  }
                })
                continue
              } else {
                console.warn("数据不对劲...");
                continue
              }
              store.commit("setCanvasComponentAttribute", [
                attributeName,
                name,
                data
              ]);
            }
          } else if (Object.prototype.toString.call(item) === '[object Object]' || (Array.isArray(item) && item.length === 1 &&
            Object.prototype.toString.call(item[0]) === '[object Object]' && Object.keys(item[0])[0].trim().startsWith("@NAME"))) {

            let newItem = item
            if (Array.isArray(newItem))
              newItem = newItem[0]
            const keys = Object.keys(newItem)
            keys.forEach(key => {
              if (key.trim().startsWith("@NAME")) {
                const name = key.trim().substring("@NAME".length).trim()
                const component = window.bi.utils.getComponentData(name)
                if (component === undefined) {
                  console.log("未找到组件", name);
                  return
                }
                let attributeName = ""
                let data = null
                if (component.component === 'v-text') {
                  attributeName = "data.text"
                  data = newItem[key]
                } else if (component.component === 'v-picture') {
                  data = newItem[key]
                  if (data.startsWith("/") || data.startsWith("http")) {
                    attributeName = "data.imageUrl"
                  } else {
                    attributeName = "data.image"
                  }
                } else if (component.component === "v-video") {
                  attributeName = "data.video"
                  data = newItem[key]
                } else {
                  console.warn("无法设置数据", newItem);
                  return
                }
                if (attributeName === "" || data === undefined || data === null) {
                  console.log("组件数据错误");
                  return
                }
                store.commit("setCanvasComponentAttribute", [
                  attributeName,
                  name,
                  data
                ]);
              }
            })
          } else {
            console.warn("数据发生了异常,请检查sql", item, task);
            continue
          }
        } finally {

        }
      }


      let index = 0
      response.data.forEach(item => {


      })

    }



  } else {
    const data = response.data.data
    if (Array.isArray(data)) {
      data.forEach(({ attributeName, name, data }) => {
        store.commit("setCanvasComponentAttribute", [
          attributeName,
          name,
          data
        ]);

      })
    }
  }
  // todo: 匹配data中的name
}

// 数据绑定器
// todo: 用户注册的回调函数修改数据请求
export function requestCanvasData(canvasName, callback) {

  if (canvasName === undefined) {
    console.warn("未设置看板名称");
    return
  }

  // 这里一定要设置名称
  this.$store.commit("setCanvasName", canvasName);

  const getCanvasData = async (name, callback) => {

    const canvasList = await DB.getAllItemByType("Canvas-Data");

    let hasName = false
    if (canvasList !== undefined && canvasList !== null && canvasList.length > 0) {
      for (const data of canvasList) {
        if (data.name === name) {
          if (data.checkCode !== undefined) {
            const response = await axios.get(`/BI-API/Component/GetCanvasCheckCode?name=${name}`)
            if (response !== undefined && response.data !== undefined) {
              const code = response.data.data
              if (data.checkCode !== code) {
                hasName = false
                break
              }
            }
          }
          hasName = true
          const canvasData = JSONfn.parse(data.canvasData);
          const canvasComponentData = JSONfn.parse(data.canvasComponentData);

          // 恢复画布
          this.$store.commit(
            "setCanvasComponentData",
            this.resetID(canvasComponentData)
          );
          this.$store.commit("setCanvasData", canvasData);
          const dataSource = canvasData.dataSource

          let dataSourceText = dataSource.parameters.trim()
          if (dataSourceText.startsWith("[") && dataSourceText.endsWith("]")) {
            const sourceList = JSON.parse(dataSourceText)

            sourceList.forEach(task => {

              if (task.componentType)
                delete task.componentType

              for (let i = 0; i < canvasComponentData.length; i++) {
                let component = canvasComponentData[i];
                if (component.component === "Group")
                  component = component.propValue.find(item => item.data.name === task.componentName)
                if (component === undefined || component === null)
                  continue
                if (task.componentName === component.data.name) {
                  task.componentType = component.component
                  break
                }
              }
              if (task.componentType === undefined) {
                console.warn("组件丢失了: " + task.componentName);
              }
              if (task.dataSourceType === "script") {

                task.call = () => {
                  if (task.method === undefined) {
                    codeToInstance(task.scriptLanguage || "js", task.script).then(instance => {
                      console.log("Object.prototype.toString.call(instance)", Object.prototype.toString.call(instance));
                      if (Object.prototype.toString.call(instance) === "[object Module]") {
                        task.method = instance.default.bind(this)
                      } else if (Object.prototype.toString.call(instance) === '[object Function]') {
                      } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
                      }
                    })
                  } else {
                    const response = task.method(task)
                    if (Object.prototype.toString.call(response) === "[object Promise]") {
                      response.then(data => {
                        commitData(this.$store, task, data)
                      }).catch(error => {
                        console.error(`执行script任务异常`, task, error);
                      })
                    } else {
                      commitData(this.$store, task, response)
                    }
                  }
                }
              } else if (task.dataSourceType === "database") {

                let attributeName = ""
                if (task.componentType === "v-table") {
                  // attributeName = "data.tableData"
                } else if (task.componentType === "vc-chart") {
                  // attributeName = "data.option.series[@index0].data[@index1].value"
                } else {
                  // console.log("数据异常", task, "componentName: " + task.componentName, "componentType: " + task.componentType);
                }

                if (task.sqlMap === undefined) {

                  // 解析任务的配置,提供给框架决策
                  task.config = {}
                  const newlineMathc = /(\s*\r?\n\s*){2}/g.exec(task.sql)
                  if (newlineMathc) {
                    const commentLines = task.sql.substring(0, newlineMathc.index).split(/\r?\n/)
                    const isAllCommentLine = commentLines.every(s => s.trim().startsWith('--'))
                    if (isAllCommentLine) {
                      task.sql = task.sql.substring(newlineMathc.index).trim()
                      const kvArr = []
                      for (const line of commentLines) {
                        const arr = line.match(/@[\wa-zA-Z0-9]+\s+[a-zA-Z0-9_\-\u4e00-\u9fa5~!@#$%^&*()+]+(?=@{0})/g)
                        if (arr) {
                          kvArr.push(...arr)
                        }
                      }
                      if (kvArr.length > 0) {
                        for (const item of kvArr) {
                          const at = item.indexOf(' ')
                          if (at === -1) {
                            continue
                          }
                          const k = item.substring(0, at).trim().toLowerCase()
                          const v = item.substring(at).trim()
                          task.config[k] = v
                        }
                      }
                    }
                  }

                  task.sqlMap = {}
                  const sqlList = task.sql.split(/\n{2,}/g)
                  for (let i = 0; i < sqlList.length; i++) {
                    let sql = sqlList[i].trim();
                    if (sql.startsWith("--")) {
                      const commentLines = sql.match(/--.*/g)
                      const kvArr = []
                      for (const line of commentLines) {
                        const arr = line.match(/@[\wa-zA-Z0-9]+\s+[a-zA-Z0-9_\-\u4e00-\u9fa5~!@#$%^&*()+]+/g)
                        if (arr)
                          kvArr.push(...arr)
                      }
                      if (kvArr.length > 0)
                        task.sqlMap[`sql[${i}]`] = kvArr
                    }
                  }
                }

                task.call = () => {
                  axios.post('/BI-API/DataSource/GetData', task, { timeout: 100000 }).then(({ data }) => {
                    if (data.state !== 200) {
                      console.error("请求数据异常");
                      return
                    }
                    if (task.dataTypeToken === undefined && task.componentType === "vc-chart") {
                      task.dataTypeToken = getDataTypeToken(data.data)  // data.data
                    }
                    if (task.componentType === "vc-chart") {
                      data.data = convertDataFormat(task.dataTypeToken, data.data)
                    }
                    commitData(this.$store, task, {
                      name: task.componentName,
                      attributeName: attributeName,
                      data: data.data
                    })
                  });
                }
              } else {
                throw new Error("无法处理的任务配置: " + JSON.stringify(task))
              }
              schedule.cancelJob(task.jobName);
              const job = schedule.scheduleJob(
                task.name,
                task.cron,
                function () {
                  TaskManager.invoke(task.name)
                }
              )
              if (job) {
                TaskManager.add(task.name, task, job)
                TaskManager.invoke(task.name)
              }
            })
          } else {
            const sourceList = parseText(dataSourceText)
            sourceList.forEach(task => {
              for (let i = 0; i < canvasComponentData.length; i++) {
                let component = canvasComponentData[i];
                if (component.component === "Group")
                  component = component.propValue.find(item => Object.keys(task.element).includes(item.data.name))
                if (component === undefined || component === null)
                  continue
                const element = task.element[component.data.name]
                if (element === undefined || element === null)
                  continue
                element.componentType = component.component
                if (element.componentType === "vc-chart") {
                }
              }

              // 合并任务
              testTask(task).then((task) => {
                if (task.cron === undefined)
                  task.cron = dataSource.cron
                if (task.type === "get") {
                  task.call = () => {
                    axios.get(task.source).then(response => {
                      if (response.status !== 200 || !response) {
                        console.error(task, response);
                        return
                      }
                      commitData(this.$store, task, response)
                    }).catch(error => {
                      const errorResponse = JSON.parse(JSON.stringify(error))
                      console.warn("任务执行报错", task, errorResponse);
                    })
                  }
                } else if (task.type === "post") {

                  task.call = () => {
                    axios.post(task.source).then(response => {
                      if (response.status !== 200 || !response) {
                        console.error(task, response);
                        return
                      }
                      commitData(this.$store, task, response)
                    }).catch(error => {
                      const errorResponse = JSON.parse(JSON.stringify(error))
                      console.warn("任务执行报错", task, errorResponse);
                    })
                  }

                } else if (task.type === "script") {

                  task.call = () => {

                    if (task.method === undefined || task.method === null) {
                      if (task.method === null)
                        return
                      const arr = task.source.trim().split("*")
                      const scriptPath = arr[0].trim()
                      const methodName = arr[1]
                      task.method = null
                      axios.get("/BI-API/Component/GetScript", {
                        params: {
                          name: scriptPath,
                        },
                        timeout: 6000,
                      })
                        .then(({ data }) => {
                          if (data.state !== 200) {
                            console.warn("执行任务获取脚本异常", data);
                            return
                          }
                          codeToInstance(scriptPath, data.data).then(instance => {
                            let method = null
                            if (Object.prototype.toString.call(instance) === "[object Module]") {
                              if (methodName === undefined || methodName === null) {
                                method = instance.default.bind(this)
                              } else if (Object.prototype.toString.call(methodName) === "[object String]" &&
                                Object.prototype.toString.call(instance[methodName]) === "[object Function]") {
                                method = instance[methodName].bind(this)
                              } else {
                              }
                            } else if (Object.prototype.toString.call(instance) === '[object Function]') {
                            } else if (Object.prototype.toString.call(module.default) === '[object Object]') {
                            }
                            if (method === null) {
                              console.error(`找不到任务执行的方法`, "方法名: " + methodName, "实例类型: " + Object.prototype.toString.call(instance), "代码: " + data.data);
                              return
                            }
                            task.method = method
                          })
                        })
                        .catch((error) => {
                          console.error(`${scriptPath}脚本异常: `, error);
                        });
                    } else {
                      const response = task.method()
                      if (Object.prototype.toString.call(response) === "[object Promise]") {
                        response.then(data => {
                          commitData(this.$store, task, data)
                        }).catch(error => {
                          console.error(`执行script任务异常`, task, error);
                        })
                      } else {
                        commitData(this.$store, task, response)
                      }
                    }
                  }

                } else {
                  task.call = () => {
                    axios.post("/BI-API/CronJob/RequestData", task).then(response => {
                      if (response === undefined || response === null || response.status !== 200) {
                        console.error("任务执行报错1", task, response);
                        return
                      }
                      commitData(this.$store, task, response)
                    }).catch(error => {
                      const errorResponse = JSON.parse(JSON.stringify(error))
                      console.warn("任务执行报错2", task, errorResponse);
                    })
                  }
                }

                schedule.cancelJob(task.jobName);
                const job = schedule.scheduleJob(
                  task.jobName,
                  task.cron,
                  function () {
                    TaskManager.invoke(task.name)
                  }
                )

                if (job) {
                  TaskManager.add(task.name, task, job)
                  TaskManager.invoke(task.name)
                }

              })
            });
          }
          return;
        }
      }
    }

    if (!hasName) {

      axios.get(`/BI-API/Component/GetCanvasTemplate`, {
        params: {
          name: name,
        },
        timeout: 1000 * 60 * 30,
      })
        .then(({ data }) => {
          if (data.state !== 200) {
            callback(false, data)
            return
          }
          DB.setItem(name, JSON.parse(data.data)).then(() => {
            getCanvasData(name);
          }).catch((error) => {
            toast("浏览器数据保存异常")
            console.error("getCanvasData|浏览器数据保存异常", error);
          })
        })
        .catch((error) => {
          console.error("getCanvasData|indexDB保存数据异常", JSON.stringify(error));
          callback(false, error)
        });
    }
  };

  if (callback === undefined) {
    callback = (success, error) => {
      if (!success) {
        console.trace("发生异常", error);
      }
    }
  }

  getCanvasData(canvasName, callback);
}

