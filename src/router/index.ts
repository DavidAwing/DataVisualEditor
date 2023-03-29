import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
import HomeView from '../views/HomeView.vue'
import Login from '../views/login/index.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    redirect: "/DisplayBoardDesigner"
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue')
  },
  {
    path: '/DisplayBoardDesigner',
    name: 'DisplayBoardDesigner',
    component: () => import('@/views/DisplayBoardDesigner/index.vue')
  },
  {
    path: '/DisplayBoardViewer',
    name: 'DisplayBoardViewer',
    component: () => import('@/views/DisplayBoardViewer/index.vue')
  },
  {
    path: '/DisplayBoardAdmin',
    name: 'DisplayBoardAdmin',
    component: () => import('@/views/DisplayBoardAdmin/index.vue')
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
