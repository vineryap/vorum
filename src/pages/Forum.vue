<template>
  <div v-if="isPageReady && !isError" class="w-full">
    <base-head>
      <title>{{ forum?.name }} | Vorum</title>
      <meta property="og:title" :content="forum?.name" />
      <meta name="twitter:title" :content="forum?.name" />
    </base-head>
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
import { mapGetters, mapState } from '@/helpers'
import { useRoute, useRouter } from 'vue-router'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import ThreadList from '@/components/ThreadList.vue'
import { useStore } from 'vuex'

const store = useStore()
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
const { forum: getForum } = mapGetters('forums')
const { thread: getThread } = mapGetters('threads')
const forum = computed(() => {
  return getForum.value(id.value)
})

const threads = computed(() => {
  if (!allThreads.value.length) return []
  return allThreads.value
    .filter((thread) => thread.forumId === forum.value.id)
    .map((thread) => getThread.value(thread.id))
})

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
  const threads = await store.dispatch('threads/fetchThreadsByPage', {
    ids: forumThreadIds,
    page: pagination.page,
    perPage: pagination.perPage
  })
  const lastPostIds = threads.map((thread) => thread.lastPostId)
  const lastPosts = await store.dispatch('posts/fetchPostsByIds', {
    ids: lastPostIds
  })
  const lastPostUserIds = lastPosts.map((post) => post.userId)
  const threadsUserIds = threads.map((thread) => thread.userId)
  const userIds = [...lastPostUserIds, ...threadsUserIds]
  await store.dispatch('users/fetchUsersByIds', { ids: userIds })
}

async function initFetch() {
  const thisForum = await store.dispatch('forums/fetchForumById', {
    id: id.value
  })
  if (!thisForum) {
    router.push({ name: 'NotFound' })
  }
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
