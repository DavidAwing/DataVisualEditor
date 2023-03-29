import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import store from './components/LabelDesigner/store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import '@/components/DataVisualEditor/custom-component' // 注册自定义组件
import '@/components/DataVisualEditor/assets/iconfont/iconfont.css'
import '@/components/DataVisualEditor/styles/animate.less'
import '@/components/DataVisualEditor/styles/reset.css'


import './components/DataVisualEditor/mock';


Vue.use(ElementUI, { size: 'small' });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
