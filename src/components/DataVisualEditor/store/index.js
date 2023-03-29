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
import { addStyleListToHead } from '../utils/style'

Vue.use(Vuex)

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
      unit: 'viewport',
      background: '',
      dataSource: {}
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
    canvasName: ""
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
      const componentAttributeDataMap = params[1]
      for (const component of state.canvasComponentData) {
        const attributeData = componentAttributeDataMap[component.name]
        if (attributeData)
          component[attribute] = { ...component[attribute], ...attributeData }
      }
    },

    setListData(state, listData = []) {
      Vue.set(state, 'listData', listData)
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
