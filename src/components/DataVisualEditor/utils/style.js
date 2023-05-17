import { sin, cos, changeStyleWithScale } from './translate'
import generateID from "./generateID";


import { strToBase64, isArrayInclude } from "../utils/utils";

export const styleData = [
  { key: 'left', label: 'x 坐标' },
  { key: 'top', label: 'y 坐标' },
  { key: 'width', label: '宽' },
  { key: 'height', label: '高' },
  { key: 'rotate', label: '旋转' },
  { key: 'color', label: '颜色' },
  { key: 'backgroundColor', label: '背景色' },
  { key: 'background', label: '背景' },
  { key: 'borderWidth', label: '边框宽度' },
  { key: 'borderStyle', label: '边框风格' },
  { key: 'borderColor', label: '边框颜色' },
  { key: 'borderRadius', label: '边框半径' },
  { key: 'fontFamily', label: '字体' },
  { key: 'fontSize', label: '字体大小' },
  { key: 'fontWeight', label: '字体粗细' },
  { key: 'lineHeight', label: '行高' },
  { key: 'letterSpacing', label: '字间距' },
  { key: 'textAlign', label: '左右对齐' },
  { key: 'verticalAlign', label: '上下对齐' },
  { key: 'opacity', label: '透明度' },
]

export function getStyle(style, styleUnit, filter = []) {

  const needUnit = [
    'fontSize',
    'width',
    'height',
    'top',
    'left',
    'borderWidth',
    'letterSpacing',
    'borderRadius',
  ]

  const result = {}

  Object.keys(style).forEach(key => {
    if (!filter.includes(key)) {
      if (key != 'rotate') {
        result[key] = style[key]

        if (needUnit.includes(key)) {
          result[key] += (styleUnit ? styleUnit[key] : 'px')
        }
      } else {
        result.transform = key + '(' + style[key] + 'deg)'
      }
    }
  })

  return result
}


export function pxToVw(px) {
  return px / window.outerWidth * 100
}

export function pxToVh(px) {
  return px / window.outerHeight * 100
}

export function vwToPx(vw) {
  return vw * window.outerWidth / 100
}

export function vhToPx(vh) {
  return vh * window.outerHeight / 100
}


// 获取一个组件旋转 rotate 后的样式
export function getComponentRotatedStyle(style) {
  style = { ...style }
  if (style.rotate != 0) {
    const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate)
    const diffX = (style.width - newWidth) / 2 // 旋转后范围变小是正值，变大是负值
    style.left += diffX
    style.right = style.left + newWidth

    const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate)
    const diffY = (newHeight - style.height) / 2 // 始终是正
    style.top -= diffY
    style.bottom = style.top + newHeight

    style.width = newWidth
    style.height = newHeight
  } else {
    style.bottom = style.top + style.height
    style.right = style.left + style.width
  }

  return style
}

export function getUnit(attributeName, unit) {

  if (attributeName.toLowerCase().indexOf("width") !== -1 && unit === 'viewport') {
    return 'vw'
  } else if (attributeName.toLowerCase().indexOf("height") !== -1 && unit === 'viewport') {
    return 'vh'
  } else if (unit === '%') {
    return 'px'
  } else {
    return unit
  }
}

// todo 样式转为对象
export function cssStrToObject(cssStr) {

}

// todo
export function objectToCssStr(cssStr) {

}

export const cssTab = "    "

/**
 * 设置css变量
 * @param {*} cssStr
 * @param {*} values
 * @returns
 */
export function setStyleValues(cssStr, values) {

  if (!Array.isArray(values) && typeof values !== 'object')
    throw Error(`setStyleValues|[values]类型错误`)

  if (!Array.isArray(values))
    values = [values]

  values.forEach(item => {

    if (item == null || typeof item !== 'object') {
      console.error(`setStyleValues|样式数据错误`);
      return
    }

    const keys = Object.keys(item)
    keys.forEach(key => {
      let cssKey = ""
      if (!key.startsWith('@'))
        cssKey = '@' + key
      else
        cssKey = key

      if (!new RegExp(cssKey, 'gi').test(cssStr))
        throw Error(`setStyleValues|样式中不存在变量${cssKey}: ${cssStr}`)
      // if (!cssStr.includes(key))
      //     throw Error(`setStyleValues|样式中不存在变量${cssKey}`)
      cssStr = cssStr.replaceAll(new RegExp(`(${cssKey})`, 'gi'), item[key])
    });

  })

  return cssStr
}

