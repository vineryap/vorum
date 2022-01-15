<script setup>
import { ref } from 'vue';
import { mapActions } from '@/helpers';
import BaseLayout from './layouts/BaseLayout.vue';
import NProgress from 'nprogress'
import { useRouter } from 'vue-router'

const { fetchAuthUser } = mapActions('auth')
const router = useRouter()
const showPage = ref(false)

function onPageReady() {
  showPage.value = true
  NProgress.done()
}

fetchAuthUser()

NProgress.configure({ showSpinner: false })
router.beforeEach(() => {
  showPage.value = false
  NProgress.start()
})
</script>

<template>
  <base-layout>
    <router-view
      v-show="showPage"
      @pageReady="onPageReady"
      :key="`${$route.path}${JSON.stringify($route.query)}`"
    />
    <base-spinner v-show="!showPage" />
    <base-notifications />
  </base-layout>
</template>

<style>
@import "assets/style.css";
</style>
