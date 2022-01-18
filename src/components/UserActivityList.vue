<template>
  <div v-if="post && user" class="activity">
    <div class="activity-header">
      <base-avatar-image
        :src="threadAuthor.avatar"
        alt
        class="hide-mobile avatar-small"
      />
      <p v-if="thread" class="title">
        {{ thread.title }}
        <span v-if="post.isFirstPost || post.id === thread.firstPostId"
          >{{ user.username }} started a topic in {{ forum.name }}</span
        >
        <span v-if="thread.userId !== user.id">
          {{ user.username }} replied to {{ threadAuthor.username }}'s topic' in
          {{ forum.name }}
        </span>
        <span
          v-if="thread.firstPostId !== post.id && thread.userId === user.id"
        >
          {{ user.username }} replied to own topic in
          {{ forum.name }}
        </span>
      </p>
    </div>

    <div class="post-content">{{ post.text }}</div>

    <div v-if="thread" class="thread-details">
      <span>
        {{
          `${thread.repliesCount} ${formatNoun(
            thread.repliesCount,
            'comment',
            'comments'
          )}`
        }}
      </span>
      <base-time :timestamp="post.publishedAt" />
    </div>
  </div>
</template>

<script setup>
import { formatNoun } from '@/helpers'
import { mapGetters } from '@/helpers'
import { computed, toRefs } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  post: {
    type: [Object, null],
    required: true
  }
})
const { user, post } = toRefs(props)

const { forum: getForum } = mapGetters('forums')
const { thread: getThread } = mapGetters('threads')
const { user: getUser } = mapGetters('users')
const thread = computed(() => getThread.value(post.value.threadId))
const threadAuthor = computed(() => getUser.value(thread.value?.userId) || {})
const forum = computed(() => getForum.value(thread.value?.forumId) || {})
</script>

<style scoped>
.activity-list .activity {
  @apply bg-white px-4 py-3 mb-5 rounded-lg shadow;
}

@media (max-width: 720px) {
  .activity-list .activity {
    @apply px-4 py-5;
  }
}

.activity-list .activity .activity-header {
  @apply flex flex-wrap m-0 flex-initial items-start items-center sm:space-x-4;
}

.activity-list .activity .activity-header img {
  /* margin-top: 5px;
  margin-right: 10px; */
}

.activity-list .activity .activity-header .title {
  @apply flex-1;
}

/* @media (max-width: 720px) {
  .activity-list .activity .activity-header .title {
    flex-basis: 100%;
  }
} */

.activity-list .activity .activity-header .title span {
  @apply block font-thin mt-2 sm:mt-0;
}

.activity-list .activity .post-content {
  @apply block my-4 break-words;
  word-break: break-word;
}

.activity-list .activity div.post-content p {
  @apply mb-4;
}

.activity-list .activity .thread-details {
  @apply flex justify-between sm:justify-end sm:space-x-6;
}
</style>
