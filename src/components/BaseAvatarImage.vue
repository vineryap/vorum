<template>
  <img :src="src" @error="imageLoadError" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '@/assets/img/user_avatar_placeholder.png'
    }
  },
  methods: {
    imageLoadError(e) {
      e.target.src = '/user_avatar_placeholder.png'
      // e.target.src = '../assets/img/user_avatar_placeholder.png'
    }
  }
}
</script>

<style scoped>
img {
  object-fit: cover;
}
</style>
