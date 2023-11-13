/* global $ */

import {
  stringToFunction,
  CompileSourcecode,
  CompileToModule,
  CompileTypescriptToIIFE,
} from './components/DataVisualEditor/utils/compiler.ts';
import {
  getValueByAttributePath,
  setJsonAttribute,
  SetValueAndAttributePathFromKey,
} from './components/DataVisualEditor/utils/chartUtils';
import { printByTemplate, compileVueTemplate } from './components/DataVisualEditor/utils/print';
import { deepCopy } from './components/DataVisualEditor/utils/utils';
import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import store from '@/store';
import * as ElementUI from 'element-ui';
import * as xlsx from 'xlsx-js-style';
import eventBus from './components/DataVisualEditor/utils/eventBus';
import SharedWorkerScript from './components/DataVisualEditor/utils/shared-worker.worker.js'
import * as echarts from "echarts";
import draggable from '@shopify/draggable'

import { loadModule } from './components/DataVisualEditor/utils/webpackUtils';

import * as tesseract from 'tesseract.js'
import * as tf from '@tensorflow/tfjs';
// import * as ml5 from 'ml5';
import * as Vue3 from '@/vue3/vue@3.3.4.esm-browser.js'
import * as CompilerSFC from '@/vue3/compiler-sfc'
import * as repl from '@/vue3/repl'
import Scene from "scenejs";
import * as BABYLON from 'babylonjs';
import * as THREE from 'three';

import * as _ from 'lodash'
// import Monaco from '@/vue3/repl/dist/monaco-editor.js'

// const repl = require('@vue/repl')
// const  Monaco = require('@vue/repl/monaco-editor')
// import { Repl } from '@vue/repl'

const VueTemplateCompiler = require('vue-template-compiler');


// import * as ts from './compiler/typescript@5.0.4.js';
const JSONfn = require('jsonfn').JSONfn;
const schedule = require('node-schedule');
const { Engine } = require('json-rules-engine')

const FFmpeg = require('@ffmpeg/ffmpeg');
const FFmpegUtil = require('@ffmpeg/util');


const bi = { uid: "" }
bi.utils = {}
window.f = bi.utils
window.bi = bi


bi.uid = 'admin'

bi.addProperty = (...params) => {

  if (Array.isArray(params) && params.length === 2 && typeof params[0] === 'string') {
    bi[params[0]] = params[1]
  } else if (Array.isArray(params) && params.length === 1 && Array.isArray(params[0]) && Array.isArray(params[0][0])) {
    params[0].forEach(param => {
      bi.addProperty(...param)
    })
  }

}

