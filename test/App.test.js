import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { expect, vi } from 'vitest'
import { useRouter, useRoute } from 'vue-router'
import store from '@/store'

// vi.mock('vue-router', () => ({
//   useRoute: vi.fn(),
//   useRouter: vi.fn(() => ({
//     beforeEach: () => {}
//   }))
// }))

// describe('App', () => {
//   it('should work', () => {
//     const router = useRouter()
//     const wrapper = mount(App, {
//       shallow: true,
//       global: { provide: { store: store }, plugins: [router] }
//     })
//     // expect().toHaveBeenCalled()
//     console.log(wrapper)
//   })
// })
