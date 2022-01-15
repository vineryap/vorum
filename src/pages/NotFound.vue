<template>
  <div>
    <h1>{{ heading }}</h1>
    <router-link :to="{ name: 'Home' }">Back to Home</router-link>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: '404'
    }
  },
  created () {
    this.$emit('pageReady')
  }
}
</script>

<style>
</style>
