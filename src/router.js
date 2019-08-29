import Vue from 'vue'
import Router from 'vue-router'

const baseRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login')
  },
  {
    path: '/403',
    name: 'page403',
    component: () => import(/* webpackChunkName: "403" */ '@/views/page-403')
  }, {
    path: '/404',
    name: 'page404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/page-404')
  }
]

Vue.use(Router)
const router = new Router({
  routes: baseRoutes
})
export default router
