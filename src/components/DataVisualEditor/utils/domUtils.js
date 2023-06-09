import html2canvas from 'html2canvas';

// 获取滚动条宽度
export const getScrollBarWidth = () => {

  const outer = document.createElement('div');
  outer.style.overflow = 'scroll';
  outer.style.height = '200px';
  outer.style.width = '100px';
  document.body.appendChild(outer);
  const widthNoScroll = outer.offsetWidth;
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  const widthWithScroll = inner.offsetWidth;
  const scrollBarWidth = widthNoScroll - widthWithScroll;
  return scrollBarWidth;
}

// 计算滚动条宽度的方法：新建一个带有滚动条的DIV元素，再计算该元素offsetWidth和clientWidth的差值。
function getScrollbarWidth2() {

  const scrollDiv = document.createElement("div");
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}



// 获取元素中心点
export function getElementCenter(element) {
  const elementContainerRect = element.parentNode.getBoundingClientRect();
  const canvasRect = element.parentNode.parentNode.getBoundingClientRect();

  const centerX =
    elementContainerRect.left -
    canvasRect.left +
    elementContainerRect.width / 2;
  const centerY =
    elementContainerRect.top -
    canvasRect.top +
    elementContainerRect.height / 2;

  return {
    x: centerX,
    y: centerY,
  };
}


export function getElementRect(element) {

  const elementContainerRect = element.parentNode.getBoundingClientRect();
  const canvasRect = element.parentNode.parentNode.getBoundingClientRect();

  const centerX =
    elementContainerRect.left -
    canvasRect.left +
    elementContainerRect.width / 2;
  const centerY =
    elementContainerRect.top -
    canvasRect.top +
    elementContainerRect.height / 2;

  const width = elementContainerRect.width

  const height = elementContainerRect.height
  const top = elementContainerRect.top - canvasRect.top
  const left = elementContainerRect.left - canvasRect.left

  return {
    cx: centerX,
    cy: centerY,
    width: width,
    height: height,
    top: top,
    left: left,
  };
}

export function getGroupChildElementRect(element) {

  const elementContainerRect = element.getBoundingClientRect();
  const canvasRect = document.getElementById("editor").getBoundingClientRect();

  const centerX =
    elementContainerRect.left -
    canvasRect.left +
    elementContainerRect.width / 2;
  const centerY =
    elementContainerRect.top -
    canvasRect.top +
    elementContainerRect.height / 2;

  const width = elementContainerRect.width

  const height = elementContainerRect.height
  const top = elementContainerRect.top - canvasRect.top
  const left = elementContainerRect.left - canvasRect.left

  return {
    cx: centerX,
    cy: centerY,
    width: width,
    height: height,
    top: top,
    left: left,
  };
}


export function toImage(ele) {

  return new Promise((resolve, reject) => {
    html2canvas(ele, {
      dpi: 96,     //分辨率
      scale: 1,    //设置缩放
      useCORS: true,  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。,
      //backgroundColor:'#ffffff',这样背景还是黑的
      bgcolor: '#ffffff',//应该这样写
      logging: false   //打印日志用的 可以不加默认为false
    }).then((canvas) => {
      let base64Str = canvas.toDataURL('image/png');
      resolve(base64Str)
    }).catch(error => reject(error))
  })
}

