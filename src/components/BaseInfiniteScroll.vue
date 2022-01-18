<template>
  <div ref="intersectionOb" class="intersection-observer"></div>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

const emit = defineEmits(['load'])
const props = defineProps({ done: { type: Boolean, default: false } })
const { done } = toRefs(props)
const observer = ref(null)
const intersectionOb = ref(null)

watch(done, (val) => {
  if (val) {
    observer.value.unobserve(intersectionOb.value)
  }
})

onMounted(() => {
  if (!done.value) {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) emit('load')
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.9
      }
    )
    observer.value.observe(intersectionOb.value)
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.unobserve(intersectionOb.value)
    observer.value = null
  }
})
</script>
<style scoped>
div {
  position: relative;
  z-index: -9999;
  pointer-events: none;
  bottom: 50px;
}
</style>
