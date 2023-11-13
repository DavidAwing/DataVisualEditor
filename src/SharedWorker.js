/* global $ */
import store from '@/store';
import eventBus from './components/DataVisualEditor/utils/eventBus';
const JSONfn = require('jsonfn').JSONfn;

const bi = window.bi

export default {
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

      if (!url) {
        return false
      }

      url = decodeURI(url)
      if (!obj.urls) {
        return false
      }

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
    }
  }
}



