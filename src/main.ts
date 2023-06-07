import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// import store from './components/LabelDesigner/store'

import { VuePlugin } from 'vuera'


import ElementUI, { Dialog } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import '@/components/DataVisualEditor/custom-component' // 注册自定义组件
import '@/components/DataVisualEditor/assets/iconfont/iconfont.css'
import '@/components/DataVisualEditor/styles/animate.less'
import '@/components/DataVisualEditor/styles/reset.css'


// require('@/compiler');
// const babel = require.context('./compiler', true, "babel.min@7.15.4.js");




Vue.use(VuePlugin)
Vue.use(ElementUI, { size: 'small' });


const dialogContainer = document.createElement('div');
document.body.appendChild(dialogContainer);


Vue.component('top-el-dialog', {
  extends: Dialog,
  mounted() {
    document.body.appendChild(this.$el);
  },
});



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
