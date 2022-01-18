<template>
  <div class="bg-gray-100 dark:bg-gray-800 h-screen overflow-auto relative">
    <div class="flex flex-col w-full mx-auto h-screen">
      <TheNavbar />
      <slot />
    </div>
  </div>
</template>

<script>
import TheNavbar from '../components/TheNavbar.vue'

export default {
  components: { TheNavbar }
}
</script>

<style></style>
