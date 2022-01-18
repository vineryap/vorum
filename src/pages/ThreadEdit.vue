<template>
  <div v-if="!isError" class="container mx-auto">
    <div v-if="isPageReady" class="col-full push-top">
      <h1>
        Editing
        <i>{{ thread.title }}</i>
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
  <base-error-fallback v-else />
</template>

<script setup>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { mapActions, mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, ref, toRefs } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

const isError = ref(false)
const formIsDirty = ref(false)
const props = defineProps({ id: { type: String, required: true } })
const { id } = toRefs(props)

const { thread: getThread } = mapGetters('threads')
const { post: getPost } = mapGetters('posts')
const thread = computed(() => getThread.value(id.value))
const content = computed(() => getPost.value(thread.value.firstPostId)?.text)

const { updateThread } = mapActions('threads')
const { fetchThreadById } = mapActions('threads')
const { fetchPostById } = mapActions('posts')
async function save(threadData) {
  await updateThread({ ...threadData, id: id.value })
  redirectToThread()
}
function cancel() {
  redirectToThread()
}
function redirectToThread() {
  router.push({ name: 'Thread', params: { id: id.value } })
}

onBeforeRouteLeave(() => {
  if (formIsDirty.value) {
    const confirmed = confirm(
      'Any unsaved changes will be lost! Are you sure want to leave?'
    )
    if (!confirmed) return false
  }
})

async function initFetch() {
  const thisThread = await fetchThreadById({ id: id.value })
  if (!thisThread) return router.push({ name: 'NotFound' })
  try {
    await fetchPostById({ id: thisThread.posts[0] })
  } catch (error) {
    isError.value = true
  }
  pageLoaded(emit)
}
initFetch()
</script>

<style></style>
