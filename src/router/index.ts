import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import HomeView from '../views/HomeView.vue'
import Login from '../views/login/index.vue'
import Home from '../views/Home/index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'default',
    redirect: "/editor"
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue')
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/views/DisplayBoardDesigner/index.vue')
  },
  {
    path: '/viewer',
    name: 'viewer',
    component: () => import('@/views/DisplayBoardViewer/index.vue')
  },
  {
    path: '/DisplayBoardAdmin',
    name: 'DisplayBoardAdmin',
    component: () => import('@/views/DisplayBoardAdmin/index.vue')
  },
  {
    path: '/CanvasTemplateAdmin',
    name: 'CanvasTemplateAdmin',
    component: () => import('@/views/CanvasTemplateAdmin/index.vue')
  },
  {
    path: '/DeviceInformation',
    name: 'DeviceInformation',
    component: () => import('@/views/DeviceInformation/index.vue')
  },
  {
    path: '/DatasourceEditor',
    name: 'DatasourceEditor',
    component: () => import('@/views/DatasourceEditor/index.vue')
  },
  {
    path: '/AddDatasource',
    name: 'AddDatasource',
    component: () => import('@/views/AddDatasource/index.vue')
  },
  {
    path: '/WorkFlowEditor',
    name: 'WorkFlowEditor',
    component: () => import('@/views/WorkFlowEditor/index.vue')
  },
  {
    path: '/PrintTemplateTest',
    name: 'PrintTemplateTest',
    component: () => import('@/views/PrintTemplateTest/index.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.VUE_APP_BASE_URL,
  routes
})


router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  next()

  // if (to.query.secret === "LPSFNDMNVTDHBLML") {

  // } else if (to.path === "/login") {
  //   (to.meta as any).userInfo = (from.meta as any).userInfo
  //   next()
  // } else {
  //   (from.meta as any).userInfo = {
  //     "to": to
  //   }
  //   next("/login")
  // }


  // if (to.path === '/') {
  //   next({ path: '/login' })
  //   NProgress.done()
  // } else {
  //   next()

  //   //this.push({ path: "/kanban" + this.$route.fullPath });
  // }

})

router.afterEach(() => {
  NProgress.done()
})

export default router