const loadAll = async () => {

  bi.version = 'z0.2.1'
  bi.Vue = Vue;
  bi.axios = axios;
  bi.moment = moment;
  bi.BigNumber = BigNumber;
  bi.JSONfn = JSONfn;

  bi.Scene = Scene
  bi.BABYLON = BABYLON
  bi.THREE = THREE
  bi.store = store;

  bi.schedule = schedule;
  bi.ElementUI = ElementUI;
  bi.xlsx = xlsx;
  bi.$ = $;
  bi.VueTemplateCompiler = VueTemplateCompiler;

  bi.eventBus = eventBus;
  bi.FFmpeg = FFmpeg
  bi.FFmpegUtil = FFmpegUtil
  bi.cv = window.cv
  bi.tf = tf
  bi.tesseract = tesseract
  bi.Vue3 = Vue3
  bi.repl = repl
  // bi.Monaco = Monaco
  bi.CompilerSFC = CompilerSFC
  bi.echarts = echarts

  bi._ = _

  bi.debug = (msg) => {
    if (window.BI_DEBUG) {
      console.log(msg);
    }
  }

  bi.sharedWorker = {
    worker: null,
    start: (SharedWorkerConstructor, options) => {
      let worker = null
      if (typeof SharedWorkerConstructor === 'string' && SharedWorkerConstructor.endsWith('.worker.js')) {
        worker = new SharedWorker(SharedWorkerConstructor, options)
      } else {
        if (!SharedWorkerConstructor) {
          throw new Error('当前浏览器不支持SharedWorker')
        }
        worker = new SharedWorkerConstructor()
      }
      worker.port.start()
      worker.port.onmessage = (e) => {
        const { onmessage } = bi.sharedWorker
        if (!onmessage) {
          console.warn(`sharedWorker消息处理函数未定义,消息事件: ${e}`);
        } else {
          onmessage(e)
        }
      }
      bi.sharedWorker.worker = worker
      return worker
    },
    postMessage: (msg) => {
      if (bi.worker) {
        throw Error('SharedWorker未定义')
      }
      bi.sharedWorker.worker.port.postMessage(msg)
    },
    onmessage: (event) => {
      console.log('SharedWorker|onmessage', event);

      const isUrl = (obj) => {
        let url = location.hash.includes('#') ? location.hash.split('#')[1] : location.hash.match(/\/\w+(?=\?{0,1})/)
        url = Array.isArray(url) ? url[0] : url

        if (!url)
          return false
        url = decodeURI(url)
        if (!obj.urls)
          return false
        for (const item of obj.urls) {
          if (typeof item == 'string' && item == url) {
            return true
          } else if (typeof item == 'object' && item.url == url && bi.store.state.canvasName == item.canvasName) {
            return true
          }
        }
        return false
      }

      const refresh = (obj) => {
        location.reload()
      }

      const setState = (obj) => {
        obj.data.forEach(item => {
          let key = item.key
          if (!key.startsWith('set')) {
            key = 'set' + key[0].toUpperCase() + key.substring(1);
          }
          store.commit(key, item.value);
        })
      }

      const emit = (obj) => {
        eventBus.$emit(obj.name, obj.data);
      }

      const setFormConf = (obj) => {
        eventBus.$emit('setFormConf', obj.name, obj.data);
      }

      if (!event.data.startsWith('{') && !event.data.endsWith('}')) {
        console.warn('SharedWorker|onmessage', '共享消息只能接收json字符串', event.data);
        return
      }

      const msgObj = JSONfn.parse(event.data)
      if (!isUrl(msgObj)) {
        return
      }
      switch (msgObj.action) {
        case 'refresh': return refresh(msgObj)
        case 'setState': return setState(msgObj)
        case 'emitEvent': return emit(msgObj)
        case 'setFormConf': return setFormConf(msgObj)
      }
    }
  }
  bi.sharedWorker.start(SharedWorkerScript)

  bi.utils.getValueByAttributePath = getValueByAttributePath;
  bi.utils.setJsonAttribute = setJsonAttribute;
  bi.utils.SetValueAndAttributePathFromKey = SetValueAndAttributePathFromKey;

  bi.utils.printByTemplate = printByTemplate;
  bi.utils.compileVueTemplate = compileVueTemplate;
  bi.utils.CompileTypescriptToIIFE = CompileTypescriptToIIFE
  bi.utils.CompileToModule = CompileToModule
  bi.utils.setComponentShow = (name, isShow) => {

    const data = bi.utils.getComponentData(name).data
    if (isShow === undefined) {
      data.show = !data.show
    } else {
      data.show = isShow
    }
  }

  bi.utils.getURLParam = () => {
    const { href } = location
    return new URLSearchParams(href.substring(href.indexOf('?'))).get('c')
  }

  bi.utils.deepCopy = deepCopy
  bi.utils.deepMerge = function (target, source) {

    function _(target, source) {
      if (!target && !source) {
        throw new Error('deepMerge的参数未定义')
      }
      if (!source) {
        return target
      }
      if (!target) {
        return source
      }
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) {
              target[key] = {};
            }
            _(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
      return target;
    }

    return _(target, source)
  }
  bi.utils.getComponentData = (name) => {
    return bi.store.state.canvasComponentData.find(item => item.data.name === name)
  }

  bi.utils.makeDraggable = function makeDraggable(e, callback) {

    if (e instanceof HTMLElement) {
      e.onmousedown = event =>
        makeDraggable(event, callback)
      return
    }

    const dragDom = e.target

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => {
          let val = null
          if (['bottom', 'height', 'left', 'right', 'top', 'width'].includes(attr)) {
            val = dom.getBoundingClientRect()[attr] + 'px'
          } else {
            val = getComputedStyle(dom, false)[attr]
          }

          if (val === 'auto') {
            throw Error('获取元素样式无效')
          }
          return val
        }
      }
    })()

    const prevLeft = getStyle(dragDom, 'left')
    const prevTop = getStyle(dragDom, 'top')
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const element = mutation.target;
          const computedStyle = getComputedStyle(element);
          const isHidden = computedStyle.display === 'none';
          if (isHidden) {
            observer.disconnect()
            observer = null
          }
        }
      }
    });
    observer.observe(dragDom, { attributes: true });

    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX
    const disY = e.clientY

    const dragDomWidth = dragDom.offsetWidth
    const dragDomheight = dragDom.offsetHeight

    const screenWidth = document.body.clientWidth
    const screenHeight = document.body.clientHeight

    // const minDragDomLeft = dragDom.offsetLeft + 360
    // const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth + 360
    // const minDragDomTop = dragDom.offsetTop
    // const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight + 300

    // 获取到的值带px 正则匹配替换
    let styL = getStyle(dragDom, 'left')
    let styT = getStyle(dragDom, 'top')

    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
      styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
    } else {
      styL = +styL.replace(/\px/g, '')
      styT = +styT.replace(/\px/g, '')
    }

    if (typeof callback == 'function') {
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        callback(left + styL, top + styT)
      }
    } else {
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 边界处理
        // if (-(left) > minDragDomLeft) {
        //   left = -minDragDomLeft
        // } else if (left > maxDragDomLeft) {
        //   left = maxDragDomLeft
        // }
        // if (-(top) > minDragDomTop) {
        //   top = -minDragDomTop
        // } else if (top > maxDragDomTop) {
        //   top = maxDragDomTop
        // }
        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }
    }

    document.onmouseup = function () {
      document.onmousemove = null
      dragDom.onmousedown = null
      dragDom.onmousemove = null
      document.onmouseup = null
    }
  }


  bi.utils.openWindow = (url, windowName) => {

    if (windowName == null)
      windowName = url
    const existingWindow = window.open('', windowName);
    if (existingWindow) {
      existingWindow.location.href = url;
    } else {
      window.open(url, windowName);
    }
    return existingWindow
  }
};

loadAll()

// window.addEventListener('message', function (event) {
//   console.log('Received message:', event.data);
// });

// function loadScript(url, callback) {
//   const script = document.createElement('script');
//   script.src = url;
//   script.type = 'text/javascript';
//   script.onload = callback;
//   document.head.appendChild(script);
// }


// loadScript(`http://localhost:5053/File/Get?name=Script/node_modules/vue-infinite-scroll-0.2.3/src/directive.js`, (data) => {
//   console.log('测试模块加载', data);
// })


export default bi



