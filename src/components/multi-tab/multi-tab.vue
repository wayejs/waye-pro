<template>
  <div class="wypro-multi-tab">
    <el-tabs v-model="activeRoute" type="card" :closable="closeable" @tab-remove="handleClose">
      <el-tab-pane
        :label="page.meta.title"
        :name="page.fullPath"
        :key="page.fullPath"
        v-for="page in pages">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'MultiTab',
  data () {
    return {
      activeRoute: '',
      pages: [],
      fullPathList: []
    }
  },
  computed: {
    closeable () {
      return this.pages.length > 1
    }
  },
  watch: {
    '$route' (route) {
      const fullPath = this.activeRoute = route.fullPath
      if (!this.fullPathList.includes(fullPath)) {
        this.fullPathList.push(fullPath)
        this.pages.push(route)
      }
    },
    activeRoute (path) {
      this.$router.push({ path })
    }
  },
  created () {
    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.setActiveRoute()
  },
  methods: {
    setActiveRoute () {
      this.activeRoute = this.fullPathList[this.fullPathList.length -1]
    },
    handleClose (fullPath) {
      this.pages = this.pages.filter(item => item.fullPath !== fullPath)
      this.fullPathList = this.fullPathList.filter(path => path !== fullPath)
      if (!this.fullPathList.includes(this.activeRoute)) {
        this.setActiveRoute()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "../../assets/scss/common/var.scss";
  .wypro-multi-tab {
    margin-top: 10px;
    padding-left: 20px;
    border-bottom: 1px solid $--border-color-light;
    .el-tabs {
      position: relative;
      bottom: -1px;
      &__header {
        margin: 0;
      }
      &__item {
        background: #fafafa;
        &.is-active {
          background: #fff;
        }
      }
    }
  }
</style>
