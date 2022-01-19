<template>
  <div class="text-center">
    <button
      class="btn-green btn-xsmall"
      :disabled="isFetchingImage"
      @click.prevent="getRandomImage"
    >
      {{ isFetchingImage ? 'Getting random image...' : 'Random Avatar' }}
    </button>
    <br />
    <small style="opacity: 0.5"
      >Powered by
      <a target="_blank" rel="external" href="https://unsplash.com"
        >Unsplash</a
      ></small
    >
  </div>
</template>

<script setup>
import { getRandomElement } from '@/helpers'
import useNotifications from '@/composables/useNotifications'
import { ref } from 'vue'

const emit = defineEmits(['randomAvatar'])
const isFetchingImage = ref(false)
const { addNotification } = useNotifications()

const getRandomImage = async () => {
  const searchTerms = [
    'cats',
    'puppies',
    'featured',
    'nature',
    'landscapes',
    'city',
    'aerial',
    'sports'
  ]
  try {
    isFetchingImage.value = true
    const randomTerm = getRandomElement(searchTerms)
    const endpoint = `${
      import.meta.env.VITE_UNSPLASH_RANDOM_IMAGE_ENDPOINT
    }/300x300/?${randomTerm}`
    const res = await fetch(endpoint)
    emit('randomAvatar', res.url)
    isFetchingImage.value = false
  } catch (error) {
    isFetchingImage.value = false
    addNotification({
      message:
        'Failed getting new random image. Please try again in a few minutes.',
      timeout: 3000,
      type: 'error'
    })
  }
}
</script>

<style></style>
