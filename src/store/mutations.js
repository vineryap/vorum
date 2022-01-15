import { upsert } from '@/helpers'

export default {
  setItem: (state, { resource, data }) => {
    upsert(state[resource].items, data)
  },
  appendUnsubscribe: (state, { unsubscribe }) => {
    state.unsubscribes.push(unsubscribe)
  },
  clearAllUnsubscribes: (state) => {
    state.unsubscribes = []
  },
  clearItems: (state, { modules = [] }) => {
    modules.forEach((module) => {
      state[module].items = []
    })
  }
}
