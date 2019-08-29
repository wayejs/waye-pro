import { RouteView, GlobalLayout } from '@/components/layouts'
const mainRouteConfig = [
  {
    name: 'dashboard',
    icon: 'data-montior',
    label: '面板',
    component: RouteView,
    children: [
      {
        name: 'hello',
        component: () => import('@/views/hello'),
        label: 'Hello'
      },
      {
        name: 'component',
        component: () => import('@/views/component'),
        label: '组件'
      }
    ]
  }
]
const root = {
  path: '/',
  name: 'home',
  label: '首页',
  redirect: '/hello',
  component: GlobalLayout,
  children: mainRouteConfig
}

const asyncRouterConfig = [
  root,
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export {
  mainRouteConfig
}
export default asyncRouterConfig
