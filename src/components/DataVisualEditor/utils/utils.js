import Vue from 'vue'
import axios from 'axios'

export function deepCopy(target) {

  if (typeof target == 'object') {
    const result = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (typeof target[key] == 'object') {
        result[key] = deepCopy(target[key])
      } else {
        result[key] = target[key]
      }
    }
    return result
  }
  return target
}

export function swap(arr, i, j) {
  const temp = arr[i]
  Vue.set(arr, i, arr[j])
  Vue.set(arr, j, temp)
}

export function $(selector) {
  return document.querySelector(selector)
}

const randStrList = []

const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';

/**
 * 随机生成索引
 * @param min 最小值
 * @param max 最大值
 * @param i 当前获取位置
 */
function RandomIndex(min, max, i) {
  let index = parseInt(Math.random() * (max - min + 1) + min);
  let numStart = _charStr.length - 10;
  //如果字符串第一位是数字，则递归重新获取
  if (i == 0 && index >= numStart) {
    index = RandomIndex(min, max, i);
  }
  //返回最终索引值
  return index;
}

//字符串转base64
export function strToBase64(str) {
  // 对字符串进行编码
  let encode = encodeURI(str);
  // 对编码的字符串转化base64
  let base64 = btoa(encode);
  return base64;
}

// base64转字符串
export function Base64ToStr(base64) {
  // 对base64转编码
  let decode = atob(base64);
  // 编码转字符串
  let str = decodeURI(decode);
  return str;
}


/**
 * 随机生成字符串
 * @param len 指定生成字符串长度
 */
export function getRandStr(len = 15, type = "str") {

  const min = 0;
  const max = _charStr.length - 1
  let _str = '';

  if (type === 'str') {
    //循环生成字符串
    for (let i = 0, index; i < len; i++) {
      index = RandomIndex(min, max, i);
      _str += _charStr[index];
    }
  } else if (type === 'timestamp') {
    _str = strToBase64(new Date().toJSON())
  } else {
    throw Error("不支持的type")
  }

  if (randStrList.indexOf(_str) !== -1)
    return getRandStr(len, type)

  randStrList.push(_str)
  return _str;
}

export function selectFile(options = { multiple: false, accept: "*/*" }, isDirectory = false) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = options.accept;
    el.webkitdirectory = isDirectory;
    el.multiple = options.multiple;
    el.addEventListener("change", (result) => {
      try {
        if (el.files === null) {
          reject(Error("读取文件失败!"));
        } else {
          resolve(el.files);
        }
      } catch (error) {
        reject(error)
      }
    });
    el.click();
  });
}

export function saveText(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.click();
}


// 获取每毫米的像素值
export function getOneMmsPx() {
  // 创建一个1mm宽的元素插入到页面，然后坐等出结果
  let div = document.createElement("div");
  div.id = "mm";
  div.style.width = "1mm";
  document.querySelector("body").appendChild(div);
  // 原生方法获取浏览器对元素的计算值
  let mm1 = document.getElementById("mm").getBoundingClientRect();
  div.remove();
  return mm1.width;
}

// 除法函数
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果

export function accDiv(arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1
  let r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }   //--小数点后的长度
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }  //--小数点后的长度
  r1 = Number(arg1.toString().replace(".", ""))  //--去除小数点变整数
  r2 = Number(arg2.toString().replace(".", ""))  //--去除小数点变整数
  return (r1 / r2) * Math.pow(10, t2 - t1);   //---整数相除 在乘上10的平方  小数点的长度
}



// 乘法函数
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
export function accMul(arg1, arg2) {
  let m = 0;
  let s1 = arg1.toString();
  let s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}



// 加法函数
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
export function accAdd(arg1, arg2) {
  let r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

// 减法函数
export function accSub(arg1, arg2) {
  let r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

export function closeWindow() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
    window.location.href = "about:blank";
    window.close();
  } else {
    window.opener = null;
    window.open("", "_self");
    window.close();
  }
}

export function warn(params) {

  console.log((new Error()).stack.split("\n")[2].trim().split(" ")[1])

}




export function isArrayInclude(arr, val) {

  if (typeof val === 'string') {
    return arr.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) > -1).length === 0
  } else {
    throw new Error("类型错误" + (typeof val))
  }

}

// 去除空格,换行
export function removeWhitespace(str) {
  return str.replace(/\t|\n|\v|\r|\f/g,'').replace(/\s+/g,'')
}

