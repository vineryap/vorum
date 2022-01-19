<template>
  <div
    v-if="isPageReady && !isError"
    class="flex flex-col flex-wrap sm:flex-row"
  >
    <base-head>
      <title>{{ category?.name }} | Vorum</title>
      <meta property="og:title" :content="category?.name" />
      <meta name="twitter:title" :content="category?.name" />
    </base-head>
    <ForumList :category-name="category.name" :forums="forums" />
  </div>
  <base-error-fallback v-else />
</template>

<script setup>
import ForumList from '@/components/ForumList.vue'
import { mapActions, mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

const isError = ref(false)
const props = defineProps({ id: { type: String, required: true } })
const { id } = toRefs(props)

const { category: getCategory } = mapGetters('categories')
const { forum: getForum } = mapGetters('forums')
const category = computed(() => getCategory.value(id.value))
const forums = computed(() => {
  if (!category.value) return []
  return category.value.forums.map((forumId) => getForum.value(forumId))
})

const { fetchCategoryById } = mapActions('categories')
const { fetchForumsByIds } = mapActions('forums')
const { fetchThreadsByIds } = mapActions('threads')
const { fetchUsersByIds } = mapActions('users')

async function initFetch() {
  const thisCategory = await fetchCategoryById({ id: id.value })
  if (!thisCategory) {
    router.push({ name: 'NotFound' })
  }
  try {
    if (thisCategory.forums.length) {
      const forums = await fetchForumsByIds({ ids: thisCategory.forums })
      const lastThreadIds = forums
        .filter((f) => !!f.threads)
        .map((f) => f.threads[f.threads?.length - 1])

      if (lastThreadIds.length) {
        const threads = await fetchThreadsByIds({ ids: lastThreadIds })
        const userIds = threads.map((thread) => thread.userId)
        await fetchUsersByIds({ ids: userIds })
      }
    }
    pageLoaded(emit)
  } catch (error) {
    isError.value = true
  }
}

initFetch()
</script>

<style></style>
