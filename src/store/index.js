import { createStore } from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const store = createStore({
  state,
  getters,
  mutations,
  actions
})

const modules = import.meta.globEager('./modules/*.(js|ts)')
for (const path in modules) {
  const module = modules[path].default
  const moduleName = path.replace(/^.+\//, '').replace(/\.\w+$/, '')
  if (!store.hasModule(moduleName)) {
    store.registerModule(moduleName, module)
  }
}

export default store
