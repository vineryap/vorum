<template>
  <div v-if="post && user" class="activity">
    <div class="activity-header">
      <base-avatar-image :src="threadAuthor.avatar" alt class="hide-mobile avatar-small" />
      <p v-if="thread" class="title">
        {{ thread.title }}
        <span
          v-if="post.isFirstPost || (post.id === thread.firstPostId)"
        >{{ user.username }} started a topic in {{ forum.name }}</span>
        <span v-if="thread.userId !== user.id">
          {{ user.username }} replied to {{ threadAuthor.username }}'s topic'
          in {{ forum.name }}
        </span>
        <span v-if="thread.firstPostId !== post.id && thread.userId === user.id">
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
  <!-- <div class="activity">
          <div class="activity-header">
            <base-avatar-image
              :src="http://i.imgur.com/s0AzOkO.png"
              alt=""
              class="hide-mobile avatar-small"
            />

            <p class="title">
              Wasabi vs horseraddish?
              <span>Joker replied to Robin's topic in Cooking</span>
            </p>
          </div>

          <div class="post-content">
            <div>
              <blockquote class="small">
                <div class="author">
                  <a href="/user/robin" class=""> robin</a>
                  <span class="time">a month ago</span>
                  <i class="fa fa-caret-down"></i>
                </div>

                <div class="quote">
                  <p>
                    Is horseradish and Wasabi the same thing? I&amp;#39;ve heard
                    so many different things.
                  </p>
                </div>
              </blockquote>

              <p>They're not the same!</p>
            </div>
          </div>

          <div class="thread-details">
            <span>2 days ago</span>
            <span>1 comment</span>
          </div>
        </div>

        <div class="activity">
          <div class="activity-header">
            <img
              src="https://i.imgur.com/OqlZN48.jpg"
              alt=""
              class="hide-mobile avatar-small"
            />
            <p class="title">
              Where is the sign in button??????!?!?!?!
              <span
                >Joker replied to his own topic in Questions &amp;
                Feedback</span
              >
            </p>
          </div>

          <div class="post-content">
            <div>
              <p>
                <strong
                  ><i>Post deleted due to inappropriate language</i></strong
                >
              </p>
            </div>
          </div>

          <div class="thread-details">
            <span>7 days ago</span>
            <span>7 comments</span>
          </div>
  </div>-->
</template>

<script>
import { formatNoun } from '@/helpers'
import { mapGetters } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    post: {
      type: [Object, null],
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getForum: 'forums/forum',
      getThread: 'threads/thread',
      getUser: 'users/user'
    }),
    thread() {
      return this.getThread(this.post.threadId)
    },
    threadAuthor() {
      return this.getUser(this.thread?.userId) || {}
    },
    forum() {
      return this.getForum(this.thread?.forumId) || {}
    }
  },
  methods: {
    formatNoun
  }
}
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
