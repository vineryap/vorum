<template>
  <div class="container mx-auto">
    <div v-if="pageLoadStatus_pageReady" class="push-top">
      <the-breadcrumbs :forumId="thread.forumId" />
      <h1>
        {{ thread.title }}
        <router-link
          v-if="thread.userId === authUser?.id"
          :to="{ name: 'ThreadEdit', params: { id } }"
          title="Edit thread"
        >
          <fa-icon icon="pencil-alt" />
        </router-link>
      </h1>
      <p>
        By
        <a href="#" class="link-unstyled capitalize">{{ thread.authorName }}</a>,
        <base-time :timestamp="thread.publishedAt" />.
        <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
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
        <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }">Sign In</router-link>or
        <router-link :to="{ name: 'Register', query: { redirectTo: $route.path } }">Register</router-link>to reply.
      </div>
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import { formatNoun } from '@/helpers'
import { mapActions, mapGetters } from 'vuex'
import { pageLoadStatus } from '@/mixins'
import useNotifications from '@/composables/useNotifications'
import { difference } from 'lodash'

export default {
  setup() {
    const { addNotification } = useNotifications()
    return { addNotification }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    PostList,
    PostEditor,
    TheBreadcrumbs
  },
  mixins: [pageLoadStatus],
  computed: {
    ...mapGetters({
      authUser: 'auth/authUser',
      getThread: 'threads/thread',
      getPost: 'posts/post'
    }),
    thread() {
      return this.getThread(this.id)
    },
    posts() {
      if (!this.thread) return []
      return this.thread.posts.map((postId) => this.getPost(postId))
    }
  },
  methods: {
    formatNoun,
    ...mapActions({
      fetchCategoryById: 'categories/fetchCategoryById',
      fetchForumById: 'forums/fetchForumById',
      fetchThreadById: 'threads/fetchThreadById',
      createPost: 'posts/createPost',
      fetchPostsByIds: 'posts/fetchPostsByIds',
      fetchUsersByIds: 'users/fetchUsersByIds'
    }),
    async submitNewPost({ post }) {
      await this.createPost({ ...post, threadId: this.id })
    },
    async fetchPostsAndUsers(ids) {
      const posts = await this.fetchPostsByIds({
        ids,
        onSnapshotFn: ({ previousDoc, isLocal }) => {
          if (
            !this.pageLoadStatus_pageReady ||
            isLocal ||
            (previousDoc?.edited && !previousDoc?.edited?.at)
          ) {
            return
          }
          this.addNotification({ message: 'Thread updated', timeout: 5000 })
        }
      })

      const postUserIds = posts
        .map((post) => post.userId)
        .concat(this.thread.userId)

      await this.fetchUsersByIds({ ids: postUserIds })
    }
  },
  async created() {
    const thread = await this.fetchThreadById({
      id: this.id,
      onSnapshotFn: async ({ data, previousDoc, isLocal }) => {
        if (
          !this.pageLoadStatus_pageReady ||
          isLocal ||
          !previousDoc.lastPostAt
        ) {
          return
        }

        const newPostIds = difference(data.posts, previousDoc.posts)
        if (newPostIds.length > 0) {
          await this.fetchPostsAndUsers(newPostIds)
        } else { this.addNotification({ message: 'Thread updated', timeout: 5000 }) }
      }
    })

    const forum = await this.fetchForumById({ id: thread.forumId })

    await this.fetchCategoryById({ id: forum.categoryId })

    await this.fetchPostsAndUsers(thread.posts)

    this.pageLoadStatus_pageLoaded()
  }
}
</script>

<style>
</style>
