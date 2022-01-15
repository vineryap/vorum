<template>
    <div class="w-full">
        <div class="mb-4 mx-0">
            <div
                class="flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow"
            >
                <div class="px-4 py-5 sm:px-6 border-b w-full break-words">
                    <h2 class="font-medium text-gray-900 dark:text-white">Threads</h2>
                </div>
                <ul class="flex flex-col divide-y w-full">
                    <li
                        v-for="(thread, index) in threads"
                        :key="index"
                        class="flex flex-row"
                        sm="px-5"
                    >
                        <div v-if="thread" class="flex flex-1 items-center p-4 content-center">
                            <div class="sm:basis-1/2 pl-1 sm:mr-16 break-all">
                                <h3 class="font-medium dark:text-white">
                                    <router-link
                                        :to="{ name: 'Thread', params: { id: thread.id } }"
                                    >
                                        {{
                                            thread.title
                                        }}
                                    </router-link>
                                </h3>
                                <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
                                    By
                                    <a href="profile.html">{{ thread.authorName }}</a>,
                                    <base-time :timestamp="thread.publishedAt" />.
                                </p>
                            </div>
                            <div
                                class="basis-1/8 items-center text-right text-sm sm:text-base dark:text-gray-300 hidden"
                                sm="flex"
                            >
                                {{
                                    `${thread.repliesCount} ${formatNoun(
                                        thread.repliesCount,
                                        'reply',
                                        'replies'
                                    )}`
                                }}
                            </div>
                            <div
                                v-if="thread.lastUser"
                                class="text-right pr-1 ml-16 hidden justify-end"
                                sm="block basis-1/5"
                            >
                                <div class="text-sm sm:text-base font-medium dark:text-white">
                                    <router-link
                                        :to="{
                                            name: 'Thread',
                                            params: {
                                                id: thread.lastUser.id
                                            }
                                        }"
                                        class="truncate max-w-35 block"
                                    >{{ thread.lastUser.username }}</router-link>
                                </div>
                                <div class="text-gray-600 dark:text-gray-200 text-xs">
                                    <base-time :timestamp="thread.lastPostAt" />
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
                                <a v-if="thread.lastUser" href="#" class="block relative">
                                    <base-avatar-image
                                        class="avatar"
                                        :src="thread.lastUser?.avatar"
                                        :alt="`${thread.lastUser?.username}'s avatar.`"
                                    />
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import { formatNoun } from '@/helpers'

const props = defineProps({
    threads: {
        type: Array,
        required: true
    },
    categoryName: {
        type: String
    },
    categoryId: {
        type: String,
        required: false
    },
    categoryDescription: {
        type: String,
        required: false
    }
})

const { threads, categoryName, categoryId, categoryDescription } = props

</script>

<style>
</style>