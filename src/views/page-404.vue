<template>
  <page-layout>
   {{timeText}}， {{userName}}
  </page-layout>
</template>

<script>
import PageLayout from '@/components/layouts/page-layout'
const timeText = () => {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}
export default {
  name: 'Page404',
  components: {
    PageLayout
  },
  data () {
    return {
      timeText: timeText()
    }
  },
  computed: {
    userName () {
      return this.$store.state.auth.userName
    }
  }
}
</script>
