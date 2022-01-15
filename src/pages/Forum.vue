<template >
    <div class="w-full" v-if="pageLoadStatus_pageReady">
        <the-breadcrumbs :forumId="id" />
        <div class="flex flex-col flex-wrap justify-between sm:flex-row mb-4">
            <div class="forum-details">
                <h1>{{ forum.name }}</h1>
                <p class="text-lead">{{ forum.description }}</p>
            </div>
            <div class="flex sm:self-end mt-5 sm:mt-0">
                <router-link
                    :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
                    class="btn-green btn-small"
                >Start a thread</router-link>
            </div>
        </div>

        <ThreadList :threads="threads" />
        <div class="flex justify-center">
            <v-pagination
                v-if="totalPages"
                v-model="pagination.page"
                :pages="totalPages"
                :active-color="pagination.activeColor"
            />
        </div>
    </div>
</template>

<script>
import TheBreadcrumbs from '@/components/TheBreadcrumbs.vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { pageLoadStatus } from '@/mixins'
import ThreadList from '@/components/ThreadList.vue'

export default {
    components: {
        TheBreadcrumbs,
        ThreadList
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    mixins: [pageLoadStatus],
    data() {
        return {
            pagination: {
                page: parseInt(this.$route.query.page) || 1,
                perPage: 5,
                activeColor: '#57ad8d'
            }
        }
    },
    methods: {
        ...mapActions({
            fetchCategoryById: 'categories/fetchCategoryById',
            fetchForumById: 'forums/fetchForumById',
            fetchForumsByIds: 'forums/fetchForumsByIds',
            fetchThreadsByPage: 'threads/fetchThreadsByPage',
            fetchPostsByIds: 'posts/fetchPostsByIds',
            fetchUsersByIds: 'users/fetchUsersByIds'
        }),
        async populatePage(forumThreadIds) {
            const threads = await this.fetchThreadsByPage({
                ids: forumThreadIds,
                page: this.pagination.page,
                perPage: this.pagination.perPage
            })
            const lastPostIds = threads.map((thread) => thread.lastPostId)
            const lastPosts = await this.fetchPostsByIds({ ids: lastPostIds })
            const lastPostUserIds = lastPosts.map((post) => post.userId)
            const threadsUserIds = threads.map((thread) => thread.userId)
            const userIds = [...lastPostUserIds, ...threadsUserIds]
            await this.fetchUsersByIds({ ids: userIds })
        }
    },
    computed: {
        ...mapGetters({
            getCategory: 'categories/category',
            getForum: 'forums/forum',
            getThread: 'threads/thread'
        }),
        ...mapState({ allThreads: (state) => state.threads.items }),
        forum() {
            return this.getForum(this.id)
        },
        subForum() {
            if (!this.forum) return null
            return null
            // return this.getCategory(this.forum.categoryId)
        },
        threads() {
            if (!this.allThreads.length) return []
            return this.allThreads
                .filter((thread) => thread.forumId === this.forum.id)
                .map((thread) => this.getThread(thread.id))
        },
        forums() {
            if (!this.subForum) return []
            return this.subForum.forums?.map((forumId) => this.getForum(forumId))
        },
        forumThreadsCount() {
            return this.forum.threads?.length || 0
        },
        totalPages() {
            if (!this.forumThreadsCount) return 0
            return Math.ceil(this.forumThreadsCount / this.pagination.perPage)
        }
    },
    watch: {
        'pagination.page'(page) {
            this.$router.push({ query: { page: page } })
            // await this.populatePage(this.forum.threads)
        }
    },
    async created() {
        const forum = await this.fetchForumById({ id: this.id })

        // const category = await this.fetchCategoryById({ id: forum.categoryId })

        // const forums = await this.fetchForumsByIds({ ids: category.forums })

        // const forumsThreadIds = forums
        //   .map((f) => f.threads?.at(-1))
        //   .filter((id) => id)

        // const threadIds = [...forumsThreadIds, ...forum.threads]
        if (forum.threads) {
            await this.populatePage(forum.threads)
        }

        this.pageLoadStatus_pageLoaded()
    }
}
</script>

<style>
</style>

<style>
</style>