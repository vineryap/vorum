<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <category-list v-if="isPageReady" :categories="categories" />
  </div>
</template>

<script setup>
import CategoryList from '@/components/CategoryList.vue'
import { mapState, mapActions } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { defineEmits } from 'vue'

const emit = defineEmits(['pageReady'])
const { isPageReady, pageLoaded } = usePageLoadStatus()

const { items: categories } = mapState('categories')
const { fetchCategories } = mapActions('categories')
const { fetchForumsByIds } = mapActions('forums')
const { fetchThreadsByIds } = mapActions('threads')
const { fetchUsersByIds } = mapActions('users')

const initFetch = async () => {
  const allCategories = await fetchCategories()
  const forumIds = allCategories.map((category) => category.forums).flat()
  const forums = await fetchForumsByIds({ ids: forumIds })
  const lastThreadIds = forums.map((f) => f.threads?.at(-1)).filter((id) => id)
  const threads = await fetchThreadsByIds({ ids: lastThreadIds })
  const userIds = threads.map((thread) => thread.userId)
  await fetchUsersByIds({ ids: userIds })
  pageLoaded(emit)
}

initFetch()
</script>

<style></style>