/**
 * 设置css变量
 * @param {string} cssLine color: @color;
 * @param {*} keyValuePairs { color: "#f00" }
 * @returns color: red;
 */
export function setStyleValue(cssLine, keyValuePairs) {

  if (keyValuePairs == null || typeof keyValuePairs !== 'object')
    throw Error(`setStyleValue|keyValuePairs类型错误`)

  Object.keys(keyValuePairs).forEach(key => {

    let cssKey = ""
    if (!key.startsWith('@'))
      cssKey = '@' + key
    else
      cssKey = key
    if (!new RegExp(cssKey, 'gi').test(cssLine)) {
      console.warn(`setStyleValue|样式[${cssLine}]中不存在变量${cssKey}`);
      return
    }
    cssLine = cssLine.replaceAll(new RegExp(`(${cssKey})`, 'gi'), keyValuePairs[key])
  })

  return cssLine
}



// 删除样式的选择器
export function deleteSelectorForStyle(id, selector) {

  if (Array.isArray(selector) && selector.length > 0) {
    selector.forEach(item => {
      return deleteSelectorForStyle(id, item)
    });
  } else if (typeof selector === 'string') {
    const name = selector.trim()
    if (!name.startsWith('#') && !name.startsWith('.'))
      throw Error(`deleteSelectorForStyle|选择器格式不正确[${selector}]`)
    const style = document.getElementById(id)
    if (style === null)
      throw Error(`deleteSelectorForStyle|找不到指定id的样式[${id}]`)
    style.innerText = String(style.innerText.replace(new RegExp(`(${name + ',|' + name})`, "gi"), '').trim())
    if (style.innerText == '' || style.innerText.startsWith('{') || style.innerText == '{}')
      removeStyleById(id)
  } else {
    throw Error(`deleteSelectorForStyle|选择器类型不正确[${selector}]`)
  }
}

// 更新样式
export function updateStyle(id, css) {

  const style = document.getElementById(id)
  if (style === null)
    throw Error(`updateStyle|找不到指定id的样式[${id}]`)
  if (css.trim().startsWith("{"))
    throw Error(`updateStyle|css格式错误[${css}]`)

  style.innerText = css
}


