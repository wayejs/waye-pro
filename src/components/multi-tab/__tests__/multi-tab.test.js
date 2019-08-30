import { shallowMount } from '@vue/test-utils'
import MultiTab from '@/components/multi-tab'

const $route = {
  fullPath: '/about',
  meta: {
    title: '关于我们'
  },
  path: '/about'
}
const $router = {
  push () {

  }
}

describe('MultiTab', () => {
  it('init multi-tab', async () => {
    const wrapper = shallowMount(MultiTab, {
      mocks: {
        $route,
        $router
      }
    })

    expect(wrapper.vm.activeRoute).toBe('/about')
  })
})
