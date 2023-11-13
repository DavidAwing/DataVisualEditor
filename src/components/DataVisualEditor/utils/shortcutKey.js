/* global $ */

import store from '@/store'
import eventBus from './eventBus'

const ctrlKey = 17
const commandKey = 91 // mac command
const vKey = 86 // 粘贴
const cKey = 67 // 复制
const xKey = 88 // 剪切

const yKey = 89 // 重做
const zKey = 90 // 撤销

const gKey = 71 // 组合
const bKey = 66 // 拆分

const lKey = 76 // 锁定
const uKey = 85 // 解锁

const sKey = 83 // 保存
const pKey = 80 // 预览
const dKey = 68 // 删除
const deleteKey = 46 // 删除
const eKey = 69 // 清空画布
const escKey = 27 // 取消组件选择

const tabKey = 9

export const keycodes = [66, 67, 68, 69, 71, 76, 80, 83, 85, 86, 88, 89, 90]


const globalShortcutKey = [sKey]


const KeyboardManager = {
  keys: [],

  // down
  add: (key) => {
    if (KeyboardManager.keys.find(k => k.code === key.keyCode) === undefined) {
      KeyboardManager.keys.push(key)

      KeyboardManager.getEvents(key.keyCode).forEach(func => {
        func()
      });
    }
  },
  // up
  delete: (val) => {

    if (typeof val === 'number') {

      let index = KeyboardManager.keys.findIndex(key => key.code === val)
      while (index !== -1) {
        KeyboardManager.keys.splice(index, 1);
        index = KeyboardManager.keys.findIndex(key => key.code === val)
      }

    }


  },
  isKeyDown: (key) => {

  },
  addEvent: (name, func) => {

    if (KeyboardManager.events[name] === undefined) {
      KeyboardManager.events[name] = []
    }

    KeyboardManager.events[name].push(func)
  },
  getEvents: (val) => {

    let name = val
    if (typeof val === 'number') {
      switch (val) {
        case 17:
          name = 'ctrl'
          break;

        default:
          break;
      }
    }

    return KeyboardManager.events[name] ?? []
  },
  clearEvents() {
    KeyboardManager.events = {}
  },
  events: {
  },


}

window.bi.KeyboardManager = KeyboardManager


function copy() {
  store.commit('copy')
}

function paste() {
  store.commit('paste')
  store.commit('recordSnapshot')
}

function cut() {
  store.commit('cut')
}

function redo() {
  store.commit('redo')
}

function undo() {
  store.commit('undo')
}

function compose() {
  if (store.state.areaData.components.length) {
    store.commit("compose")
    store.commit("recordSnapshot")
  }
}

function decompose() {
  const curComponent = store.state.curComponent
  if (curComponent && !curComponent.isLock && curComponent.component == 'Group') {
    store.commit("decompose")
    store.commit("recordSnapshot")
  }
}

function save() {
  console.log('key保存');
  eventBus.$emit('save')
}

function preview() {
  eventBus.$emit('preview')
}

function deleteComponent() {
  if (store.state.curComponent) {
    store.commit('deleteComponent')
    store.commit('recordSnapshot')
  }
}

function clearCanvas() {
  eventBus.$emit('clearCanvas')
}

function lock() {
  store.commit('lock')
}

function unlock() {
  store.commit('unlock')
}

// 与组件状态无关的操作
const basemap = {
  [vKey]: paste,
  [yKey]: redo,
  [zKey]: undo,
  [sKey]: save,
  [pKey]: preview,
  [eKey]: clearCanvas,
}

// 组件锁定状态下可以执行的操作
const lockMap = {
  ...basemap,
  [uKey]: unlock,
}

// 组件未锁定状态下可以执行的操作
const unlockMap = {
  ...basemap,
  [cKey]: copy,
  [xKey]: cut,
  [gKey]: compose,
  [bKey]: decompose,
  [dKey]: deleteComponent,
  [deleteKey]: deleteComponent,
  [lKey]: lock
}

let isCtrlOrCommandDown = false

export function isCtrlDown() {
  return isCtrlOrCommandDown
}

// 全局监听按键操作并执行相应命令
export function listenGlobalKeyDown() {
  window.onkeydown = (e) => {

    const { keyCode } = e

    if (!store.state.isInEdiotr && !globalShortcutKey.includes(keyCode)) return
    const { curComponent } = store.state

    if (keyCode === ctrlKey || keyCode === commandKey) {
      isCtrlOrCommandDown = true
    } else if (keyCode == deleteKey && curComponent) {
      store.commit('deleteComponent')
      store.commit('recordSnapshot')
    } else if (e.keyCode === tabKey) {
      e.preventDefault()
    } else if (e.ctrlKey) {
      if (unlockMap[keyCode] && (!curComponent || !curComponent.isLock)) {
        e.preventDefault()
        unlockMap[keyCode]()
      } else if (lockMap[keyCode] && curComponent && curComponent.isLock) {
        e.preventDefault()
        lockMap[keyCode]()
      }
    }
  }

  window.onkeyup = (e) => {
    const { keyCode } = e

    console.log('keyCode', keyCode);

    // KeyboardManager.delete(keyCode)

    if (keyCode == escKey) {
      store.commit("setCurComponent", { component: null, index: null });
    }

    if (keyCode === ctrlKey || keyCode === commandKey) {
      isCtrlOrCommandDown = false
      $('#EmbeddedComponentModeDiv').css('display', 'none')
    }
    // Tab切换激活的组件
    if (keyCode === tabKey) {
      e.preventDefault()
      eventBus.$emit("SwitchNextComponent", e)
    }
  }

  window.onmousedown = (e) => {
    store.commit('setInEditorStatus', false)
  }
}

