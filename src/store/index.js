import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import getters from './getters'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth
  },
  getters
})

export default store
