<template>
  <div class="container mx-auto">
    <div v-if="isPageReady" class="col-full push-top">
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

<script setup>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { mapActions, mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, ref, toRefs } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const router = useRouter()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

const formIsDirty = ref(false)
const props = defineProps({ forumId: { type: String, required: true } })
const { forumId } = toRefs(props)

const { forum: getForum } = mapGetters('forums')
const forum = computed(() => getForum.value(forumId.value))

const { createThread } = mapActions('threads')
const { fetchForumById } = mapActions('forums')
async function save(threadData) {
  const thread = await createThread({ ...threadData, forumId: forumId.value })
  router.push({ name: 'Thread', params: { id: thread.id } })
}
function cancel() {
  router.push({ name: 'Forum', params: { id: forumId.value } })
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
  await fetchForumById({
    id: forumId.value
  })
  pageLoaded(emit)
}
initFetch()
</script>

<style></style>
