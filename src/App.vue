<script setup>
import { ref } from 'vue'
import { mapActions } from '@/helpers'
import BaseLayout from './layouts/BaseLayout.vue'
import NProgress from 'nprogress'
import { useRouter } from 'vue-router'

const { fetchAuthUser } = mapActions('auth')
const router = useRouter()
const showPage = ref(false)

function onPageReady() {
  showPage.value = true
  NProgress.done()
}
async function initFetch() {
  await fetchAuthUser()
  NProgress.configure({ showSpinner: false })

  router.beforeEach(() => {
    showPage.value = false
    NProgress.start()
  })
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
