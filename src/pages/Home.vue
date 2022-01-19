<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <category-list v-if="isPageReady && !isError" :categories="categories" />
    <base-error-fallback v-else />
  </div>
</template>

<script setup>
import CategoryList from '@/components/CategoryList.vue'
import { mapState, mapActions } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { defineEmits, ref } from 'vue'

const emit = defineEmits(['pageReady'])
const { isPageReady, pageLoaded } = usePageLoadStatus()

const isError = ref(false)
const { items: categories } = mapState('categories')
const { fetchCategories } = mapActions('categories')
const { fetchForumsByIds } = mapActions('forums')
const { fetchThreadsByIds } = mapActions('threads')
const { fetchUsersByIds } = mapActions('users')

const initFetch = async () => {
  try {
    const allCategories = await fetchCategories()
    const forumIds = allCategories.map((category) => category.forums).flat()
    const forums = await fetchForumsByIds({ ids: forumIds })
    const lastThreadIds = forums
      .filter((f) => !!f.threads)
      .map((f) => f.threads[f.threads?.length - 1])
    const threads = await fetchThreadsByIds({ ids: lastThreadIds })
    const userIds = threads.map((thread) => thread.userId)
    await fetchUsersByIds({ ids: userIds })
  } catch (error) {
    isError.value = true
  }
  pageLoaded(emit)
}

initFetch()
</script>

<style></style>
