<template>
  <div class="container mx-auto pb-26">
    <div v-if="isPageReady" class="push-top md:mx-20 xl:mx-30">
      <base-head>
        <title>{{ thread?.title }} | Vorum</title>
        <meta property="og:title" :content="thread?.title" />
        <meta name="twitter:title" :content="thread?.title" />
      </base-head>
      <the-breadcrumbs :forum-id="thread.forumId" />
      <h1>
        {{ thread.title }}
        <router-link
          v-if="thread.userId === authUser?.id"
          :to="{ name: 'ThreadEdit', params: { id } }"
          class="inline-flex align-bottom"
          title="Edit thread"
        >
          <IconFaPencil class="w-7 ml-4" />
        </router-link>
      </h1>
      <p>
        By
        <router-link
          :to="{
            name: authUser.id === thread.userId ? 'ProfilePage' : 'UserProfile',
            params:
              authUser.id === thread.userId ? null : { userId: thread.userId }
          }"
          class="link-unstyled"
          >{{ thread.authorName }}</router-link
        >, <base-time :timestamp="thread.publishedAt" />.
        <span
          style="float: right; margin-top: 2px"
          class="hide-mobile text-faded text-small"
        >
          {{
            `${thread.repliesCount} ${formatNoun(
              thread.repliesCount,
              'reply',
              'replies'
            )} by ${thread.contibutorsCount} ${formatNoun(
              thread.contibutorsCount,
              'contributor',
              'contributors'
            )}`
          }}
        </span>
      </p>
      <post-list :posts="posts" />
      <post-editor v-if="authUser" @save="submitNewPost" />
      <div v-else class="text-center" style="margin-bottom: 50px">
        Please
        <router-link
          :to="{ name: 'LoginPage', query: { redirectTo: $route.path } }"
          >Sign In</router-link
        >or
        <router-link
          :to="{ name: 'RegisterPage', query: { redirectTo: $route.path } }"
          >Register</router-link
        >to reply.
      </div>
    </div>
    <!-- <base-error-fallback v-else /> -->
  </div>
</template>

<script setup>
import IconFaPencil from '~icons/fa-solid/pencil-alt'
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import { formatNoun, mapActions, mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import useNotifications from '@/composables/useNotifications'
import { useRouter } from 'vue-router'
import { computed, ref, toRefs } from 'vue'
import { difference } from 'lodash'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const { addNotification } = useNotifications()
const emit = defineEmits(['pageReady'])

const isError = ref(false)
const props = defineProps({ id: { type: String, required: true } })
const { id } = toRefs(props)

const { authUser } = mapGetters('auth')
const { thread: getThread } = mapGetters('threads')
const { post: getPost } = mapGetters('posts')
const thread = computed(() => getThread.value(id.value))
const posts = computed(() => {
  if (!thread.value) return []
  return thread.value.posts.map((postId) => getPost.value(postId))
})
const { fetchCategoryById } = mapActions('categories')
const { fetchForumById } = mapActions('forums')
const { fetchThreadById } = mapActions('threads')
const { fetchPostsByIds, createPost } = mapActions('posts')
const { fetchUsersByIds } = mapActions('users')
async function submitNewPost({ post }) {
  await createPost({ ...post, threadId: id.value })
}
async function fetchPostsAndUsers(ids) {
  const posts = await fetchPostsByIds({
    ids,
    onSnapshotFn: ({ isLocal, previousDoc }) => {
      if (
        !isPageReady.value ||
        isLocal ||
        (previousDoc?.edited && !previousDoc?.edited?.at)
      )
        return
      addNotification({ message: 'Thread updated', timeout: 5000 })
    }
  })

  const postUserIds = posts
    .map((post) => post.userId)
    .concat(thread.value.userId)

  await fetchUsersByIds({ ids: postUserIds })
}

async function initFetch() {
  const thread = await fetchThreadById({
    id: id.value,
    onSnapshotFn: async ({ isLocal, currentDoc, previousDoc }) => {
      if (!isPageReady.value || isLocal || !previousDoc.lastPostAt) return
      const newPostIds = difference(currentDoc.posts, previousDoc.posts)
      if (newPostIds.length > 0) {
        await fetchPostsAndUsers(newPostIds)
      } else {
        addNotification({ message: 'Thread updated', timeout: 5000 })
      }
    }
  })

  if (!thread) {
    router.push({ name: 'NotFound' })
  }

  try {
    console.log('init')
    await fetchPostsAndUsers(thread.posts)
    const forum = await fetchForumById({ id: thread.forumId })
    await fetchCategoryById({ id: forum.categoryId })
  } catch (error) {
    isError.value = true
  }
  pageLoaded(emit)
}
initFetch()
</script>

<style></style>
