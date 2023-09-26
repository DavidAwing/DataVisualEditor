import store from './index'
import generateID from '../utils/generateID'
import eventBus from '../utils/eventBus'
import decomposeComponent from '../utils/decomposeComponent'
import { $, getRandStr } from '../utils/utils'
import { commonStyle, commonAttr } from '../custom-component/component-list'
import createGroupStyle from '../utils/createGroupStyle'
import { getElementRect } from '../utils/domUtils'
import Vue from 'vue'

export default {
  state: {
    areaData: { // 选中区域包含的组件以及区域位移信息
      style: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
      components: [],
    },
    editor: null,
  },
  mutations: {
    getEditor(state) {
      state.editor = $('#editor')
    },

    setAreaData(state, data) {
      state.areaData = data
    },


    // todo 这里不同的尺寸之间要重新计算,但是又不能改变原有的尺寸
    compose({ canvasComponentData, areaData, editor }) {

      const components = []
      areaData.components.forEach(component => {
        if (component.component != 'Group') {
          components.push(component)
        } else {
          // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
          const parentStyle = { ...component.style }
          const subComponents = component.propValue
          const editorRect = editor.getBoundingClientRect()

          subComponents.forEach(component => {
            decomposeComponent(component, editorRect, parentStyle)
          })

          // components.push(...component.propValue)
          components.push(...subComponents)
        }
      })

      const rectList = []
      components.forEach(item => {
        const element = document.getElementById("component" + item.id);
        const rect = getElementRect(element);
        rectList.push(rect)
      })

      rectList.sort((a, b) => { return a.left - b.left })
      const groupLeft = rectList[0].left
      let lastRight = rectList[0].left + rectList[0].width
      rectList.forEach(item => {
        if (item.left + item.width > lastRight)
          lastRight = item.left + item.width
      })
      const groupWidth = lastRight - groupLeft

      rectList.sort((a, b) => { return a.top - b.top })
      const groupTop = rectList[0].top
      let lastBottom = rectList[0].top + rectList[0].height
      rectList.forEach(item => {
        if (item.top + item.height > lastBottom)
          lastBottom = item.top + item.height
      })
      const groupHeight = lastBottom - groupTop

      const groupComponent = {
        id: generateID(),
        component: 'Group',
        ...commonAttr,
        style: {
          ...commonStyle,
          ...{
            left: groupLeft,
            top: groupTop,
            width: groupWidth,
            height: groupHeight
          },
        },
        propValue: components,
        data: {
          name: getRandStr(),
          show: true,
          isAlign: false,
          isModal: false,
          dialogAlign: 'top|center'
        },
        styleUnit: {
          top: "px",
          left: "px",
          width: 'px',
          height: 'px',
        },
        attrList: [
          {
            key: "name",
            type: "text",
            label: '名称',
            bind: "data",
            options: {}
          },
          {
            key: "show",
            type: "checkbox",
            label: '显示',
            bind: "data",
            options: {}
          },
          {
            key: "isAlign",
            type: "checkbox",
            label: '对齐',
            bind: 'data',
            options: {}
          },
          {
            key: "isModal",
            type: "checkbox",
            label: '悬浮框模式',
            bind: "data"
          },
          {
            key: "isDrag",
            type: "checkbox",
            label: '可拖拽',
            bind: "data"
          },
          {
            key: "left",
            type: "number",
            label: 'x 坐标',
            bind: "style",
            options: {}
          },
          {
            key: "top",
            type: "number",
            label: 'y 坐标',
            bind: "style",
            options: {}
          },
          {
            key: "width",
            type: "number",
            label: '宽',
            bind: "style",
            options: {}
          },
          {
            key: "height",
            type: "number",
            label: '高',
            bind: "style",
            options: {}
          },
          {
            key: "rotate",
            type: "number",
            label: '旋转',
            bind: "style",
            options: {}
          },
          {
            key: "dialogAlign",
            type: "select",
            label: '位置',
            bind: 'data',
            options: [
              {
                label: '居中',
                value: 'center',
              },
              {
                label: '上对齐,左右居中',
                value: 'top|center'
              },
              {
                label: '左对齐,上下居中',
                value: 'left|center'
              },
              {
                label: '左上对齐',
                value: 'left|top'
              },
              {
                label: '无',
                value: 'none',
              }
            ]
          }
        ]
      }

      Vue.set(groupComponent.data, 'isModal', false)

      createGroupStyle(groupComponent)
      store.commit('addComponent', {
        component: groupComponent,
      })
      eventBus.$emit('hideArea')
      store.commit('batchDeleteComponent', areaData.components)
      store.commit('setCurComponent', {
        component: canvasComponentData[canvasComponentData.length - 1],
        index: canvasComponentData.length - 1,
      })

      areaData.components = []
    },

    // 将已经放到 Group 组件数据删除，也就是在 canvasComponentData 中删除，因为它们已经从 canvasComponentData 挪到 Group 组件中了
    batchDeleteComponent({ canvasComponentData }, deleteData) {
      deleteData.forEach(component => {
        for (let i = 0, len = canvasComponentData.length; i < len; i++) {
          if (component.id == canvasComponentData[i].id) {
            canvasComponentData.splice(i, 1)
            break
          }
        }
      })
    },

    decompose({ curComponent, editor }) {

      const parentStyle = { ...curComponent.style }
      const components = curComponent.propValue
      const editorRect = editor.getBoundingClientRect()
      store.commit('deleteComponent')
      components.forEach(component => {
        decomposeComponent(component, editorRect, parentStyle)
        store.commit('addComponent', { component })
      })
    },
  },
}
