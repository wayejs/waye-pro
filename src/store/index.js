import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import app from './modules/app'
import getters from './getters'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    auth
  },
  getters
})

export default store
