import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { SUPER_ADMIN } from './store/modules/auth'
NProgress.configure({
  showSpinner: false
})

const whiteList = ['login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.includes(to.name)) {
    next()
  } else if (Vue.ls.get('userInfo')) {
    if (store.getters.asyncRoutes.length === 0) {
      store
        .dispatch('genAsyncRoutes', store.getters.permissions)
        .then(() => {
          router.addRoutes(store.getters.asyncRoutes)
          const redirect = decodeURIComponent(from.query.redirect || to.path)
          if (to.path === redirect) {
            next({
              ...to,
              replace: true
            })
          } else {
            next({
              path: redirect
            })
          }
          NProgress.done()
        }).catch(() => {
          NProgress.done()
        })
    } else {
      next()
    }
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.fullpath
      }
    })
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 操作权限指令
 * 用法
 *  - 在操作按钮组件上 使用 v-action:[actionName], 如下
 *  <el-button v-action:add>添加</el-button>
 *  <el-button v-action:edit>编辑</el-button>
 *  - 用户没有对应操作权限时，操作按钮会不显示
 *  - actionName = view|add|edit|delete|import|export|disable|enable|reset, 目前只有add 和 edit
 */
const vAction = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const permissions = store.getters.permissions
    const code = vnode.context.$route.meta.code
    let isAdmin = store.getters.userCode === SUPER_ADMIN
    let action = `${code}:${actionName}`

    if (!permissions.includes(action) && !isAdmin) {
      setTimeout(() => {
        if (el.parentNode == null) {
          el.style.display = 'none'
        } else {
          el.parentNode.removeChild(el)
        }
      }, 10)
    }
  }
})

export {
  vAction
}
