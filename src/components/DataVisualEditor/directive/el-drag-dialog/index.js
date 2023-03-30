import drag from './drag'
import Vue from 'vue'

const install = function(Vue) {
  Vue.directive('el-drag-dialog', drag)
}

if (Vue) {
  window['el-drag-dialog'] = drag
  Vue.use(install);
}

drag.install = install
export default drag

