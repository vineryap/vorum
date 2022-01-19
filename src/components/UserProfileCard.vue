<template>
  <div class="col-3 push-top">
    <div class="profile-card">
      <p class="text-center">
        <base-avatar-image
          :src="user.avatar"
          :alt="`${user.username} avatar`"
          class="avatar-xlarge"
        />
      </p>

      <h1 class="title leading-tight">{{ user.username }}</h1>

      <h2 class="text-lead">{{ user.name }}</h2>

      <p class="text-justify">{{ user.bio || 'No bio specified.' }}</p>

      <!-- <span class="online">{{ user.username }} is online</span> -->

      <div class="stats">
        <span>
          {{
            `${user.postsCount} ${formatNoun(user.postsCount, 'post', 'posts')}`
          }}
        </span>
        <span>
          {{
            `${user.threadsCount} ${formatNoun(
              user.threadsCount,
              'thread',
              'threads'
            )}`
          }}
        </span>
      </div>

      <hr v-if="user.website" />

      <p v-if="user.website" class="text-large text-center">
        <i class="fa fa-globe"></i>
        <a target="_blank" rel="external" :href="user.website">{{
          user.website
        }}</a>
      </p>
    </div>
    <div class="text-gray-500 text-center mb-4 sm:mr-5">
      <p v-if="user.registeredAt" class="text-sm">
        Member since
        <base-date :timestamp="user.registeredAt" />
      </p>

      <p v-if="user.lastVisitAt" class="text-sm">
        Last visited
        <!-- <base-time :timestamp="user.lastVisitAt" /> -->
      </p>
    </div>

    <div v-if="!isUnauthenticatedUser" class="text-center sm:mr-5">
      <hr />
      <router-link :to="{ name: 'ProfileEdit' }" class="btn-green btn-small"
        >Edit Profile</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { formatNoun } from '@/helpers'
import { toRefs } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isUnauthenticatedUser: {
    type: Boolean,
    required: true
  }
})

const { user, isUnauthenticatedUser } = toRefs(props)
</script>

<style></style>
