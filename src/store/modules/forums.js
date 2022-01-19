import {
  findById,
  makeAppendChildtoParentMutation,
  makeFetchDocAction,
  makeFetchDocsAction
} from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    forum: (state, _getters, _rootState, rootGetters) => {
      return (id) => {
        const forum = findById(state.items, id)
        if (!forum) return null

        return {
          ...forum,
          get threadsCount() {
            return forum.threads?.length || 0
          },
          get lastThreadId() {
            return this.threadsCount
              ? forum.threads[forum.threads?.length - 1]
              : null
          },
          get lastThread() {
            return rootGetters['threads/thread'](this.lastThreadId)
          },
          get lastThreadUser() {
            return rootGetters['users/user'](this.lastThread?.userId)
          }
        }
      }
    }
  },
  mutations: {
    appendThreadIdToForum: makeAppendChildtoParentMutation({ child: 'threads' })
  },
  actions: {
    fetchForumById: makeFetchDocAction({ resource: 'forums' }),
    fetchForumsByIds: makeFetchDocsAction({ resource: 'forums' })
  }
}
