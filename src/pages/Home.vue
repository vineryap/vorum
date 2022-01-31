<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <category-list v-if="isPageReady && !isError" :categories="categories" />
    <base-error-fallback v-else />
  </div>
</template>

<script setup>
import CategoryList from '@/components/CategoryList.vue'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['pageReady'])
const { isPageReady, pageLoaded } = usePageLoadStatus()

const isError = ref(false)
const categories = computed(() => store.state.categories.items)

const initFetch = async () => {
  try {
    const allCategories = await store.dispatch('categories/fetchCategories')
    const forumIds = allCategories.map((category) => category.forums).flat()
    const forums = await store.dispatch('forums/fetchForumsByIds', {
      ids: forumIds
    })
    const lastThreadIds = forums
      .filter((f) => !!f.threads)
      .map((f) => f.threads[f.threads?.length - 1])
    const threads = await store.dispatch('threads/fetchThreadsByIds', {
      ids: lastThreadIds
    })
    const userIds = threads.map((thread) => thread.userId)
    await store.dispatch('users/fetchUsersByIds', { ids: userIds })
  } catch (error) {
    isError.value = true
  }
  pageLoaded(emit)
}

initFetch()
</script>

<style></style>
