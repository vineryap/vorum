<template>
  <div class="container mx-auto">
    <div v-if="pageLoadStatus_pageReady && user" class="flex-grid">
      <user-profile-card-editor v-if="edit && !isUnauthenticatedUser" :user="user" />
      <user-profile-card v-else :user="user" :isUnauthenticatedUser="isUnauthenticatedUser" />

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{ user.username }}'s recent activity</span>
          <a @click.prevent="isOnlyStartedThreads = !isOnlyStartedThreads">See only started threads</a>
        </div>

        <hr />

        <div class="activity-list">
          <user-activity-list
            v-for="(post, index) in posts"
            :key="index"
            :user="user"
            :post="post"
            :isOnlyStartedThreads="isOnlyStartedThreads"
          />
          <base-infinite-scroll
            @load="fetchUserNextPosts"
            :done="user.postsCount === posts.length"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserActivityList from '@/components/UserActivityList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import { pageLoadStatus } from '@/mixins'

export default {
  components: {
    UserActivityList,
    UserProfileCard,
    UserProfileCardEditor
  },
  props: {
    userId: { type: String, required: false },
    edit: { type: Boolean, default: false }
  },
  data() {
    return {
      isOnlyStartedThreads: false,
      allPostsLoaded: false,
      lastVisiblePost: false
    }
  },
  mixins: [pageLoadStatus],
  computed: {
    ...mapGetters({ authUser: 'auth/authUser' }),
    ...mapGetters({ getUser: 'users/user' }),
    ...mapGetters({ post: 'posts/post' }),
    isUnauthenticatedUser() {
      return !!this.userId && this.userId !== this.authUser.id
    },
    user() {
      if (this.isUnauthenticatedUser) {
        return this.getUser(this.userId)
      }
      return this.authUser
    },
    posts() {
      if (this.isOnlyStartedThreads) {
        return this.user?.threads.map(thread => this.post(thread.firstPostId))
      }
      return this.user?.posts
    },
    lastPostId() {
      if (this.posts?.length < 1) return null
      return this.posts?.at(-1).id
    }
  },
  methods: {
    ...mapActions({
      fetchAuthUserPosts: 'auth/fetchAuthUserPosts',
      fetchThreadsByIds: 'threads/fetchThreadsByIds',
      fetchForumsByIds: 'forums/fetchForumsByIds',
      fetchUsersByIds: 'users/fetchUsersByIds',
      fetchUserById: 'users/fetchUserById'
    }),
    reverseArray(array) {
      return array.reverse()
    },
    async fetchUserData() {
      const threadIds = this.posts.map((post) => post.threadId)
      if (threadIds.length > 0) {
        const threads = await this.fetchThreadsByIds({ ids: threadIds })
        const forumIds = threads.map((thread) => thread.forumId)
        const threadAuthorIds = threads.map((thread) => thread.userId)
        await this.fetchForumsByIds({ ids: forumIds })
        await this.fetchUsersByIds({ ids: threadAuthorIds })
      }
    },
    async fetchUserNextPosts() {
      console.log('fetchUserNextPosts', this.lastVisiblePost);
      this.lastVisiblePost = await this.fetchAuthUserPosts({ limitNumber: 2, lastPost: this.lastVisiblePost, paginate: true })
    }
  },
  watch: {
    allPostsLoaded() {
      if (this.posts.length) {
        console.log(this.user.postsCount === this.posts.length)
      }
    }
  },
  async created() {
    if (this.isUnauthenticatedUser) {
      await this.fetchUserById({ id: this.userId })
      await this.fetchUserPosts()
    }
    else {
      this.lastVisiblePost = await this.fetchAuthUserPosts({ paginate: true })
    }
    await this.fetchUserData()

    this.pageLoadStatus_pageLoaded()
  }
}
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