// 获取样式的选择器列表
export function getStyleSelectorListById(id) {

  const style = document.getElementById(id)
  if (style === null)
    throw Error(`getStyleSelectorListById|找不到指定id的样式[${id}]`)

  const selectorPattern = /([\s\S])*(?=({))/gi
  const selectors = style.innerText.match(selectorPattern)
  const selectorList = []
  if (selectors == null || selectors.length == 0)
    throw Error(`getStyleSelectorListById|未匹配到选择器${id}`)

  selectors[0].split(",").forEach(item => {
    if (item.trim() != '')
      selectorList.push(item.trim())
  })

  return selectorList
}

export function getStyleSelectorStrById(id) {

  const style = document.getElementById(id)
  if (style === null)
    throw Error(`getStyleSelectorListById|找不到指定id的样式[${id}]`)

  return getStyleSelectorStr(style.innerText)
}

export function getStyleSelectorStr(cssStr) {

  const regexp = /([\S\s]+)(?=({))/gi
  const selectorStr = cssStr.match(regexp)

  if (selectorStr && selectorStr.length === 1) {
    return selectorStr[0]
  } else {
    console.warn(`getStyleSelectorStr|找不到样式的选择器[${cssStr}]`);
    return ""
  }
}

/**
 * 获取css字符串中的变量,以@开头的
 * @param {*} cssStr
 * @returns
 */
export function getCssKeys(cssStr) {
  const regexp = /(?<=:\s*)(@[a-zA-Z0-9\S]+)(?=(\s*;))/gi
  let keys = cssStr.match(regexp)
  return keys
}

export function getCssStrById(id) {
  const style = document.getElementById(id)
  if (style === null)
    throw Error(`getCssStrById|找不到指定id的样式[${id}]`)

  return getCssStr(style.innerText)
}

// 压缩css字符串
export function compressCssStrWhitespace(cssStr) {

  cssStr = cssStr.trim()
  cssStr = cssStr.replaceAll(/\s+/gi, " ")
  cssStr = cssStr.replaceAll(/\s+;\s+/gi, ";")
  cssStr = cssStr.replaceAll(/\s+;/gi, ";")
  cssStr = cssStr.replaceAll(/;\s+/gi, ";")
  cssStr = cssStr.replaceAll(/\s+}\\s+/gi, "}")
  cssStr = cssStr.replaceAll(/\s+}/gi, "}")
  cssStr = cssStr.replaceAll(/}\s+/gi, "}")
  cssStr = cssStr.replaceAll(/\s+{\s+/gi, "{")
  cssStr = cssStr.replaceAll(/\s+{/gi, "{")
  cssStr = cssStr.replaceAll(/{\s+/gi, "{")
  cssStr = cssStr.replaceAll(/\s+:\s+/gi, ":")
  cssStr = cssStr.replaceAll(/\s+:/gi, ":")
  cssStr = cssStr.replaceAll(/:\s+/gi, ":")
  return cssStr
}

// todo 格式化css字符串
export function formatCssStr(cssStr) {

  return cssStr
}

// 格式化css字符串
export function convertToCss(str) {

  if (typeof str !== "string")
    throw Error("convertToCss Error")

  if (str.trim().startsWith("{"))
    return convertToCss(str.substring(1));

  if (str.trim().endsWith("}"))
    return convertToCss(str.substring(0, str.length - 1));

  // 格式化字符串
  const lines = str.split("\n")
  for (let i = lines.length - 1; i >= 0; i--)
    if (lines[i].trim().length === 0)
      lines.splice(i, 1)

  const cssLines = []
  lines.forEach(line => {
    if (line === null)
      return
    line = line.trim()
    if (line.length === 0 || line === "{" || line === "}")
      return

    if (line.startsWith("{")) {
      alert(1)
      cssLines.push("{")
      line = line.substring(1)
      if (!line.endsWith(";"))
        line += ";"
      cssLines.push(line)
    } else if (line.endsWith("}")) {
      line = line.substring(0, line.length - 1)
      if (!line.endsWith(";"))
        line += ";"
      cssLines.push(line)
      cssLines.push("}")
    } else {
      if (!line.endsWith(";"))
        line += ";"
      cssLines.push(line)
    }
  })
  return compressCssStrWhitespace(`{${cssLines.join('')}}`);
}

// todo 解析css逻辑表达式
export function parseCssExpressions(cssStr, evalCssExpression, keyValuePairs) {

  if (typeof evalCssExpression !== 'function')
    throw Error('parseCssExpressions|evalCssExpression必须是一个方法')
  cssStr = cssStr.trim()
  if (cssStr.startsWith("{") && cssStr.endsWith("}"))
    cssStr = cssStr.substring(1, cssStr.length - 1)

  const cssLines = cssStr.split(';')
  const ifPattern = /(?<=\s*)(if.+)(?=(\s([@$a-zA-Z0-9]+)\s*:))/gi // 提取表达式
  const validCssLine = []

  cssLines.forEach(line => {

    if (line == null || line === "")
      return
    // 匹配表达式部分
    const expression = line.match(ifPattern)
    // 不是表达式
    if (!Array.isArray(expression) || expression.length == 0) {
      // 检查格式是否正确
      if (line.split(':')[0].split(/\s+/).filter(s => s !== '').length > 1)
        throw Error(`css代码错误: ${line}`)
      // 设置css变量
      if (keyValuePairs)
        line = setStyleValue(line, keyValuePairs)
      validCssLine.push(line.trim() + ";")
      return
    }
    // 计算表达式 true
    if (evalCssExpression && evalCssExpression(expression[0])) {
      let cssLine = line.split(expression[0])[1].trim() + ";"
      if (keyValuePairs)
        cssLine = setStyleValue(cssLine, keyValuePairs)
      // 提取css行
      validCssLine.push(cssLine)
    }
  });

  return `${getStyleSelectorStr(cssStr)}{${validCssLine.join('')}}`;
}

// 获取css字符串,不包含选择器,包含首尾花括号{}
export function getCssStr(cssStr) {

  if (typeof cssStr !== 'string') {
    throw Error(`getCssStr|只能是字符串`)
  }

  const stylePattern = /{([\s\S]+)}/gi
  const matchCssStr = cssStr.match(stylePattern)

  if (matchCssStr == null || matchCssStr.length == 0)
    throw Error(`getCssStr|无法匹配样式[${cssStr}]`)

  if (!matchCssStr[0].startsWith("{") || !matchCssStr[0].endsWith("}"))
    throw Error(`getCssStr|css解析错误[${matchCssStr}]`)

  return matchCssStr[0]
}


// 获取css字符串,不包含选择器和首尾花括号{}
export function getCssStr2(cssStr) {

  if (typeof cssStr !== 'string')
    throw Error("getCssStr2|cssStr只能是字符串类型")

  cssStr = cssStr.trim()
  let css = ''
  if (cssStr.startsWith('{') && cssStr.endsWith('}')) {
    css = cssStr.substring(1, cssStr.length - 1)
  } else {
    const cssPattern = /(?<={)(\s*\S*)*(?=})/gi
    css = cssStr.match(cssPattern)
    if (Array.isArray(css) && css.length > 0) {
      css = css[0]
    } else {
      css = cssStr
    }
  }
  css = css.trim()
  if (css.startsWith('{') || css.endsWith('}'))
    throw Error(`getCssStr2|css解析错误: ${cssStr}`)

  return css
}

// 添加选择器到样式
export function addSelectorToStyle(id, selector) {

  let selectorArr = null

  if (typeof selector === 'string')
    selectorArr = [selector]
  else if (Array.isArray(selector) && selector.length > 1)
    selectorArr = selector
  else
    throw Error(`addSelectorToStyle|选择器不正确[${selector}]`)

  const style = document.getElementById(id)
  if (style === null)
    throw Error(`addSelectorToStyle|找不到指定id的样式[${id}]`)

  const selectorList = getStyleSelectorListById(id)
  if (selectorList.indexOf(selector) !== -1)
    throw Error(`addSelectorToStyle|选择器已存在${selector}`)

  let newSelector = ""
  for (let i = 0; i < selectorList.length; i++) {
    const name = selectorList[i]
    if (newSelector === '')
      newSelector += name
    else
      newSelector += "," + name
  }

  for (let i = 0; i < selectorArr.length; i++) {
    const name = selectorArr[i].trim()
    if (!name.startsWith('#') && !name.startsWith('.'))
      throw Error(`addSelectorToStyle|选择器格式不正确[${selector}]`)

    if (newSelector === '')
      newSelector += name
    else
      newSelector += "," + name
  }

  const cssStr = getCssStrById(id)
  style.innerText = newSelector + cssStr
}

// 添加样式
export function addStyleToHead(id, cssString, canvasName) {

  if (document.getElementById(id) !== null)
    throw Error(`addStyleToHead|指定id的样式已存在[${id}]`)

  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("canvas-name", canvasName);
  style.setAttribute("id", id);

  if (style.styleSheet) { // IE
    style.styleSheet.cssText = cssString;
  } else { // w3c
    const cssText = document.createTextNode(cssString);
    style.appendChild(cssText);
  }

  const heads = document.getElementsByTagName("head");
  if (heads.length) {
    heads[0].appendChild(style);
  } else {
    document.documentElement.appendChild(style);
  }
}

// 删除所有非当前canvasName的style标签
export function removeAllStyleNotOfCanvasName(canvasName) {

  const allStyleList = document.getElementsByTagName("style")
  for (const style of allStyleList) {
    const styleId = style.getAttribute("id")
    if (styleId && styleId.startsWith("e-bi-")) {
      const styleCanvasName = style.getAttribute("canvas-name")
      if (styleCanvasName && styleCanvasName !== canvasName)
        removeStyleById(styleId)
    }
  }
}

export function generateStyleId(styleId, componentId) {
  if (styleId.indexOf("{id}") !== -1 && componentId !== undefined) {
    return "e-bi-" + strToBase64(styleId.replace("{id}", componentId)).toLowerCase();
  } else if (styleId.indexOf("{id}") === -1 && componentId === undefined) {
    return "e-bi-" + strToBase64(styleId).toLowerCase();
  } else {
    throw new Error(`generateStyleId|参数错误: styleId: ${styleId}, componentId: ${componentId}`)
  }
}


// 画布(组件的容器)的背景
export function getCanvasStyle(canvasData) {

  // todo 临时解决背景设置
  let background = "transparent"
  if (canvasData.background != null && canvasData.background.startsWith("http")) {
    // background:bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;
    background = `#ffffff url('${canvasData.background}') center/100% no-repeat`
  } else if (canvasData.background != null) {
    background = canvasData.background
  }

  return {
    width:
      changeStyleWithScale(canvasData.width) +
      getUnit("width", canvasData.unit),
    height:
      changeStyleWithScale(canvasData.height) +
      getUnit("height", canvasData.unit),
    background: background
  };

}

export function addStyleListToHead(component, canvasName) {

  if (!component.styleList) {
    console.warn("addStyleListToHead|组件样式不存在");
    return
  }

  if (!canvasName) {
    console.warn("addStyleListToHead|画布名称未指定不存在");
    return
  }
  removeAllStyleNotOfCanvasName(canvasName)

  // todo: 计算表达式
  function evalCssExpression(expression) {
    return eval(expression.replace(/if/gi, ""));
  }

  const styleList = component.styleList.filter(s => s.type === "css")

  styleList.forEach((style) => {

    if (!style) {
      console.warn("addStyleListToHead|style未赋值");
      return
    }
    if (!style.css) {
      console.warn("addStyleListToHead|style.css未赋值");
      return
    }
    if (!style.cssData) {
      console.warn("addStyleListToHead|style.cssData未赋值");
      return
    }

    // 样式会添加到页面的head标签内
    const css = parseCssExpressions(style.css, evalCssExpression, style.cssData);
    const id = generateStyleId(style.styleId, component.id);

    let selector = ""
    if (style.selector.includes(",")) {
      const selectorArr = style.selector.split(",")
      selectorArr.forEach(str => {
        if (str.trim() !== "")
          selector += "#component" + component.id + " " + str + ","
      })
      selector = selector.substring(0, selector.length - 1)
    } else {
      selector = "#component" + component.id + " " + style.selector.trim()
    }

    if (isStyleExist(id)) {
      // 获取样式的选择器
      // let selectorStr = getStyleSelectorStrById(id);
      // if (!selectorStr.includes(selector))
      //   !selectorStr.trim().endsWith(",")
      //     ? (selectorStr = selectorStr + "," + selector)
      //     : (selectorStr = selectorStr + selector);
      console.log("更新样式...", selector);
      updateStyle(id, selector + css); // 更新样式和选择器
    } else {
      console.log("添加样式...", selector);
      addStyleToHead(id, selector + css, canvasName);
    }
  });

}


// 移除样式
export function removeStyleById(id) {
  const style = document.getElementById(id)
  if (style === null) {
    console.warn(`removeStyleById|找不到指定id的样式[${id}]`);
    return false
  }
  style.remove()
  return true
}

// 样式是否存在
export function isStyleExist(id) {
  if (!id)
    return false
  const style = document.getElementById(id)
  if (style === null)
    return false
  else
    return true
}











