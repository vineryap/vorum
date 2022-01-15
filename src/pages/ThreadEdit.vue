<template>
  <div class="container">
    <div v-if="pageLoadStatus_pageReady" class="col-full push-top">
      <h1>
        Editing <i>{{ thread.title }}</i>
      </h1>
      <thread-editor
        :title="thread.title"
        :content="content"
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
    id: {
      type: String,
      required: true
    }
  },
  mixins: [pageLoadStatus],
  data () {
    return {
      formIsDirty: false
    }
  },
  computed: {
    ...mapGetters({ getThread: 'threads/thread', getPost: 'posts/post' }),
    thread () {
      return this.getThread(this.id)
    },
    content () {
      return this.getPost(this.thread.firstPostId)?.text
    }
  },
  methods: {
    ...mapActions({
      updateThread: 'threads/updateThread',
      fetchThreadById: 'threads/fetchThreadById',
      fetchPostById: 'posts/fetchPostById'
    }),
    async save (threadData) {
      await this.updateThread({ ...threadData, id: this.id })
      this.redirectToThread()
    },
    cancel () {
      this.redirectToThread()
    },
    redirectToThread () {
      this.$router.push({ name: 'Thread', params: { id: this.id } })
    }
  },
  async created () {
    const thread = await this.fetchThreadById({ id: this.id })
    await this.fetchPostById({ id: thread.posts[0] })
    this.pageLoadStatus_pageLoaded()
  },
  beforeRouteLeave () {
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
