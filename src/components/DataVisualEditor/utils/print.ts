import Vue from 'vue';
import axios from 'axios';
import { CompileToModule } from './compiler';
const equal = require('fast-deep-equal')




// 打印模板
// 1. 设计模板(html实时预览) => 2. 后台读取模板字符串(body(多个div)或body里面的第一个div) => 3. 替换插值元素为插值字符串 => 3. vue生成打印页面

// table 的表格转 直线
// table的td的文字,转txt,读取绝对坐标值

// 模板字符串处理

// [[变量名]]  1. 编辑模板时替换成 input,让用户手动修改数据,去掉两边的方括号,
// 2. 打印预览时去掉两边的方括号,


// {{变量名}} 1.  编辑模板时替换成 input,让用户手动修改数据,保留两边的花括号,

interface HtmlNode {
  element: HTMLElement;
  children: HtmlNode[] | null;
  type: string
}

// html转tree
export function htmlToTree(ele: HTMLElement) {
  const htmlNode: HtmlNode = {
    element: ele,
    children: null,
    type: ele.tagName
  }
  if (ele.children && ele.children.length > 0) {
    htmlNode.children = []
    for (const iterator of ele.children) {
      htmlNode.children.push(htmlToTree(iterator as any))
    }
  }
  return htmlNode
}

// 遍历tree节点
export function traverseDomTree(node: HTMLElement, callback: (node: HTMLElement) => void) {
  callback(node)
  if (node.children && node.children.length > 0) {
    for (const iterator of node.children)
      traverseDomTree(iterator as HTMLElement, callback)
  }
}

// 遍历tree节点
export function traverseHtmlTree(htmlTree: HtmlNode, callback: (node: HtmlNode) => void) {
  callback(htmlTree)
  if (htmlTree.children) {
    htmlTree.children.forEach(node => {
      traverseHtmlTree(node, callback)
    })
  }
}

export function toHtml(htmlText: string) {
  // 创建 DOMParser 实例
  const parser = new DOMParser();
  // 解析字符串为 DOM 文档
  const doc = parser.parseFromString(htmlText, 'text/html');
  return doc
}

export function compileVueTemplate(templateString: string, templateData: object, id: string, container: any, mounted: any = null) {

  let vueTemplate = {
    template: templateString,
    data: function () {
      return templateData;
    },
    mounted: mounted
  };

  if (!id.startsWith('#')) id = '#' + id;
  if (document.getElementById(id.substring(1)) === null) {
    const div = document.createElement('div');
    div.setAttribute('id', id.substring(1));
    container.appendChild(div);
  }

  const componentConstructor = Vue.extend(vueTemplate);
  const intance = new componentConstructor({ el: id });
  return intance

  // 第二种方式
  // // 创建构造器
  // var Profile = Vue.extend({
  //   template: '<div> {{firstName}} {{lastName}} aka {{alias}}</div>',
  //   data: function () {
  //     return {
  //       firstName: 'Walter',
  //       lastName: 'White',
  //       alias: 'Heisenberg',
  //     };
  //   },
  // });
  // // 创建 Profile 实例，并挂载到一个元素上。
  // new Profile().$mount('#print-page-container');
}

// 获取元素相对于另一个元素的边界
function getRelativeBounding(container: HTMLElement, element: HTMLElement) {
  // 获取包含元素和目标元素的位置信息
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 计算目标元素相对于包含元素的位置
  const relativeLeft = elementRect.left - containerRect.left;
  const relativeTop = elementRect.top - containerRect.top;

  return {
    height: elementRect.height,
    width: elementRect.width,
    left: relativeLeft,
    top: relativeTop,
  };
}


function wrapTextWithSpan(element: Node) {
  const children = element.childNodes;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (child.nodeType === Node.TEXT_NODE) {
      const spanElement = document.createElement("span");
      spanElement.textContent = child.textContent;
      element.replaceChild(spanElement, child);
    }
  }
}

function hasText(node: any) {
  for (const iterator of node.childNodes) {
    if (iterator.nodeType === Node.TEXT_NODE && iterator.nodeValue != false)
      return true
  }
  return false
}

function hasBorder(node: any) {

  const { border, borderTop, borderLeft, borderRight, borderBottom } = getComputedStyle(node, null)
  if ((border.includes('none') || /rgba\(\d+, \d+, \d+, 0\)/g.test(border) || border.includes('0px')) &&
    (borderTop.includes('none') || /rgba\(\d+, \d+, \d+, 0\)/g.test(borderTop) || borderTop.includes('0px')) &&
    (borderLeft.includes('none') || /rgba\(\d+, \d+, \d+, 0\)/g.test(borderLeft) || borderLeft.includes('0px')) &&
    (borderRight.includes('none') || /rgba\(\d+, \d+, \d+, 0\)/g.test(borderRight) || borderRight.includes('0px')) &&
    (borderBottom.includes('none') || /rgba\(\d+, \d+, \d+, 0\)/g.test(borderBottom) || borderBottom.includes('0px'))
  )
    return false
  return true
}

