<template>
  <div v-if="user" class="user-info">
    <router-link
      :to="{
        name: authUser.id === user.id ? 'Profile' : 'UserProfile',
        params: authUser.id === user.id ? null : { userId: user.id }
      }"
      class="user-name"
      >{{ user.username }}</router-link
    >
    <router-link
      :to="{
        name: authUser.id === user.id ? 'Profile' : 'UserProfile',
        params: authUser.id === user.id ? null : { userId: user.id }
      }"
      class="mr-2.5"
    >
      <base-avatar-image
        class="avatar-large shadow"
        :src="user.avatar"
        :alt="user.username + ' avatar'"
      />
    </router-link>
    <p class="desktop-only text-small">
      {{ `${user.postsCount} ${formatNoun(user.postsCount, 'post', 'posts')}` }}
    </p>
    <p class="desktop-only text-small">
      {{
        `${user.threadsCount} ${formatNoun(
          user.threadsCount,
          'thread',
          'threads'
        )}`
      }}
    </p>
    <!-- <span class="online desktop-only">online</span> -->
  </div>
</template>

<script setup>
import { formatNoun, mapGetters } from '@/helpers'
import { computed, toRefs } from 'vue'

const props = defineProps({ id: { type: String, required: true } })
const { id } = toRefs(props)

const { authUser } = mapGetters('auth')
const { user: getUser } = mapGetters('users')
const user = computed(() => getUser.value(id.value))
</script>

<style scoped>
.post .user-info {
  @apply flex flex-col items-center justify-start text-center flex-grow flex-shrink basis-[15%] mr-[5px];
}

.post .user-info > * {
  @apply mb-2.5;
}

@media (max-width: 820px) {
  .post .user-info {
    @apply bg-gray-100 -order-2 flex-row justify-start mr-0 p-[5px] pl-[10px] text-left;
  }

  .post .user-info .avatar-large {
    @apply order-1 h-[35px] w-[35px];
  }

  .post .user-info .user-name {
    @apply order-2 break-words max-w-32;
  }

  .post .user-info > * {
    @apply mb-0;
  }
}
</style>
