<template>
  <div class="flex flex-col flex-wrap sm:flex-row">
    <category-list v-if="pageLoadStatus_pageReady" :categories="categories" />
  </div>

  <!-- <div class="container">
    <div class="col-full">
      <category-list v-if="pageLoadStatus_pageReady" :categories="categories" />
    </div>
  </div>-->
</template>

<script>
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'
import { pageLoadStatus } from '@/mixins'

export default {
  components: {
    CategoryList
  },
  mixins: [pageLoadStatus],
  computed: {
    categories() {
      return this.$store.state.categories.items
    }
  },
  methods: {
    ...mapActions({
      fetchCategories: 'categories/fetchCategories',
      fetchForumsByIds: 'forums/fetchForumsByIds',
      fetchThreadsByIds: 'threads/fetchThreadsByIds',
      fetchUsersByIds: 'users/fetchUsersByIds'
    })
  },
  async created() {
    const categories = await this.fetchCategories()
    const forumIds = categories.map((category) => category.forums).flat()
    const forums = await this.fetchForumsByIds({ ids: forumIds })
    const lastThreadIds = forums
      .map((f) => f.threads?.at(-1))
      .filter((id) => id)
    const threads = await this.fetchThreadsByIds({ ids: lastThreadIds })
    const userIds = threads.map((thread) => thread.userId)
    await this.fetchUsersByIds({ ids: userIds })
    this.pageLoadStatus_pageLoaded()
  }
}
</script>

<style>
</style>
