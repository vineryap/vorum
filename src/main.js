import 'virtual:windi.css'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import ClickOutsideDirective from '@/plugins/ClickOutsideDirective'
import PageScrollDirective from '@/plugins/PageScrollDirective'
import VuePagination from '@/plugins/VuePagination'
import VeeValidatePlugin from '@/plugins/VeeValidatePlugin'
import { createHead } from '@vueuse/head'

const ForumApp = createApp(App)
ForumApp.use(router)
ForumApp.use(store)
ForumApp.use(ClickOutsideDirective)
ForumApp.use(PageScrollDirective)
ForumApp.use(VuePagination)
ForumApp.use(VeeValidatePlugin)
ForumApp.use(createHead())

const requireComponents = import.meta.globEager('./components/**/Base*.vue')
for (const path in requireComponents) {
  const module = requireComponents[path]
  const component = module.default || module
  const componentName =
    component.name || path.replace(/^.+\//, '').replace(/\.\w+$/, '')
  ForumApp.component(componentName, component)
}

ForumApp.mount('#app')
