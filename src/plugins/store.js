import Vue from 'vue'
import VueStorage from 'vue-ls'

Vue.use(VueStorage, {
  namespace: 'cqbDict__',
  name: 'ls',
  storage: 'local'
})
