<template>
  <div class="bg-gray-100 dark:bg-gray-800 h-screen overflow-auto relative">
    <div class="flex flex-col w-full mx-auto h-screen">
      <TheNavbar />
      <div class="h-screen pt-4 pb-24 px-4 md:px-6">
        <slot />
      </div>
    </div>
  </div>
  <!-- <TheFooter /> -->
</template>

<script>
import TheNavbar from '../components/TheNavbar.vue'
import TheFooter from '../components/TheFooter.vue'

export default {
  components: { TheNavbar, TheFooter }
}
</script>

<style>
</style>