function isPrintable(node: any) {

  const ignoreTagList = ["TR", "TBODY", "THEAD"]
  const textTagList = ["P", "SPAN", "LABEL"]
  if (ignoreTagList.includes(node.tagName))
    return false
  if (textTagList.includes(node.tagName) && !hasText(node))
    return false
  if (hasBorder(node))
    return true
  if (!hasText(node) && node.children.length === 0)
    return false
  if (node.tagName === "DIV" && !hasText(node) && node.children.length === 0)
    return false
  return true
}


function getNodeTextBoundingClientRect(node: any) {
  const spanElement = document.createElement("span");
  spanElement.innerText = node.innerHTML;
  node.innerHTML = "";
  node.appendChild(spanElement);
  const rect = spanElement.getBoundingClientRect()
  node.innerHTML = spanElement.innerText
  spanElement.remove()
  return rect
}

function createSpan(container: any, text: string) {
  const spanElement = document.createElement("span");
  spanElement.innerText = text;
  return spanElement
}

function getNodeBorder(container: any, node: any) {

  const borderList = [] as any
  const { borderTop, borderLeft, borderRight, borderBottom } = getComputedStyle(node, null)

  const rect = getRelativeBounding(container, node)

  function getItem(rect: any, borderStyle: string, attribute: string) {

    const width = borderStyle.match(/(\d+\.*\d*)px/)![0]
    const color = borderStyle.match(/rgba\(.+\)/) ? borderStyle.match(/rgba\(.+\)/)![0] : borderStyle.match(/rgb\(.+\)/)![0]

    if (attribute === 'borderLeft') {
      return {
        type: "line",
        points: [
          { x: rect.left, y: rect.top },
          { x: rect.left, y: rect.top + rect.height }
        ],
        width: width,
        color: color,
        style: borderStyle.replace(width, "").replace(color, "").trim()
      }
    }

    if (attribute === 'borderTop') {
      return {
        type: "line",
        points: [
          { x: rect.left, y: rect.top },
          { x: rect.left + rect.width, y: rect.top }
        ],
        width: width,
        color: color,
        style: borderStyle.replace(width, "").replace(color, "").trim()
      }
    }

    if (attribute === 'borderBottom') {
      return {
        type: "line",
        points: [
          { x: rect.left, y: rect.top + rect.height },
          { x: rect.left + rect.width, y: rect.top + rect.height }
        ],
        width: width,
        color: color,
        style: borderStyle.replace(width, "").replace(color, "").trim()
      }
    }

    if (attribute === 'borderRight') {
      return {
        type: "line",
        points: [
          { x: rect.left + rect.width, y: rect.top },
          { x: rect.left + rect.width, y: rect.top + rect.height }
        ],
        width: width,
        color: color,
        style: borderStyle.replace(width, "").replace(color, "").trim()
      }
    }
  }

  if (borderTop && !borderTop.includes('none') && !/rgba\(\d+, \d+, \d+, 0\)/g.test(borderTop) && !borderTop.includes('0px')) {
    borderList.push(getItem(rect, borderTop, "borderTop"))
  }
  if (borderLeft && !borderLeft.includes('none') && !/rgba\(\d+, \d+, \d+, 0\)/g.test(borderLeft) && !borderLeft.includes('0px')) {
    borderList.push(getItem(rect, borderLeft, "borderLeft"))
  }
  if (borderRight && !borderRight.includes('none') && !/rgba\(\d+, \d+, \d+, 0\)/g.test(borderRight) && !borderRight.includes('0px')) {
    borderList.push(getItem(rect, borderRight, "borderRight"))
  }
  if (borderBottom && !borderBottom.includes('none') && !/rgba\(\d+, \d+, \d+, 0\)/g.test(borderBottom) && !borderBottom.includes('0px')) {
    borderList.push(getItem(rect, borderBottom, "borderBottom"))
  }

  return borderList
}

function getSpanItem(container: any, node: any) {
  const rect = getRelativeBounding(container, node)
  const { fontSize, color, fontFamily, fontWeight } = getComputedStyle(node)
  return {
    type: "text",
    tag: node.tagName,
    attribute: "",
    points: [
      { x: rect.left, y: rect.top }
    ],
    size: fontSize,
    color: color,
    font: fontFamily,
    weight: fontWeight,
    text: node.textContent
  }
}

