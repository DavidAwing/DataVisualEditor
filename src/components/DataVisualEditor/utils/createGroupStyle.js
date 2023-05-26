import { getStyle } from './style'
import { toPercent } from './translate'
import { getElementRect } from './domUtils'

export default function createGroupStyle(groupComponent) {
  const parentStyle = groupComponent.style
  groupComponent.propValue.forEach(component => {
    // component.groupStyle 的 top left 是相对于 group 组件的位置
    // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
    if (!Object.keys(component.groupStyle).length) {

      if (component.styleUnit.left === "%" && component.styleUnit.top === "%" && component.styleUnit.width === "%" && component.styleUnit.height === "%") {
        const style = { ...component.style }
        const element = document.getElementById("component" + component.id);
        const rect = getElementRect(element);
        component.groupStyle = getStyle(style, component.styleUnit)
        component.groupStyle.left = toPercent((rect.left - parentStyle.left) / parentStyle.width)
        component.groupStyle.top = toPercent((rect.top - parentStyle.top) / parentStyle.height)
        component.groupStyle.width = toPercent(rect.width / parentStyle.width)
        component.groupStyle.height = toPercent(rect.height / parentStyle.height)
      } else if (component.styleUnit.left === "px" && component.styleUnit.top === "px" && component.styleUnit.width === "px" && component.styleUnit.height === "px") {
        const style = { ...component.style }
        component.groupStyle = getStyle(style, component.styleUnit)
        component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width)
        component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height)
        component.groupStyle.width = toPercent(style.width / parentStyle.width)
        component.groupStyle.height = toPercent(style.height / parentStyle.height)
      } else {
        throw new Error("createGroupStyle尺寸单位不支持")
      }
    }
  })

}
