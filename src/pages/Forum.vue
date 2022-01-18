<template>
  <div v-if="isPageReady && !isError" class="w-full">
    <the-breadcrumbs :forum-id="id" />
    <div class="flex flex-col flex-wrap justify-between sm:flex-row mb-4">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <div class="flex sm:self-end mt-5 sm:mt-0">
        <router-link
          :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
          class="btn-green btn-small"
          >Start a thread</router-link
        >
      </div>
    </div>

    <ThreadList :threads="threads" />
    <div class="flex justify-center">
      <v-pagination
        v-if="totalPages > 1"
        v-model="pagination.page"
        :pages="totalPages"
        :active-color="pagination.activeColor"
      />
    </div>
  </div>
  <base-error-fallback v-else />
</template>

<script setup>
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, reactive, toRefs, watch, ref } from 'vue'
import { mapActions, mapGetters, mapState } from '@/helpers'
import { useRoute, useRouter } from 'vue-router'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import ThreadList from '@/components/ThreadList.vue'

const router = useRouter()
const route = useRoute()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

const props = defineProps({ id: { type: String, required: true } })
const { id } = toRefs(props)
const isError = ref(false)

const pagination = reactive({
  page: parseInt(route.query.page) || 1,
  perPage: 5,
  activeColor: '#10b981'
})

const { items: allThreads } = mapState('threads')

// const { fetchCategoryById } = mapActions('categories')
const { fetchForumById } = mapActions('forums')
// const { fetchForumsByIds } = mapActions('forums')
const { fetchThreadsByPage } = mapActions('threads')
const { fetchPostsByIds } = mapActions('posts')
const { fetchUsersByIds } = mapActions('users')

// const { category: getCategory } = mapGetters('categories')
const { forum: getForum } = mapGetters('forums')
const { thread: getThread } = mapGetters('threads')
const forum = computed(() => {
  return getForum.value(id.value)
})
// const subForum = computed(() => {
//   if (!forum.value) return null
// return getCategory.value(forum.value.categoryId)
// })
const threads = computed(() => {
  if (!allThreads.value.length) return []
  return allThreads.value
    .filter((thread) => thread.forumId === forum.value.id)
    .map((thread) => getThread.value(thread.id))
})
// const forums = computed(() => {
//   if (!subForum.value) return []
//   return subForum.value.forums?.map((forumId) => getForum.value(forumId))
// })
const forumThreadsCount = computed(() => {
  return forum.value.threads?.length || 0
})
const totalPages = computed(() => {
  if (!forumThreadsCount.value) return 0
  return Math.ceil(forumThreadsCount.value / pagination.perPage)
})

watch(pagination, ({ page }) => {
  router.push({ query: { page } })
})

async function fetchRelatedData(forumThreadIds) {
  const threads = await fetchThreadsByPage({
    ids: forumThreadIds,
    page: pagination.page,
    perPage: pagination.perPage
  })
  const lastPostIds = threads.map((thread) => thread.lastPostId)
  const lastPosts = await fetchPostsByIds({ ids: lastPostIds })
  const lastPostUserIds = lastPosts.map((post) => post.userId)
  const threadsUserIds = threads.map((thread) => thread.userId)
  const userIds = [...lastPostUserIds, ...threadsUserIds]
  await fetchUsersByIds({ ids: userIds })
}

async function initFetch() {
  const thisForum = await fetchForumById({ id: id.value })
  if (!thisForum) {
    router.push({ name: 'NotFound' })
  }
  // const category = await fetchCategoryById({ id: thisForum.categoryId })
  // const forums = await fetchForumsByIds({ ids: category.forums })
  // const forumsThreadIds = forums
  //   .map((f) => f.threads?.at(-1))
  //   .filter((id) => id)
  // const threadIds = [...forumsThreadIds, ...thisForum.threads]
  try {
    if (thisForum.threads) {
      await fetchRelatedData(thisForum.threads)
    }
  } catch (error) {
    isError.value = true
  }
  pageLoaded(emit)
}

initFetch()
</script>

<style>
.Pagination li .Control {
  @apply w-6 h-6;
}

.Pagination li .Page {
  @apply w-7 h-7 rounded-lg;
}

.Pagination li .Page.Page-active {
  @apply shadow-md border-none;
}
</style>
