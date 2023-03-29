import { swap } from '../utils/utils'
import toast from '../utils/toast'

export default {
  mutations: {
    upComponent({ canvasComponentData, curComponentIndex }) {
      // 上移图层 index，表示元素在数组中越往后
      if (curComponentIndex < canvasComponentData.length - 1) {
        swap(canvasComponentData, curComponentIndex, curComponentIndex + 1)
      } else {
        toast('已经到顶了')
      }
    },

    downComponent({ canvasComponentData, curComponentIndex }) {
      // 下移图层 index，表示元素在数组中越往前
      if (curComponentIndex > 0) {
        swap(canvasComponentData, curComponentIndex, curComponentIndex - 1)
      } else {
        toast('已经到底了')
      }
    },

    topComponent({ canvasComponentData, curComponentIndex, curComponent }) {
      // 置顶
      if (curComponentIndex < canvasComponentData.length - 1) {
        canvasComponentData.splice(curComponentIndex, 1)
        canvasComponentData.push(curComponent)
      } else {
        toast('已经到顶了')
      }
    },

    bottomComponent({ canvasComponentData, curComponentIndex, curComponent }) {
      // 置底
      if (curComponentIndex > 0) {
        canvasComponentData.splice(curComponentIndex, 1)
        canvasComponentData.unshift(curComponent)
      } else {
        toast('已经到底了')
      }
    },
  },
}
