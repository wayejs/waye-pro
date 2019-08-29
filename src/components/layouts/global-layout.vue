<template>
  <page-layout>
    <transition name="fade" mode="out-in">
      <route-view></route-view>
    </transition>
  </page-layout>
</template>

<script>
import PageLayout from './page-layout'
import RouteView from './route-view'
export default {
  name: 'GlobalLayout',
  components: {
    PageLayout,
    RouteView
  },
  data () {
    return {
    }
  }
}
</script>
