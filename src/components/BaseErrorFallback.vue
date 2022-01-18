<template>
  <div
    class="flex flex-col w-full h-full mt-30 justify-center items-center text-center"
  >
    <h1 class="text-3xl">{{ heading }}</h1>
    <p v-if="description">{{ description }}</p>
    <button class="btn btn-green mt-5" @click="$router.go">Refresh page</button>
  </div>
</template>
<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  heading: { type: String, default: 'Oops something happened.' },
  description: { type: String, default: '' }
})
const { heading, description } = toRefs(props)
</script>
