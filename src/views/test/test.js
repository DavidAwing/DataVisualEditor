
document.onmousedown = function (event) {

  console.log("找到目标元素11");
  var elements = document.getElementsByTagName("*");
  console.log("找到目标元素1133");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    console.log("找到目标元素222:", element.outerHTML);
    if (element.textContent === "安装线上内核") {
    }
  }

}

