<template>
  <div class="container mx-auto">
    <div v-if="isPageReady && user" class="flex-grid">
      <user-profile-card-editor
        v-if="edit && !isUnauthenticatedUser"
        :user="user"
      />
      <user-profile-card
        v-else
        :user="user"
        :is-unauthenticated-user="isUnauthenticatedUser"
      />

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{ user.username }}'s recent activity</span>
        </div>

        <hr />

        <div class="activity-list">
          <user-activity-list
            v-for="(post, index) in posts"
            :key="index"
            :user="user"
            :post="post"
            :is-only-started-threads="isOnlyStartedThreads"
          />
          <base-infinite-scroll
            :done="isAllPostLoaded"
            @load="fetchUserNextPosts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { mapGetters, mapActions } from '@/helpers'
import UserActivityList from '@/components/UserActivityList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { ref, computed, toRefs } from 'vue'

const { isPageReady, pageLoaded } = usePageLoadStatus()

const props = defineProps({
  userId: { type: String, required: false, default: null },
  edit: { type: Boolean, default: false }
})
const { userId, edit } = toRefs(props)
const emit = defineEmits(['pageReady'])

const isOnlyStartedThreads = ref(false)
const lastVisiblePost = ref(null)

const { authUser } = mapGetters('auth')
const { user: getUser } = mapGetters('users')
const { fetchAuthUserPosts } = mapActions('auth')
const { fetchThreadsByIds } = mapActions('threads')
const { fetchForumsByIds } = mapActions('forums')
const { fetchUserById, fetchUsersByIds, fetchUserPostsByQuery } =
  mapActions('users')

const isUnauthenticatedUser = computed(
  () => !!userId.value && userId.value !== authUser.value.id
)

const user = computed(() => {
  if (isUnauthenticatedUser.value) {
    return getUser.value(userId.value)
  }
  return authUser.value
})

const posts = computed(() => user.value.posts)

const isAllPostLoaded = computed(
  () => user.value.postsCount === posts.value.length
)

async function fetchUserActivity() {
  const options = { paginate: true }
  if (lastVisiblePost.value) options.lastPost = lastVisiblePost.value

  if (isUnauthenticatedUser.value) {
    if (!user.value) {
      await fetchUserById({ id: userId.value })
    }
    options.userId = userId.value
    lastVisiblePost.value = await fetchUserPostsByQuery({
      userId: userId.value,
      additionalContraints: options
    })
    console.log(lastVisiblePost.value)
  } else {
    lastVisiblePost.value = await fetchAuthUserPosts({ ...options })
  }
  await fetchRelatedData()
}

const fetchUserNextPosts = async () => {
  await fetchUserActivity()
}

async function fetchRelatedData() {
  const threadIds = posts.value.map((post) => post.threadId)
  if (threadIds.length) {
    const threads = await fetchThreadsByIds({ ids: threadIds })
    const forumIds = threads.map((thread) => thread.forumId)
    const threadAuthorIds = threads.map((thread) => thread.userId)
    await fetchForumsByIds({ ids: forumIds })
    await fetchUsersByIds({ ids: threadAuthorIds })
  }
}

const initFetch = async () => {
  await fetchUserActivity()
  pageLoaded(emit)
}
initFetch()
</script>

<style>
.profile-card {
  @apply flex flex-col items-center bg-white p-5 mb-4 shadow space-y-4 sm:mr-5 rounded-lg;
}

.profile-card img {
  @apply shadow-lg mb-5;
}

.profile-card .title {
  @apply break-all;
}

.profile-card .stats {
  @apply flex w-full mt-5;
}

.profile-card .stats span {
  @apply basis-1/2 text-xl;
}

.profile-card .user-website {
  @apply flex justify-center items-baseline;
}

.profile-header {
  @apply flex flex-wrap sm:flex-row items-baseline justify-between p-0;
}
</style>
