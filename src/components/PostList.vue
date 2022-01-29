<template>
  <div v-for="(post, index) in posts" :key="index" class="post-list">
    <div v-if="post" class="post">
      <post-user-info :id="post.userId" />
      <div class="post-content">
        <div class="w-full">
          <post-editor
            v-if="editing === post.id"
            :post="post"
            @save="handleUpdate"
            @cancel="toggleEditMode(post.id)"
          />
          <p v-else>{{ post.text }}</p>
        </div>
        <div
          class="ml-auto pl-3 mb-1 xl:mb-0 flex flex-row space-x-3 xl:space-y-0 items-end xl:flex-col xl:space-y-2"
        >
          <a
            v-if="post.userId === $store.state.auth.authId"
            class="link-unstyled"
            title="Edit post"
            @click.prevent="toggleEditMode(post.id)"
          >
            <IconFaPencil class="w-4" />
          </a>
          <a
            v-if="post.userId === $store.state.auth.authId && index > 0"
            class="link-unstyled hover:text-red-500"
            title="Edit post"
            @click.prevent="deletePostHandler(post)"
          >
            <IconFaTrash class="w-4" />
          </a>
        </div>
      </div>

      <div v-if="post.publishedAt" class="post-date">
        <base-time :timestamp="post.publishedAt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import IconFaPencil from '~icons/fa-solid/pencil-alt'
import IconFaTrash from '~icons/fa-solid/trash'
import PostEditor from './PostEditor.vue'
import PostUserInfo from './PostUserInfo.vue'
import { ref, toRefs } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({ posts: { type: Array, required: true } })
const { posts } = toRefs(props)
const editing = ref(null)

function toggleEditMode(id) {
  editing.value = id === editing.value ? null : id
}
function handleUpdate(event) {
  store.dispatch('posts/updatePost', event.post)
  editing.value = null
}

async function deletePostHandler(post) {
  const confirmed = confirm(
    'This action is irreversible. Continue to delete post?'
  )
  if (confirmed) await store.dispatch('posts/deletePost', { post })
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
  content: '\f10e';
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
  content: '\f10e';
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
  content: '\f10e';
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
