import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Thread from '@/pages/Thread.vue'
import ThreadCreate from '@/pages/ThreadCreate.vue'
import ThreadEdit from '@/pages/ThreadEdit.vue'
import Category from '@/pages/Category.vue'
import Forum from '@/pages/Forum.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'
import NotFound from '@/pages/NotFound.vue'
import { authCheck, logout } from '@/router/middlewares'
import store from '@/store'
import { isResourceExists } from '@/helpers'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/thread/:id',
    name: 'Thread',
    component: Thread,
    props: true,
    beforeEnter: async (to, from, next) => {
      await store.dispatch('threads/fetchThreadById', {
        id: to.params.id,
        once: true
      })

      const threadExists = isResourceExists(
        store.state.threads.items,
        to.params.id
      )

      if (threadExists) {
        return next()
      }
      return next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },

        query: to.query,
        hash: to.hash
      })
    }
  },
  {
    path: '/thread/:forumId/new',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true },
    beforeEnter: async (to, from, next) => {
      await store.dispatch('forums/fetchForumById', {
        id: to.params.forumId,
        once: true
      })

      const forumExists = isResourceExists(
        store.state.forums.items,
        to.params.forumId
      )

      if (forumExists) {
        return next()
      }
      return next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },

        query: to.query,
        hash: to.hash
      })
    }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },
  { path: '/category/:id', name: 'Category', component: Category, props: true },
  { path: '/forum/:id', name: 'Forum', component: Forum, props: true },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: Profile,
    props: true,
    meta: { toTop: true, smoothScroll: true }
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { isGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { isGuest: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: [logout]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.afterEach(() => {
  store.dispatch('clearItems', {
    modules: ['categories', 'forums', 'posts', 'threads']
  })
})

router.beforeEach(async (to) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeFirestoreListeners')
  if (to.meta.requiresAuth) return authCheck({ redirectTo: to.path })
  if (to.meta.isGuest && store.state.auth.authId) {
    console.log('🚏 redirecting to Home')
    return { name: 'Home' }
  }
})

export default router
