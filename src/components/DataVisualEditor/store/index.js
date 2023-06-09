import Vue from 'vue'
import Vuex from 'vuex'
import animation from './animation'
import compose from './compose'
import contextmenu from './contextmenu'
import copy from './copy'
import event from './event'
import layer from './layer'
import snapshot from './snapshot'
import lock from './lock'
import { addStyleListToHead, pxToVw, pxToVh, vwToPx, vhToPx } from '../utils/style'
import {
  getValueByAttributePath, setJsonAttribute, SetValueAndAttributePathFromKey, typeEqual
} from "../utils/chartUtils";
import eventBus from "../utils/eventBus";

Vue.use(Vuex)


/**
 * 字符串出现的次数
* str { String } 完整字符串
* tatget { String } 目标对象，要查找的字符串
*/
function searchStrIndexOf(str, target) {
  let index = str.indexOf(target)
  let sum = 0;
  while (index > -1) {
    index = str.indexOf(target, index + 1)
    sum++
  }
  return sum
}

const ObjectToChartOption = (option, obj, indexList) => {

  const keys = Object.keys(obj)
  keys.forEach(key => {
    let path = key.substring(5).split(/\s+/).filter(str => str !== undefined && str !== null && str.trim() !== "").pop().trim()


    if (searchStrIndexOf(path, "[]") === 1 && indexList.length === 1) {
      path = path.replace("[]", `[${indexList[0]}]`)
    } else if (searchStrIndexOf(path, "[]") === 2 && indexList.length === 2) {
      path = path.replace("[]", `[${indexList[0]}]`)
      path = path.replace("[]", `[${indexList[1]}]`)
    } else if (searchStrIndexOf(path, "[]") === 1 && indexList.length === 2) {
      path = path.replace("[]", `[${indexList[1]}]`)
    }

    const value = obj[key]
    // 检测path存在吗
    const find = getValueByAttributePath(option, path)
    if (Array.isArray(find) && !Array.isArray(value) && !Object.prototype.toString.call(value) !== "[object Object]")
      path = path + `[${indexList[0]}]`

    setJsonAttribute(option, path, value, false)
  })

}



