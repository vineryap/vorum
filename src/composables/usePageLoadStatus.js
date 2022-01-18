import { readonly, ref } from 'vue'

const isPageReady = ref(false)

function pageLoaded(emit) {
  isPageReady.value = true
  emit('pageReady')
}

export default function userPageLoadStatus() {
  return {
    isPageReady: readonly(isPageReady),
    pageLoaded
  }
}
