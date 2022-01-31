import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { mapState, mapActions } from '@/helpers'

// vi.mock('vue-router', () => ({
//   useRoute: vi.fn(),
//   useRouter: vi.fn(() => ({
//     beforeEach: () => {}
//   }))
// }))

// vi.mock('@/helpers', () => ({
//   mapState: vi.fn(),
//   mapActions: vi.fn()
// }))

describe('Router', () => {
  const router = useRouter()
  const store = useStore()

  it('should show categories.', () => {
    const wrapper = mount(Home, {
      shallow: true,
      global: { provide: { store }, plugins: [router] }
    })
    console.log(wrapper)
  })
})
