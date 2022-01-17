<script setup>
import { ref } from 'vue'
import { mapActions } from '@/helpers'
import BaseLayout from './layouts/BaseLayout.vue'
import NProgress from 'nprogress'
import { useRouter } from 'vue-router'

const { fetchAuthUser } = mapActions('auth')
const router = useRouter()
const showPage = ref(false)

NProgress.configure({ showSpinner: false })

router.beforeEach(() => {
  showPage.value = false
  NProgress.start()
})

function onPageReady() {
  showPage.value = true
  NProgress.done()
}
const initFetch = async () => {
  await fetchAuthUser()
}
initFetch()
</script>

<template>
  <base-layout>
    <router-view
      v-show="showPage"
      :key="`${$route.path}${JSON.stringify($route.query)}`"
      @page-ready="onPageReady"
    />
    <base-spinner v-show="!showPage" />
    <base-notifications />
  </base-layout>
</template>

<style>
@import 'assets/style.css';
</style>
