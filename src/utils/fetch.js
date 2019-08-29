import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'
import { Message } from 'element-ui'
import router from '../router'
import { EventBus } from './event-bus'
export const BASE_URL = process.env.VUE_APP_BASEURL
const MSG_UNLOGIN = '登录超时，请重新登录'
const MSG_ERROR = '系统异常，请联系客服'
const goLogin = message => {
  message = message || MSG_UNLOGIN
  const count = Vue.ls.get('unloginCount') || 0
  // 多个请求触发 401 时，只提示及跳转一次
  if (count >= 1 || router.currentRoute.name === 'login') {
    return
  }
  EventBus.$emit('ql.logout.success')
  Vue.ls.set('unloginCount', count + 1)
  Message({
    message,
    type: 'error',
    duration: 5 * 1000
  })
  Vue.ls.remove('userInfo')
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.fullPath }
  })
}

axios.defaults.baseURL = BASE_URL

axios.interceptors.request.use(config => {
  return config
})

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    let data = response.data
    let showMessage = response.config.headers.showMessage
    const status = +data.status
    if (status === -100) {
      goLogin()
    } else if (status === -1) {
      showMessage &&
        Message({
          message: data.msg,
          type: 'error',
          duration: 3000
        })
      return Promise.reject(data.msg)
    } else {
      let serverTime = data.serverTime
      let now = Date.now()
      if (serverTime) {
        Vue.ls.set('timeDiff', serverTime - now)
      }
      return data.data === undefined ? data : data.data
    }
  },
  error => {
    let message = error.response.data && error.response.data.msg
    if (error.response && error.response.status === 401) {
      goLogin(message || MSG_UNLOGIN)
    } else {
      let showMessage = error.response.config.headers.showMessage
      showMessage &&
        Message({
          message: message || MSG_ERROR,
          type: 'error',
          duration: 5 * 1000
        })
    }
    console.error(error)
    return Promise.reject(error)
  }
)

/**
 * 查询
 * @param {*} url 接口地址
 * @param {*} params 参数
 * @param {*} showMessage 显示出错提示
 */
export function get (url, params = {}, showMessage = true) {
  if (typeof params === 'boolean') {
    showMessage = params
    params = {}
  }
  return axios({
    url,
    params,
    headers: { showMessage },
    method: 'get'
  })
}

/**
 * post 请求
 * @param {*} url 接口地址
 * @param {*} data json 数据
 * @param {*} showMessage 显示出错提示
 */
export function post (url, data = {}, showMessage = true) {
  return axios({
    url,
    method: 'post',
    data,
    headers: { 'Content-Type': 'application/json', showMessage }
  })
}

/**
 * 用 formData 方式 post
 * @param {*} url 接口地址
 * @param {*} params json 数据
 * @param {*} showMessage 显示出错提示
 */
export function postByForm (url, data = {}, showMessage = true) {
  return axios({
    url,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      showMessage
    }
  })
}

/**
 * 获取文件地址，如 pdf, excel, text 下载地址
 * @param {*} path 路径
 * @param {*} params 查询参数
 */
export function getFileUrl (path, params = {}) {
  let queryData = []
  let queryString = ''
  Object.keys(params).forEach(key => {
    queryData.push(`${key}=${params[key]}`)
  })

  if (queryData.length) {
    queryString = `?${queryData.join('&')}`
  }
  return `${BASE_URL}${path}${queryString}`
}

/**
 * put 请求
 * @param {*} url 接口地址
 * @param {*} data json 数据
 */
export function put (url, data = {}, byJson = true) {
  return axios({
    url,
    method: 'put',
    data: byJson ? data : qs.stringify(data),
    headers: {
      showMessage: true,
      'Content-Type': byJson
        ? 'application/json'
        : 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * delete 请求
 * @param {*} url 接口地址
 * @param {*} data json 数据
 */
export function deleteData (url, data = {}) {
  return axios({
    url,
    method: 'delete',
    data,
    headers: { 'Content-Type': 'application/json', showMessage: true }
  })
}
