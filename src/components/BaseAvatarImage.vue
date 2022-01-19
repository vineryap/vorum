<template>
  <img :src="src || ''" class="ring-2 ring-gray-100" @error="imageLoadError" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  methods: {
    imageLoadError(e) {
      e.target.src = '/user_avatar_placeholder.png'
    }
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
