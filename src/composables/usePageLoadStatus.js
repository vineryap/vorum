import { readonly, ref } from 'vue'

const isPageReady = ref(false)

function getInitialStatus() {
  isPageReady.value = false
  return readonly(isPageReady)
}

function pageLoaded(emit) {
  isPageReady.value = true
  emit('pageReady')
}

export default function userPageLoadStatus() {
  return {
    isPageReady: getInitialStatus(),
    pageLoaded
  }
}
