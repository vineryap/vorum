<template>
  <base-head>
    <title>404 Not Found | Vorum</title>
    <meta property="og:title" content="404 Not Found" />
    <meta
      property="og:image"
      content="/cookie-the-pom-gySMaocSdqs-unsplash.jpeg"
    />
    <meta name="twitter:title" content="404 Not Found" />
    <meta
      name="twitter:image"
      content="/cookie-the-pom-gySMaocSdqs-unsplash.jpeg"
    />
  </base-head>
  <div class="flex flex-col h-full justify-center items-center text-center">
    <span class="text-3xl mb-5">404</span>
    <h1 class="text-6xl">{{ heading }}</h1>
    <router-link class="btn btn-green mt-5" :to="{ name: 'Home' }"
      >Back to Home</router-link
    >
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

const emit = defineEmits(['pageReady'])
const props = defineProps({
  heading: {
    type: String,
    default: 'Page Not Found'
  }
})
const { heading } = toRefs(props)
emit('pageReady')
</script>

<style></style>
