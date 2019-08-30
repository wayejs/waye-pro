import Vue from 'vue'
import VueStorage from 'vue-ls'

Vue.use(VueStorage, {
  namespace: 'wypro__',
  name: 'ls',
  storage: 'local'
})