const data = {
  state: {
    ...animation.state,
    ...compose.state,
    ...contextmenu.state,
    ...copy.state,
    ...event.state,
    ...layer.state,
    ...snapshot.state,
    ...lock.state,

    editMode: 'edit', // 编辑器模式 edit preview
    canvasData: { // 页面全局数据
      width: 100,
      height: 100,
      scale: 100,
      unit: '%',
      dataSource: {
        cron: "*/30 * * * * *",
        parameters: "http://172.16.2.40:9096/#/project"
      },
      deviceType: "pc" // pc,tab,mobile
    },
    isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
    canvasComponentData: [], // 画布组件数据
    listData: [],
    curComponent: null,
    curComponentIndex: null,
    // 点击画布时是否点中组件，主要用于取消选中组件用。
    // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
    isClickComponent: false,
    editorHint: "",
    currentPrintIndex: 0,
    canvasName: "",
    activeComponentList: [] // 激活的组件列表
  },
  mutations: {
    ...animation.mutations,
    ...compose.mutations,
    ...contextmenu.mutations,
    ...copy.mutations,
    ...event.mutations,
    ...layer.mutations,
    ...snapshot.mutations,
    ...lock.mutations,

    setClickComponentStatus(state, status) {
      state.isClickComponent = status
    },

    setEditorHint(state, hint) {
      state.editorHint = hint
      setTimeout(() => {
        state.editorHint = ""
      }, 10000);
    },

    setCurrentPrintIndex(state, index) {
      state.currentPrintIndex = index;
    },

    setEditMode(state, mode) {
      state.editMode = mode
    },

    setCanvasName(state, canvasName) {
      state.canvasName = canvasName
    },

    setInEditorStatus(state, status) {
      state.isInEdiotr = status
    },

    setCanvasData(state, canvasData) {
      state.canvasData = canvasData
    },

    setCurComponent(state, { component, index }) {
      state.curComponent = component
      state.curComponentIndex = index
    },

    setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
      if (top) curComponent.style.top = top
      if (left) curComponent.style.left = left
      if (width) curComponent.style.width = width
      if (height) curComponent.style.height = height
      if (rotate) curComponent.style.rotate = rotate
    },

    setShapeSingleStyle({ curComponent }, { key, value }) {
      curComponent.style[key] = value
    },

    setCanvasComponentData(state, canvasComponentData = []) {
      Vue.set(state, 'canvasComponentData', canvasComponentData)

      // todo 此处可用优化
      canvasComponentData.forEach((component) => {
        addStyleListToHead(component, state.canvasName);
      });
    },



    // 设置组件的属性
    setCanvasComponentAttribute(state, params) {

      const attribute = params[0]
      const name = params[1]
      const data = params[2]
      // const {dataTypeToken}   = params[3]


      for (const item of state.canvasComponentData) {

        let component = item
        if (item.component === "Group")
          component = component.propValue.find(item => name === item.data.name)
        if (component === undefined || component === null || component.data.name !== name)
          continue

        if (component.component.startsWith("vc-")) {

          if (data.dataTypeToken !== undefined && data.dataTypeToken !== null) {
            const option = component.data.option
            if (data.dataTypeToken === "[n]{@PATH:value}") {
              for (let i = 0; i < data.data.length; i++) {
                const obj = data.data[i];
                ObjectToChartOption(option, obj, [i])
              }
            } else if (data.dataTypeToken === "[n][n]{@PATH:value}") {
              const arr = data.data
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                  const obj = arr[i][j]
                  ObjectToChartOption(option, obj, [i, j])
                }
              }
            } else if (data.dataTypeToken === "[n][1]{SameAttributeName}") {
              const map = data.data
              const keys = Object.keys(map)

              let serieIndex = 0
              keys.forEach(name => {

                let serie = option.series.find(item => item.name === name)
                if (serie === undefined) {
                  serie = option.series[serieIndex]
                }
                serieIndex++

                if (serie.type === "bar" || serie.type === "line") {
                  if (serie.type === "line") {
                    console.log("设置line--", serie);
                  }

                  if (Array.isArray(serie.data) && serie.data.every(item => typeof item !== 'object')) {
                    const isNumberArray = serie.data.every(val => {
                      if (typeof val === 'number')
                        return true
                      else if (typeof val === 'string') {
                        if (/^(-\.|\.|\+.){0,1}\d+?$/g.test(val) || /^[+-]?\d+(\.\d+)?$/g.test(val)) {
                          return true
                        } else {
                          return false
                        }
                      }
                      return false
                    })
                    if (isNumberArray) {
                      serie.data = map[name]
                    } else {  // todo 需要每一项单独去设置
                      throw new Error("需要每项单独去设置...")
                    }
                  } else if (Array.isArray(serie.data) && serie.data.every(item => typeof item === 'object')) {
                    for (let i = 0; i < map[name].length; i++) {
                      const val = map[name][i];
                      if (serie.data[i] === undefined) {
                        console.error("setCanvasComponentAttribute|数据不匹配,请检查", params);
                        break
                      }
                      serie.data[i].value = val
                    }
                  } else {
                    throw new Error("异常了...")
                  }

                } else if (serie.type === "line") {


                }
              })

              console.log("数据异常AA1设置之后", component.data.option.series);

            } else if (data.dataTypeToken === "[n][1]{NumberAttributeName}") {

            } else if (data.dataTypeToken === "[n][1]{StringAttributeName}" || data.dataTypeToken === "[n][n]{StringAttributeName}") {

            }

          } else if (Array.isArray(data) && Object.prototype.toString.call(data[0]) === '[object Object]') {



          } else if (Object.prototype.toString.call(data) === '[object Object]') {

            const keys = Object.keys(data)
            keys.forEach(key => {

              const value = data[key]
              const attributeList = key.match(/@\w+/g)
              if (attributeList !== null) {
                for (let i = 0; i < attributeList.length; i++) {
                  // todo 替换变量
                }
              }
              let newData = JSON.parse(JSON.stringify(component.data))
              if (key.includes("@index")) {
                for (let i = 0; i < value.length; i++) {
                  const pathValue = key.replaceAll("@index", i)
                  newData = setJsonAttribute(newData, pathValue, value[i])
                }
              } else {
                newData = setJsonAttribute(newData, key, value)
              }
              eventBus.$emit("SetOption", name, newData.option)
            })

          } else {
            console.warn("setCanvasComponentAttribute|无法处理", params);
          }

        } else {
          if (component[attribute] === undefined || component[attribute] !== null || attribute.includes(".")) {
            setJsonAttribute(component, attribute, data, false)
          } else if (component[attribute] !== undefined && component[attribute] !== null) {
            component[attribute] = { ...component[attribute], ...data }
          } else {
            console.error(`绑定组件数据发送错误,找不到组件属性${attribute}`, component);
          }
        }

      }
    },

    setListData(state, listData = []) {
      Vue.set(state, 'listData', listData)
    },

    addActiveComponent(state, id) {

      state.activeComponentList.push(id)
    },

    deleteActiveComponent(state, id) {

      const i = state.activeComponentList.indexOf(id)
      if (i === -1) {
        return
      }
      Vue.delete(state.activeComponentList, i)
    },

    clearActiveComponent(state) {
      Vue.set(state, "activeComponentList", [])
    },

    addComponent(state, { component, index }) {

      if (index !== undefined) {
        state.canvasComponentData.splice(index, 0, component)
      } else {
        state.canvasComponentData.push(component)
      }
      addStyleListToHead(component, state.canvasName);
    },

    deleteComponent(state, index) {
      if (index === undefined) {
        index = state.curComponentIndex
      }

      if (index == state.curComponentIndex) {
        state.curComponentIndex = null
        state.curComponent = null
      }

      if (/\d/.test(index)) {
        state.canvasComponentData.splice(index, 1)
      }
    },
  },
  getters: {
  },
  actions: {
  },
  modules: {
  }
}

export default new Vuex.Store(data);
