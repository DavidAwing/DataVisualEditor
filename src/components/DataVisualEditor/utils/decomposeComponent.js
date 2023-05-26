import { $ } from './utils'
import { mod360 } from './translate'
import { getElementRect, getGroupChildElementRect } from './domUtils'

// 将组合中的各个子组件拆分出来，并计算它们新的 style
export default function decomposeComponent(component, editorRect, parentStyle) {

  if (component.styleUnit.left === "%") {

    const element = document.getElementById("component" + component.id);
    const rect = getGroupChildElementRect(element);

    // 计算出元素新的坐标
    component.style.rotate = mod360(component.style.rotate + parentStyle.rotate)
    component.style.width = rect.width / editorRect.width * 100
    component.style.height = rect.height / editorRect.height * 100
    component.style.left = rect.left / editorRect.width * 100
    component.style.top = rect.top / editorRect.height * 100
  } else if (component.styleUnit.left === "px") {
    const componentRect = $(`#component${component.id}`).getBoundingClientRect()
    // 获取元素的中心点坐标
    const center = {
      x: componentRect.left - editorRect.left + componentRect.width / 2,
      y: componentRect.top - editorRect.top + componentRect.height / 2,
    }
    component.style.rotate = mod360(component.style.rotate + parentStyle.rotate)
    component.style.width = parseFloat(component.groupStyle.width) / 100 * parentStyle.width
    component.style.height = parseFloat(component.groupStyle.height) / 100 * parentStyle.height
    // 计算出元素新的 top left 坐标
    component.style.left = center.x - component.style.width / 2
    component.style.top = center.y - component.style.height / 2
  }

  component.groupStyle = {}
}
