<script setup>
import { ref } from 'vue'
import BaseLayout from './layouts/BaseLayout.vue'
import NProgress from 'nprogress'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const showPage = ref(false)

function onPageReady() {
  showPage.value = true
  NProgress.done()
}
router.beforeEach(() => {
  showPage.value = false
  NProgress.start()
})
async function initFetch() {
  await store.dispatch('auth/fetchAuthUser')
  NProgress.configure({ showSpinner: false })
}
initFetch()
</script>

<template>
  <base-layout>
    <div class="min-h-screen pt-4 pb-24 px-4 md:px-6">
      <router-view
        v-show="showPage"
        :key="`${$route.path}${JSON.stringify($route.query)}`"
        @page-ready="onPageReady"
      />
      <base-spinner v-show="!showPage" />
      <base-notifications />
    </div>
  </base-layout>
</template>

<style>
@import 'assets/style.css';
</style>