function getNodeText(container: any, node: any) {
  const list = []
  if (node.tagName !== "SPAN" && hasText(node)) {
    wrapTextWithSpan(node)
    for (const iterator of node.childNodes) {
      if (iterator.tagName === "SPAN") {
        list.push(getSpanItem(container, iterator))
      }
    }
  } else if (node.tagName === "SPAN") {
    list.push(getSpanItem(container, node))
  }
  return list
}


// todo 尺寸单位
export function toPrintObject(container: HTMLElement) {

  const printObject = {
    page: {
      width: ""
    },
    lines: [] as any,
    texts: [] as any,
    images: [] as any
  }


  for (const element of container.children) {
    traverseDomTree(element as any, (node) => {

      if (!isPrintable(node))
        return

      getNodeBorder(container, node).forEach((line: any) => {
        const find = printObject.lines.find((item: any) =>
          item.points[0].x === line.points[0].x &&
          item.points[0].y === line.points[0].y &&
          item.points[1].x === line.points[1].x &&
          item.points[1].y === line.points[1].y &&
          item.width === line.width &&
          item.color === line.color &&
          item.style === line.style
        )
        if (!find) {
          printObject.lines.push(line)
        }
      });

      printObject.texts.push(...getNodeText(container, node))


      // 短线段合并


      switch (node.tagName) {
        case "DIV":

          break;
        case "SPAN":
        case "LABEL":
        case "P":

          break;
        // case "TH":
        case "TD":

          // printObject.list.push({
          //   rect: getNodeTextBoundingClientRect(node)
          // })
          break;

        default:
          break;
      }

    })
  }

  return printObject
}

export async function print(templateString: string, templateData: any, container: any = null) {

  if (container === null) {
    container = document.createElement("DIV")
    document.body.appendChild(container)
  }

  if (typeof templateData === 'string' && templateData.includes('export const templateData')) {
    templateData = await CompileToModule(templateData)
    templateData = templateData.templateData
  } else if (typeof templateData === 'string' && ((templateData.trim().startsWith('[') && templateData.trim().endsWith(']')) || (templateData.trim().startsWith('{') && templateData.trim().endsWith('}')))) {
    templateData = JSON.parse(templateData)
  }

  const printElement = (el: any) => {

    const iframe = document.createElement('IFRAME') as any;
    const attributes = {
      style:
        'position: absolute;top: 1000vh;left:0;width: 100%;height: 100%; display: flex;align-items: flex-start; justify-items: flex-start;',
      height: '100%',
      width: '100%',
      frameborder: 'no',
      border: '0',
      marginwidth: '0',
      marginheight: '0',
      scrolling: 'no',
      allowtransparency: 'yes',
      seamless: 'true',
      allowfullscreen: 'true',
      webkitallowfullscreen: 'true',
      mozallowfullscreen: 'true',
    } as any;

    Object.keys(attributes).forEach(key => {
      iframe.setAttribute(key, attributes[key]);
    });

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
    <style type="text/css">
      @page {
          size: auto; /* 可以设置为 letter、A4 等固定尺寸，或设置为 auto 使用默认尺寸 */
          margin: 0mm; /* 设置页边距，这里设置为 0，可根据需要调整 */
      }
      div.page-break {
        page-break-after: always; /* 在每个 div 之后进行分页 */
      }
    </style>`);

    doc.write(el.outerHTML);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  const html = toHtml(templateString);
  // const templateEle = html.body.children[0];
  const templateEle = html.querySelector('body > div');
  if (templateEle === null) {
    console.warn("找不到模板的div元素");
    (window as any).bi.ElementUI.Message.warning("打印模板格式错误,需要一个div元素")
    return
  }

  if (Array.isArray(templateData)) {
    for (let i = 0; i < templateData.length; i++) {
      const item = templateData[i];
      const id = `#print-page-container-${i}`
      const intance = compileVueTemplate(templateEle.outerHTML, item, id, container);
      intance.$el.setAttribute('id', id.substring(1));
      intance.$el.setAttribute('class', 'page-break');
      (intance.$el as any).style.boxShadow = "";
      (intance.$el as any).style.backgroundColor = "";
    }
  } else if (typeof templateData === 'object') {
    const intance = compileVueTemplate(templateEle.outerHTML, templateData, `#print-page-container-0`, container);
    intance.$el.setAttribute('id', `print-page-container-0`);
    intance.$el.setAttribute('class', 'page-break');
    (intance.$el as any).style.boxShadow = "";
    (intance.$el as any).style.backgroundColor = "";
  }

  printElement(container)
  container.remove()
}

export async function printByTemplate(templateName: string, templateData: any) {
  axios.get(`/BI-API//Print/GetPrintTemplateString?name=${templateName}`, { timeout: 6000 }).then(({ data }) => {
    print(data, templateData)
  })
}

