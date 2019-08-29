import { mapGetters } from 'vuex'
export default {
  name: 'QlMenu',
  props: {
    collapse: Boolean
  },
  computed: {
    ...mapGetters(['asyncRoutes']),

    activeIndex () {
      return this.$route.path
    },

    menuList () {
      let home = this.asyncRoutes.find(item => item.name === 'home')
      return home ? home.children : []
    }
  },
  methods: {
    genMenus (menus) {
      let h = this.$createElement
      let elements = []
      menus.forEach(item => {
        if (item.children) {
          elements.push(
            h('el-submenu', {
              props: {
                popperClass: 'ql-layout__submenu',
                index: item.path
              },
              key: item.path
            }, [
              h('div', {
                slot: 'title'
              }, [
                h('wy-icon', {
                  props: {
                    name: item.icon
                  }
                }),
                h('span', {
                  slot: 'title'
                }, item.label || item.meta.title)
              ]),
              this.genMenus(item.children)
            ])
          )
        } else {
          elements.push(
            h('el-menu-item', {
              props: {
                index: item.path
              },
              key: item.path
            }, [
              h('wy-icon', {
                props: {
                  name: item.icon
                }
              }),
              h('span', {
                slot: 'title'
              }, item.label || item.meta.title)
            ])
          )
        }
      })
      return elements
    }
  },
  render (h) {
    if (!this.menuList.length) {
      return h('div', {
        class: {
          'ql-layout__aside-empty': true,
          'is-collapse': this.collapse
        }
      }, '无菜单权限，请联系客服')
    }
    return h('el-menu', {
      class: {
        'ql-layout__aside-menu': true
      },
      props: {
        router: true,
        collapse: this.collapse,
        defaultActive: this.activeIndex,
        backgroundColor: '#00142a',
        activeTextColor: '#409EFF',
        textColor: 'hsla(0, 0%, 100%, .65)',
        mode: 'vertical'
      }
    }, this.genMenus(this.menuList))
  }
}
