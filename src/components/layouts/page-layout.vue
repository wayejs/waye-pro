<template>
  <div>
    <el-container class="ql-layout__wrapper">
      <el-aside
        class="ql-layout__aside"
        :style="{
          width: asideWidth + 'px'
        }">
        <router-link
          class="ql-layout__logo is-waye"
          :to="{path: '/'}">
          <span class="ql-layout__logo-abbr" v-show="isCollapse">WAYE</span>
          <div class="ql-layout__logo-title" v-show="!isCollapse">WAYE PRO</div>
        </router-link>
        <ql-menu :collapse="isCollapse"></ql-menu>
      </el-aside>
      <el-container>
        <el-header class="ql-layout__header">
          <wy-icon :name="isCollapse ? 'menu-unfold' : 'menu-fold'" @click="handleMenuToggle" class="ql-layout__header-toggle"></wy-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-if="$route.meta.title">{{$route.meta.title}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="ql-layout__header-right">
            <el-dropdown @command="handleMessageCommand" class="ql-layout__header-dropdown">
              <span class="dropdown-link msg-prompt">
                <i class="el-icon-bell"></i>
                <el-badge :value="msgCount" v-if="msgCount">
                </el-badge>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :key="index"
                  v-for="(item, index) in msgList"
                  :command="index">
                    {{item.message}}
                </el-dropdown-item>
                <el-dropdown-item command="empty" v-if="!msgList.length">
                  暂无消息
                </el-dropdown-item>
                <el-dropdown-item divided command="more"> 查看更多</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand" class="ql-layout__header-dropdown">
              <span class="dropdown-link">
                <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                {{userName}}
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="pwd"><wy-icon name="lock"></wy-icon> 修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout"><wy-icon name="logout"></wy-icon> 注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="ql-layout__main">
          <multi-tab></multi-tab>
          <div class="ql-layout__content">
            <slot></slot>
          </div>
        </el-main>
        <el-footer height="30px" class="ql-layout__footer">
          @上海蔚一信息技术有限公司
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/utils/event-bus'
import MultiTab from '@/components/multi-tab'
import QlMenu from './menu'
const ASIDE_WIDTH_MINI = 64
const ASIDE_WIDTH_FULL = 230
export default {
  name: 'PageLayout',
  components: {
    QlMenu,
    MultiTab
  },
  data () {
    return {
      msgTimer: null,
      isCollapse: false,
      msgCount: 3,
      msgId: null,
      msgData: {
        readTime: '',
        status: null,
        processTime: ''
      },
      msgList: [],
      // isNw: typeof window.nw !== 'undefined',
      transitionName: 'slide-left'
    }
  },

  computed: {
    ...mapGetters(['userName', 'userCode', 'pwdStyle']),

    asideWidth () {
      return this.isCollapse ? ASIDE_WIDTH_MINI : ASIDE_WIDTH_FULL
    }
  },

  mounted () {
    EventBus.$on('ql.logout.success', () => {
      this.clearTimer()
    })

    this.autoUpdateMessage()

    EventBus.$on('ql.message.showDialog', data => {
      this.updateCurrMsg(data)
      this.showDialogMessage = true
    })
  },

  beforeDestroy () {
    this.clearTimer()
  },

  methods: {
    clearTimer () {
      this.msgTimer && clearInterval(this.msgTimer)
    },
    fetchMessage () {

    },
    autoUpdateMessage () {
      this.fetchMessage()
      this.msgTimer = setInterval(() => {
        this.fetchMessage()
      }, 15 * 1000)
    },
    handleMsgUpdate () {
      this.fetchMessage()
      EventBus.$emit('ql.message.refresh')
    },
    handleMenuToggle () {
      this.isCollapse = !this.isCollapse
    },
    handleMenuOpen () {
      this.asideWidth = ASIDE_WIDTH_FULL
    },
    handleMenuClose () {
      this.asideWidth = ASIDE_WIDTH_MINI
    },
    handleMessageCommand (cmd) {
      if (cmd === 'empty') return
      if (cmd === 'more') {
        this.$router.push({ path: '/message-mgr/message' })
      } else {
        let msg = this.msgList[cmd]
        this.updateCurrMsg(msg)
        this.showDialogMessage = true
      }
    },
    updateCurrMsg (data) {
      this.msgId = data.id
      this.msgData.processTime = data.processTime
      this.msgData.readTime = data.readTime
      this.msgData.status = data.status
    },
    handleCommand (cmd) {
      if (cmd === 'logout') {
        this.$store.dispatch('logout').then(() => {
          this.clearTimer()
          // this.goLogin()
          this.$router.replace({ name: 'login' })
          window.location.reload(true)
        })
      } else if (cmd === 'pwd') {
        this.showDialogReset = true
      }
    },
    goLogin () {
      let { protocol, host, pathname } = window.location
      window.location.href = `${protocol}//${host}${pathname}#/login`
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/scss/common/transition.scss';
  @import '../../assets/scss/common/var.scss';
  @import '../../assets/scss/mixins/utils.scss';

  $aside-bg-color: #000c17;
  $main-bg-color: #f0f2f5;
  $menu-item-color: #038ce1;
  $menu-active-color: #188fff;
  $menu-hover-color: rgba(255, 255, 255, 0.05);
  body {
    margin: 0;
    padding: 0;
  }
  html,
  #app,
  body,
  .ql-layout__wrapper,
  .ql-layout__aside {
    height: 100vh;
  }
  .ql-layout {
    &__logo {
      height: $--header-height;
      line-height: $--header-height;
      display: block;
      overflow: hidden;
      background: #002140;

      &-title {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        margin: 0 0 0 18px;
        font-size: 16px;
        font-weight: 550;
        strong {
          font-size: 24px;
        }
      }
      &-abbr{
        width: 64px;
        line-height: $--header-height;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }
    }
    &__header {
      align-items: center;
      position: relative;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      @include utils-clearfix;
      &-toggle {
        line-height: $--header-height;
        float: left;
        cursor: pointer;
        padding: 0 24px;
        font-size: 24px;
        transition: all 0.3s;
      }
      .el-breadcrumb {
        line-height: $--header-height;
      }
      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        font-size: 16px;
      }
      &-right {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        .el-badge__content {
          border: 0;
          &.is-fixed {
            top: 50%;
            transform: translateY(-100%) translateX(100%);
          }
        }
      }
      &-dropdown {
        .dropdown-link {
          line-height: $--header-height;
          height: $--header-height;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          transition: all 0.3s;
          position: relative;
          .el-avatar {
            margin-right: 8px;
          }
          &.msg-prompt {
            // position: relative;
            // // line-height: 60px;
            // width: 40px;
            // text-align: center;
            // height: 60px;
            // top: 0;
            i {
              font-size: 18px;
            }
            .el-badge {
              vertical-align: top;
            }
          }
          &:hover {
            // background: $--color-primary-light-7;
          }
        }
      }
    }
    &__submenu {
      .el-menu {
        background: $aside-bg-color;
        &-item {
          &:hover {
            color: #fff !important;
          }
          &.is-active {
            background: $menu-active-color !important;
            color: #fff;
          }
        }
      }
      & .el-submenu {
        &.is-active {
          & .el-submenu__title {
            background: $menu-active-color !important;
          }
        }
        &__title {
          &:hover {
            background: $menu-hover-color !important;
          }
          & i {
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }
    }
    &__aside {
      box-shadow: 2px 0 6px rgba(5, 55, 102, 0.35);
      transition: width 0.3s;
      position: relative;
      z-index: 10;
      overflow: visible;
      background: $aside-bg-color;
      &-menu {
        overflow-y: auto;
        height: calc(100% - #{$--header-height});
      }
      &-empty {
        color: #f2f2f2;
        padding: 20px 0 0 20px;
        &.is-collapse {
          padding: 5px 0 0 3px;
        }
      }
      .el-menu {
        border: none;
        .cqbicon {
          margin-right: 4px;
        }
        .el-menu-item {
          height: 40px;
          line-height: 40px;
          background: $aside-bg-color;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          &:hover {
            color: #fff !important;
          }
        }
        .el-submenu:hover,
        .el-submenu__title:hover {
          color: #fff !important;
        }
        .el-submenu.is-active,
        .el-menu-item.is-active {
          background-color: $menu-active-color !important;
          color: #fff !important;
        }
      }
      .el-menu-item i {
        color: rgba(255, 255, 255, 0.9);
      }
      .el-submenu {
        .el-submenu__title {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          height: 50px;
          line-height: 50px;
        }
        &.is-active {
          background: #037dc8;
          &.is-opened {
            background: #037dc8;
          }
        }
        i {
          color: rgba(255, 255, 255, 0.8);
        }
      }
      .footer {
        color: rgba(255, 255, 255, 0.5);
        bottom: 12px;
        position: absolute;
        left: 10px;
      }
    }
    &__main {
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    &__content {
      background: $main-bg-color;
      padding: 20px;
      flex: 1;
    }
    &__footer {
      text-align: center;
      background: $main-bg-color;
      color: $--color-primary;
      line-height: 30px;
    }
  }

  .el-tooltip__popper {
    max-width: 400px;
  }
</style>
