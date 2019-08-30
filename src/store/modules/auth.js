import Vue from 'vue'
import { login, logout } from '../../api/auth'
import navConfig from '@/config/route.config'
import cloneDeep from 'lodash/cloneDeep'
let wayeUserInfo = Vue.ls.get('userInfo')
let codeMap = {}

export const SUPER_ADMIN = 'admin'
const parseRoutes = (data, parentPath = '') => {
  data.forEach(item => {
    let name = item.name
    item.path = item.path || `${parentPath}/${name}`

    if (item.children) {
      let path = `${parentPath}/${name}`
      if (name === 'home') {
        path = ''
      }
      parseRoutes(item.children, path)
    } else {
      item.meta = item.meta || {}
      item.meta.title = item.label || ''
      item.meta.code = item.meta.code || item.code
      codeMap[item.code] = item.path
    }
  })
}
const filterAsyncRouter = (data, filterPaths) => {
  return data.filter(route => {
    if (hasPermission(filterPaths, route)) {
      if (route.children) {
        route.children = filterAsyncRouter(route.children, filterPaths)
      }

      return true
    }
    return false
  })
}

const hasPermission = (paths, route) => {
  if (route.hidden) {
    return true
  }
  return paths.some(path => path.indexOf(route.path) > -1)
}

const accessedRoutePaths = (permissions, codeMap) => {
  let result = []
  permissions.forEach(code => {
    if (codeMap[code]) {
      result.push(codeMap[code])
    }
  })
  return result
}
const user = {
  state: {
    userName: wayeUserInfo ? wayeUserInfo.userName : '',
    userCode: wayeUserInfo ? wayeUserInfo.userCode : '',
    userId: wayeUserInfo ? wayeUserInfo.userId : '',
    permissions: wayeUserInfo ? wayeUserInfo.permissions : [],
    asyncRoutes: []
  },

  mutations: {
    setUserName (state, name) {
      state.userName = name
    },

    setUserCode (state, code) {
      state.userCode = code
    },

    setUserId (state, id) {
      state.userId = id
    },

    setPermissions (state, val) {
      state.permissions = val
    },
    setAsyncRoutes (state, list) {
      state.asyncRoutes = list
    }
  },

  actions: {
    login ({ commit, dispatch }, userInfo) {
      return login(userInfo)
        .then(data => {
          Vue.ls.set('userInfo', data)
          Vue.ls.set('unloginCount', 0)
          Vue.ls.set('userId', data.userId)

          commit('setUserName', data.userName)
          commit('setUserCode', data.userCode)
          commit('setUserId', data.userId)
          commit('setPermissions', data.permissions)

          return data
        })
    },

    genAsyncRoutes ({ commit, state }, permissions) {
      return new Promise(resolve => {
        let routes
        let routeData = cloneDeep(navConfig)
        parseRoutes(routeData)
        if (state.userCode === SUPER_ADMIN) {
          routes = routeData
        } else {
          let filterPaths = accessedRoutePaths(permissions, codeMap)
          routes = filterAsyncRouter(routeData, filterPaths)
        }
        commit('setAsyncRoutes', routes)
        resolve()
      })
    },

    logout ({ commit }) {
      return logout().then(() => {
        Vue.ls.remove('userInfo')
        Vue.ls.remove('unloginCount')
        commit('setUserName', '')
        commit('setUserCode', '')
        commit('setUserId', '')
        commit('setPermissions', '')
        commit('setAsyncRoutes', [])
        return true
      })
    }
  }
}

export default user
