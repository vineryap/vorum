<template>
  <ul class="breadcrumbs">
    <li>
      <router-link :to="{ name: 'Home' }">
        <fa-icon icon="home" />Home
      </router-link>
    </li>
    <li v-if="category">
      <router-link :to="{ name: 'Category', params: { id: category.id } }">
        {{
          category.name
        }}
      </router-link>
    </li>
    <li v-if="forum" class="active">
      <router-link :to="{ name: 'Forum', params: { id: forum.id } }">
        {{
          forum.name
        }}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getForum: 'forums/forum',
      getCategory: 'categories/category'
    }),
    forum() {
      return this.getForum(this.forumId)
    },
    category() {
      if (!this.forum) return null
      return this.getCategory(this.forum.categoryId)
    }
  }
}
</script>

<style>
</style>
