import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import store from './components/LabelDesigner/store'

import { VuePlugin } from 'vuera'
import axios from 'axios';

import ElementUI, { Dialog } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/components/DataVisualEditor/custom-component' // 注册自定义组件
import '@/components/DataVisualEditor/assets/iconfont/iconfont.css'
import '@/components/DataVisualEditor/styles/animate.less'
import '@/components/DataVisualEditor/styles/reset.css'


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import highlightPlugin from "@highlightjs/vue-plugin";
import bi from '@/bi.js';


(bi as any).globalEvent = {
  beforeCreate: () => { },
  created: () => { },
  mounted: () => { },
  windowOnload: () => { }
}



// require('@/compiler');
// const babel = require.context('./compiler', true, "babel.min@7.15.4.js");

Vue.use(Antd);

Vue.use(VuePlugin)
Vue.use(ElementUI, { size: 'small' });

Vue.use(highlightPlugin);

const dialogContainer = document.createElement('div');
document.body.appendChild(dialogContainer);


require('./components/DataVisualEditor/utils/vue-component.js')


Vue.config.warnHandler = (msg: string, vm: Vue, trace: string) => {
  if (msg == `Error in nextTick: "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."`) {
  }
  console.log("vue全局警告msg", msg);
  console.log("vue全局警告vm", vm);
  console.log("vue全局警告trace", trace);
}


localStorage.setItem('UserId', 'admin')

Vue.config.productionTip = false;




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
