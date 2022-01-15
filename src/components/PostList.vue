<template>
  <div v-for="(post, index) in posts" :key="index" class="post-list">
    <div v-if="post" class="post">
      <post-user-info :id="post.userId" />
      <div class="post-content">
        <div>
          <post-editor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
            @cancel="toggleEditMode(post.id)"
          />
          <p v-else>{{ post.text }}</p>
        </div>
        <a
          v-if="post.userId === $store.state.auth.authId"
          @click.prevent="toggleEditMode(post.id)"
          style="margin-left: auto; padding-left: 10px"
          class="link-unstyled"
          title="Edit post"
        >
          <fa-icon icon="pencil-alt" />
        </a>
      </div>
      <!-- <div class="flex justify-between w-full items-end mt-10 pt-2 text-gray-500 items-center"> -->
      <div v-if="post.publishedAt" class="post-date">
        <base-time :timestamp="post.publishedAt" />
      </div>
      <div class="reactions" v-if="post.reactions">
        <ul>
          <li>💡</li>
          <li>❤️</li>
          <li>👎</li>
          <li>👍</li>
          <li>👌</li>
        </ul>

        <button class="btn-xsmall" v-for="(item, index) in post.reactions" :key="index">
          <span class="emoji">{{ index }}</span>
          ️ {{ index.length }}
        </button>
        <button class="btn-xsmall">
          👍
          <i class="fa fa-smile-o emoji"></i>
        </button>
      </div>
      <div class="reactions" v-else>
        <button class="btn-xsmall">
          👍
          <i class="fa fa-smile-o emoji"></i>
        </button>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import PostEditor from './PostEditor.vue'
import PostUserInfo from './PostUserInfo.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editing: null
    }
  },
  components: {
    PostUserInfo,
    PostEditor
  },
  computed: {
    ...mapGetters({ authUser: 'auth/authUser' })
  },
  methods: {
    ...mapActions({ updatePost: 'posts/updatePost' }),
    toggleEditMode(id) {
      this.editing = id === this.editing ? null : id
    },
    handleUpdate(event) {
      this.updatePost(event.post)
      this.editing = null
    }
  }
}
</script>

<style scoped>
.post-list {
  @apply mt-5;
}

.post {
  @apply flex flex-wrap justify-between py-5 px-2.5 pb-2 shadow mb-5 bg-white rounded-xl overflow-hidden;
}

@media (max-width: 820px) {
  .post {
    @apply p-0;
  }
}

.post .post-date {
  @apply basis-full text-sm text-right mb-2 pr-2;
}

@media (max-width: 820px) {
  .post .post-date {
    @apply -order-1 basis-2/5 bg-gray-100 mb-0 pr-2.5 pt-4;
  }
}

@media (max-width: 720px) {
  .post {
    padding: 0px;
  }
}

.post-content {
  @apply pt-5 lg:pt-0 flex flex-grow flex-shrink-0 basis-[83%] pl-4 pr-3 text-base text-justify break-words;
}

.post-content h1,
.post-content h2,
.post-content h3 {
  @apply mb-0;
}

.post-content p {
  @apply mb-5;
}

.post-content pre {
  @apply grid overflow-auto break-words rounded p-[10px];
}

.post-content blockquote {
  margin: 25px 0px;
}

.post-content blockquote.big {
  display: flex;
  position: relative;
}

.post-content blockquote.big::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.big::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.big .quote {
  padding-left: 20px;
  padding-right: 15px;
  flex-basis: 95%;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.big .author {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.post-content blockquote.big .author img {
  flex: 1;
  flex-basis: 100%;
  margin-top: 10px;
  width: 80px;
  height: 80px;
}

.post-content blockquote.small {
  display: flex;
  position: relative;
  flex-direction: column;
  border: 2px solid rgba(152, 152, 152, 0.15);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.post-content blockquote.small::before {
  position: absolute;
  top: -20px;
  left: -20px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.small::before {
    top: -18px;
    left: -15px;
    font-size: 32px;
  }
}

.post-content blockquote.small .author {
  display: flex;
  flex-basis: 100%;
  padding: 3px 10px 3px 28px;
  background-color: rgba(152, 152, 152, 0.15);
  justify-content: center;
  align-items: center;
}

.post-content blockquote.small .author .time {
  margin-left: 10px;
}

.post-content blockquote.small .author .fa {
  margin-left: auto;
  font-size: 20px;
}

.post-content blockquote.small .author .fa:hover {
  cursor: pointer;
}

.post-content blockquote.small .quote {
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  padding: 10px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
}

.post-content blockquote.simple {
  position: relative;
  padding: 0px 10px 0px 20px;
  font-weight: 100;
  font-style: italic;
  font-size: 17px;
  letter-spacing: 0.15px;
}

.post-content blockquote.simple::before {
  position: absolute;
  top: -25px;
  left: -25px;
  font-size: 42px;
  font-family: FontAwesome;
  content: "\f10e";
  color: #263959;
}

@media (max-width: 820px) {
  .post-content blockquote.simple::before {
    top: -15px;
    left: -18px;
    font-size: 32px;
  }
}

.post-content blockquote.simple .author {
  display: block;
  margin-top: 10px;
  font-weight: normal;
}

.post-content blockquote.simple .author .time {
  margin-left: 10px;
}

.post-listing-editor {
  flex: 1 1 83%;
}

.reactions {
  display: flex;
  justify-content: flex-end;
  flex: 100%;
  position: relative;
}

.reactions button {
  display: flex;
  align-items: center;
  padding: 5px 8px;
  margin-left: 2px;
  color: #545454;
  border-radius: 5px;
}

.reactions button:hover {
  background: rgba(115, 192, 151, 0.25) !important;
  color: #545454 !important;
}

.reactions button.active-reaction {
  background: rgba(115, 192, 151, 0.12);
}

.reactions button.active-reaction:hover {
  background: white !important;
}

.reactions button .emoji {
  margin-left: 3px;
  font-size: 18px;
}

.reactions button.add-reaction .emoji {
  margin-left: 3px;
  margin-right: 0px;
}

.reactions ul {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  top: -45px;
  background-color: white !important;
}

.reactions ul li {
  font-size: 28px;
  display: flex;
  align-items: center;
  padding: 0px 5px;
  opacity: 0.7;
}

.reactions ul li:hover {
  opacity: 1;
  border-radius: 5px;
  cursor: pointer;
}
</style>
