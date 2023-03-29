
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
function getScrollbarWidth() {

  const scrollDiv = document.createElement("div");
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

// 是否有滚动条
function hasScrolled(element, direction = 'vertical') {
  if (direction === 'vertical') {
    return element.scrollHeight > element.clientHeight;
  } else if (direction === 'horizontal') {
    return element.scrollWidth > element.clientWidth;
  }
}
