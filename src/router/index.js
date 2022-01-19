import { createRouter, createWebHistory } from 'vue-router'
import { authCheck, logout } from '@/router/middlewares'
import store from '@/store'
import { isResourceExists } from '@/helpers'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home.vue') },
  {
    path: '/me',
    name: 'ProfilePage',
    component: () => import('@/pages/ProfilePage.vue'),
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import('@/pages/ProfilePage.vue'),
    props: { edit: true },
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:userId',
    name: 'UserProfile',
    component: () => import('@/pages/ProfilePage.vue'),
    props: true,
    meta: { toTop: true, smoothScroll: true, requiresAuth: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/pages/Category.vue'),
    props: true
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import('@/pages/Forum.vue'),
    props: true
  },
  {
    path: '/thread/:id',
    name: 'Thread',
    component: () => import('@/pages/Thread.vue'),
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
      } else {
        return next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },

          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/forum/:forumId/thread/new',
    name: 'ThreadCreate',
    component: () => import('@/pages/ThreadCreate.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import('@/pages/ThreadEdit.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { isGuest: true }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { isGuest: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: [logout]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
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

router.beforeEach(async (to) => {
  await store.dispatch('auth/initAuthentication')
  store.dispatch('unsubscribeFirestoreListeners')
  if (to.meta.requiresAuth) return authCheck({ redirectTo: to.path })
  if (to.meta.isGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
})

export default router
