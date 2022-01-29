<template>
  <div class="container mx-auto">
    <div v-if="isPageReady" class="col-full push-top">
      <base-head>
        <title>{{ forum?.name }} | New Thread</title>
        <meta property="og:title" :content="forum?.name" />
        <meta name="twitter:title" :content="forum?.name" />
      </base-head>
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
import { mapGetters } from '@/helpers'
import usePageLoadStatus from '@/composables/usePageLoadStatus'
import { computed, ref, toRefs } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const { isPageReady, pageLoaded } = usePageLoadStatus()
const emit = defineEmits(['pageReady'])

const formIsDirty = ref(false)
const props = defineProps({ forumId: { type: String, required: true } })
const { forumId } = toRefs(props)

const { forum: getForum } = mapGetters('forums')
const forum = computed(() => getForum.value(forumId.value))

async function save(threadData) {
  const thread = await store.dispatch('threads/createThread', {
    ...threadData,
    forumId: forumId.value
  })
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
  await store.dispatch('forums/fetchForumById', {
    id: forumId.value
  })
  pageLoaded(emit)
}
initFetch()
</script>

<style></style>
