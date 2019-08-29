import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import '@/assets/scss/theme.scss'

import clickoutside from 'element-ui/lib/utils/clickoutside'

import Waye from '@waye/ui'

Vue.use(Element, { size: 'medium' })
Vue.use(Waye)

Vue.directive('clickoutside', clickoutside)
