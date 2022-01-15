<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <ForumList v-if="pageLoadStatus_pageReady" :categoryName="category.name" :forums="forums" />
  </div>
</template>

<script>
import ForumList from '@/components/ForumList.vue'
import { mapActions, mapGetters } from 'vuex'
import { pageLoadStatus } from '@/mixins'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mixins: [pageLoadStatus],
  components: { ForumList },
  computed: {
    ...mapGetters({ getCategory: 'categories/category', getForum: 'forums/forum' }),
    category() {
      return this.getCategory(this.id)
    },
    forums() {
      if (!this.category) return []
      return this.category.forums.map((forumId) => this.getForum(forumId))
    }
  },
  methods: {
    ...mapActions({
      fetchCategoryById: 'categories/fetchCategoryById',
      fetchForumsByIds: 'forums/fetchForumsByIds',
      fetchThreadsByIds: 'threads/fetchThreadsByIds',
      fetchUsersByIds: 'users/fetchUsersByIds'
    })
  },
  async created() {
    const category = await this.fetchCategoryById({ id: this.id })

    if (category.forums.length) {
      const forums = await this.fetchForumsByIds({ ids: category.forums })
      const lastThreadIds = forums
        .map((f) => f.threads?.at(-1))
        .filter((id) => id)

      if (lastThreadIds.length) {
        const threads = await this.fetchThreadsByIds({ ids: lastThreadIds })
        const userIds = threads.map((thread) => thread.userId)
        await this.fetchUsersByIds({ ids: userIds })
      }
    }

    this.pageLoadStatus_pageLoaded()
  }
}
</script>

<style>
</style>
