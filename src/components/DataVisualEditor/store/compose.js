import store from './index'
import generateID from '../utils/generateID'
import eventBus from '../utils/eventBus'
import decomposeComponent from '../utils/decomposeComponent'
import { $ } from '../utils/utils'
import { commonStyle, commonAttr } from '../custom-component/component-list'
import createGroupStyle from '../utils/createGroupStyle'

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

          components.push(...component.propValue)
        }
      })

      const groupComponent = {
        id: generateID(),
        component: 'Group',
        ...commonAttr,
        style: {
          ...commonStyle,
          ...areaData.style,
        },
        propValue: components,
        data: {
          show: true
        },
        styleUnit: {
          top: "px",
          left: "px",
          width: 'px',
          height: 'px',
        }
      }

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
