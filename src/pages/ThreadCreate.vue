<template>
  <div class="container">
    <div v-if="pageLoadStatus_pageReady" class="col-full push-top">
      <h1>
        Create new thread in
        <i>{{ forum.name }}</i>
      </h1>
      <thread-editor
        @save="save"
        @cancel="cancel"
        @dirty="formIsDirty = true"
        @clean="formIsDirty = false"
      />
    </div>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { mapActions, mapGetters } from 'vuex'
import { pageLoadStatus } from '@/mixins'
export default {
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  mixins: [pageLoadStatus],
  data() {
    return {
      formIsDirty: false
    }
  },
  computed: {
    ...mapGetters({ getForum: 'forums/forum' }),
    forum() {
      return this.getForum(this.forumId)
    }
  },
  methods: {
    ...mapActions(['threads/createThread', 'forums/fetchForumById']),
    async save(threadData) {
      const thread = await this['threads/createThread']({
        ...threadData,
        forumId: this.forumId
      })
      this.$router.push({ name: 'Thread', params: { id: thread.id } })
    },
    cancel() {
      this.$router.push({ name: 'Forum', params: { id: this.forumId } })
    }
  },
  async created() {
    await this['forums/fetchForumById']({ id: this.forumId })
    this.pageLoadStatus_pageLoaded()
  },
  beforeRouteLeave() {
    if (this.formIsDirty) {
      const confirmed = confirm(
        'Any unsaved changes will be lost! Are you sure want to leave?'
      )
      if (!confirmed) return false
    }
  }
}
</script>

<style>
</style>
