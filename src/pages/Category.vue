<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <ForumList
      v-if="isPageReady"
      :category-name="category.name"
      :forums="forums"
    />
  </div>
</template>

<script setup>
import ForumList from '@/components/ForumList.vue'
import { mapActions, mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

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
  try {
    const thisCategory = await fetchCategoryById({ id: id.value })

    if (thisCategory.forums.length) {
      const forums = await fetchForumsByIds({ ids: thisCategory.forums })
      const lastThreadIds = forums
        .map((f) => f.threads?.at(-1))
        .filter((id) => id)

      if (lastThreadIds.length) {
        const threads = await fetchThreadsByIds({ ids: lastThreadIds })
        const userIds = threads.map((thread) => thread.userId)
        await fetchUsersByIds({ ids: userIds })
      }
    }
    pageLoaded(emit)
  } catch (error) {
    router.push({ name: 'NotFound' })
  }
}

initFetch()
</script>

<style></style>
