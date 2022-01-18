<template>
  <div class="flex flex-col h-full justify-center items-center">
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
