import Vue from 'vue'
import Element from 'element-ui'

import clickoutside from 'element-ui/lib/utils/clickoutside'

import Waye from '@waye/ui'

Vue.use(Element, { size: 'medium' })
Vue.use(Waye)

Vue.directive('clickoutside', clickoutside)
