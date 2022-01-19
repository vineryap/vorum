<template>
  <base-head>
    <title>Vorum</title>
    <meta name="description" content="A demo of Vue.js 3 powered forum!" />

    <!-- Social -->
    <meta property="og:title" content="Vorum" />
    <meta
      property="og:description"
      content="A demo of Vue.js 3 powered forum!"
    />
    <meta property="og:image" content="/social_img.png" />

    <!-- Twitter -->
    <meta name="twitter:title" content="Vorum" />
    <meta
      name="twitter:description"
      content="A demo of Vue.js 3 powered forum!"
    />
    <meta name="twitter:image" content="/social_img.png" />
    <meta name="twitter:card" content="summary_large_image" />
  </base-head>
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
