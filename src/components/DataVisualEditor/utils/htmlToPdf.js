import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

/**
 * @param  ele          要生成 pdf 的DOM元素（容器）
 * @param  padfName     PDF文件生成后的文件名字
 * */
function downloadPDF(ele, pdfName) {

  let eleW = ele.offsetWidth;// 获得该容器的宽
  let eleH = ele.offsetHeight;// 获得该容器的高

  let eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
  let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
  var canvas = document.createElement("canvas");
  var abs = 0;
  let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
  let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

  if (win_out > win_in) {
    abs = (win_out - win_in) / 2;    // 获得滚动条宽度的一半
  }
  canvas.width = eleW * 2;    // 将画布宽&&高放大两倍
  canvas.height = eleH * 2;

  var context = canvas.getContext("2d");
  context.scale(2, 2);
  context.translate(-eleOffsetLeft - abs, -eleOffsetTop);

  html2canvas(ele, {
    dpi: 96,     //分辨率
    scale: 2,    //设置缩放
    useCORS: true,  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。,
    //backgroundColor:'#ffffff',这样背景还是黑的
    bgcolor: '#ffffff',//应该这样写
    logging: false   //打印日志用的 可以不加默认为false
  }).then((canvas) => {
    // el.setAttribute("crossOrigin",'anonymous');
    var contentWidth = canvas.width;
    var contentHeight = canvas.height;
    //一页pdf显示html页面生成的canvas高度;
    var pageHeight = contentWidth / 592.28 * 841.89;
    //未生成pdf的html页面高度
    var leftHeight = contentHeight;
    //页面偏移
    var position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    var imgWidth = 595.28;
    var imgHeight = 595.28 / contentWidth * contentHeight;
    let pageData = canvas.toDataURL('image/jpeg', 1.0);
    var pdf = new JsPDF('', 'pt', 'a4');

    if (leftHeight < pageHeight) {
      //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {    // 分页
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        //避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    //可动态生成
    pdf.save(pdfName);
  })
}

/**
 * @param  ele          要生成 pdf 的DOM元素（容器）
 * @param  padfName     PDF文件生成后的文件名字
 * */
// 按原样打印在一页
function downloadPDF2(ele, pdfName) {

  // let el = document.getElementById(ele)  //通过getElementById获取要导出的内容
  let eleW = ele.offsetWidth;// 获得该容器的宽
  let eleH = ele.offsetHeight;// 获得该容器的高

  let eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
  let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
  var canvas = document.createElement("canvas");
  var abs = 0;
  let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
  let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

  if (win_out > win_in) {
    abs = (win_out - win_in) / 2;    // 获得滚动条宽度的一半
  }
  canvas.width = eleW * 2;    // 将画布宽&&高放大两倍
  canvas.height = eleH * 2;

  let context = canvas.getContext("2d");
  context.scale(2, 2);
  context.translate(-eleOffsetLeft - abs, -eleOffsetTop);

  html2canvas(ele, {
    dpi: 96,     //分辨率
    scale: 6,    //设置缩放
    useCORS: true,  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。,
    // backgroundColor:'#ffffff', //这样背景还是黑的
    bgcolor: '#ffffff',//应该这样写
    logging: false   //打印日志用的 可以不加默认为false
  }).then((canvas) => {

    let paperWidth = ele.children[0].getBoundingClientRect().width;
    let paperHeight = ele.children[0].getBoundingClientRect().height;

    let orientation = 'portrait'
    if (canvas.width > canvas.height) {
      orientation = 'landscape'
    }

    ele.setAttribute("crossOrigin", 'anonymous');
    let pageData = canvas.toDataURL('image/jpeg', 1.0);
    let pdf = new JsPDF(orientation, 'px', [paperWidth, paperHeight]);
    pdf.addImage(pageData, 'JPEG', 0, 0, paperWidth, paperHeight);

    //可动态生成
    pdf.save(pdfName);
  })
}

// 每个子元素一页
function downloadPDF3(ele, pdfName,unit, addPage, completeCallback) {

  let childPageWidth = ele.children[0].getBoundingClientRect().width;
  let childPageHeight = ele.children[0].getBoundingClientRect().height;
  let childPageCount = ele.children.length;

  let orientation = getOrientation(childPageWidth, childPageHeight)
  let pdf = new JsPDF(orientation, unit, [childPageWidth, childPageHeight]);
  pdf.deletePage(1)

  for (let i = 0; i < childPageCount; i++) {
    getPageData(ele.children[i], function (pageData) {

      pdf.addPage();
      pdf.addImage(pageData, 'JPEG', 0, 0, childPageWidth, childPageHeight);
      if (typeof addPage == 'function') addPage(i + 1);

      if (i == childPageCount - 1) {
        if (completeCallback)
          completeCallback();
        return pdf.save(pdfName);
      }
    })
  }

}

function getOrientation(width, height) {
  let orientation = 'portrait'
  if (width > height) {
    orientation = 'landscape'
  }
  return orientation
}

function getPageData(el, callback) {

  html2canvas(el, {
    dpi: 96,     //分辨率
    scale: 1,    //设置缩放
    useCORS: true,  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。,
    // backgroundColor:'#ffffff', //这样背景还是黑的
    bgcolor: '#ffffff',//应该这样写
    logging: false   //打印日志用的 可以不加默认为false
  }).then((canvas) => {

    let orientation = 'portrait'
    if (canvas.width > canvas.height) {
      orientation = 'landscape'
    }
    el.setAttribute("crossOrigin", 'anonymous');
    let pageData = canvas.toDataURL('image/jpeg', 1.0);

    callback(pageData)
  })
}

export default {
  downloadPDF, downloadPDF2, downloadPDF3
}
