<template>
  <div class="w-full mx-auto" sm="container">
    <div class="mb-4 mx-0">
      <div
        class="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow"
      >
        <div class="px-4 py-5 sm:px-6 border-b w-full break-words">
          <h2 class="font-medium text-gray-900 dark:text-white">
            <router-link
              v-if="categoryId"
              :to="{ name: 'Category', params: { id: categoryId } }"
              >{{ categoryName }}</router-link
            >
            <span v-else>{{ categoryName }}</span>
          </h2>
          <p
            v-if="categoryDescription"
            class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200"
          >
            {{ categoryDescription }}
          </p>
        </div>
        <ul class="flex flex-col divide-y w-full">
          <li
            v-for="(forum, index) in forums"
            :key="index"
            class="forum-list flex flex-row"
            sm="px-5"
          >
            <div
              v-if="forum"
              class="flex flex-1 items-center p-4 content-center"
            >
              <div class="sm:basis-1/2 pl-1 sm:mr-16 break-all">
                <h3 class="forum-title font-medium dark:text-white">
                  <router-link
                    :to="{ name: 'Forum', params: { id: forum.id } }"
                    >{{ forum.name }}</router-link
                  >
                </h3>
                <p
                  v-if="forum.description"
                  class="mt-1 max-w-2xl text-sm xl:text-base text-gray-500 dark:text-gray-200"
                >
                  {{ forum.description }}
                </p>
              </div>
              <div
                class="basis-1/8 items-center text-right text-sm sm:text-base 2xl:text-lg dark:text-gray-300 hidden"
                sm="flex"
              >
                {{ forum.threadsCount }}
                {{
                  forum.threadsCount
                    ? formatNoun(forum.threadsCount, 'Thread', 'Threads')
                    : 'Threads'
                }}
              </div>
              <div
                v-if="forum.lastThreadUser"
                class="text-right pr-1 ml-16 hidden justify-end"
                sm="block basis-1/5"
              >
                <div
                  class="text-sm sm:text-base 2xl:text-xl font-medium dark:text-white"
                >
                  <router-link
                    :to="{
                      name: 'Thread',
                      params: {
                        id: forum.lastThreadId
                      }
                    }"
                    class="truncate max-w-35 inline-block text-right leading-none"
                    :title="forum.lastThread.title"
                    >{{ forum.lastThread.title }}</router-link
                  >
                </div>
                <div
                  class="text-gray-600 dark:text-gray-200 text-xs xl:text-base"
                >
                  by
                  <router-link
                    :to="{
                      name:
                        authUser.id === forum.lastThreadUser.id
                          ? 'Profile'
                          : 'UserProfile',
                      params:
                        authUser.id === forum.lastThreadUser.id
                          ? null
                          : { userId: forum.lastThreadUser.id }
                    }"
                    >{{ forum.lastThreadUser.username }}</router-link
                  >
                  <div>
                    <base-time :timestamp="forum.lastThread.publishedAt" />
                  </div>
                </div>
              </div>
              <div
                v-else
                class="basis-1/5 text-right pr-1 ml-16 hidden justify-end"
                sm="flex"
              ></div>
              <div
                class="flex-col w-10 h-10 justify-center items-center ml-4 hidden"
                sm="flex"
              >
                <router-link
                  v-if="forum.lastThreadUser"
                  :to="{
                    name: 'UserProfile',
                    params: { userId: forum.lastThreadUser.id }
                  }"
                  class="block relative"
                >
                  <base-avatar-image
                    class="avatar"
                    :src="forum.lastThreadUser?.avatar"
                    :alt="`${forum.lastThreadUser?.username}'s avatar.`"
                  />
                </router-link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { formatNoun, mapGetters } from '@/helpers'
import { toRefs } from 'vue'

const props = defineProps({
  forums: {
    type: Array,
    required: true
  },
  categoryName: {
    type: String,
    default: ''
  },
  categoryId: {
    type: String,
    required: false,
    default: ''
  },
  categoryDescription: {
    type: String,
    required: false,
    default: ''
  }
})

const { forums, categoryName, categoryId, categoryDescription } = toRefs(props)

const { authUser } = mapGetters('auth')
</script>

<style scoped>
.forum-list .forum-title {
  @apply mb-0 text-lg 2xl:text-2xl;
}
.forum-list a {
  @apply text-teal-600 hover:text-teal-800 transition;
}
</style>
