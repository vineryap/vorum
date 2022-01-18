<template>
  <ForumList
    v-for="(category, index) in categories"
    :key="index"
    :category-id="category.id"
    :category-name="category.name"
    :forums="getForums(category.forums)"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import ForumList from './ForumList.vue'

export default {
  components: {
    ForumList
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters({ getForum: 'forums/forum' })
  },
  methods: {
    getForums(forumIds) {
      if (!forumIds) return []
      return forumIds.map((forumId) => this.getForum(forumId))
    }
  }
}
</script>

<style></style>
