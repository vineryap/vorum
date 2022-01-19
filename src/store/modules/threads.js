import {
  findById,
  docToResource,
  makeAppendChildtoParentMutation,
  makeSetResourceProperty,
  makeFetchDocAction,
  makeFetchDocsAction
} from '@/helpers'
import db from '@/config/firestore'
import {
  collection,
  doc,
  getDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { chunk } from 'lodash'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    thread: (state, getters, rootState, rootGetters) => {
      return (id) => {
        const thread = findById(state.items, id)
        if (!thread) return null

        return {
          ...thread,
          get firstPostId() {
            return thread.posts[0]
          },
          get lastPost() {
            return rootGetters['posts/post'](thread.lastPostId)
          },
          get lastUser() {
            return rootGetters['users/user'](this.lastPost?.userId)
          },
          get authorName() {
            return rootGetters['users/user'](thread.userId)?.username
          },
          get repliesCount() {
            return thread.posts.length - 1
          },
          get contibutorsCount() {
            return thread.contributors?.length || 0
          }
        }
      }
    }
  },
  mutations: {
    appendPostIdToThread: makeAppendChildtoParentMutation({ child: 'posts' }),
    appendContributorToThread: makeAppendChildtoParentMutation({
      child: 'contributors'
    }),
    setThreadFirstPostId: makeSetResourceProperty('firstPostId'),
    setThreadLastPostId: makeSetResourceProperty('lastPostId'),
    setThreadLastPostAt: makeSetResourceProperty('lastPostAt'),
    clearThreads: (state) => {
      state.items = []
    }
  },
  actions: {
    async createThread(
      { commit, state, dispatch, rootState },
      { title, text, forumId }
    ) {
      const thread = {
        title,
        forumId
      }
      thread.publishedAt = serverTimestamp()
      thread.userId = rootState.auth.authId
      thread.posts = thread.posts || []

      const batch = writeBatch(db)
      const threadRef = doc(collection(db, 'threads'))
      batch.set(threadRef, thread)
      batch.update(doc(db, 'users', rootState.auth.authId), {
        threads: arrayUnion(threadRef.id)
      })
      batch.update(doc(db, 'forums', forumId), {
        threads: arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await getDoc(threadRef)

      commit(
        'setItem',
        {
          resource: 'threads',
          data: { ...newThread.data(), id: newThread.id }
        },
        { root: true }
      )
      commit(
        'users/appendThreadIdToUser',
        {
          parentId: thread.userId,
          childId: newThread.id
        },
        { root: true }
      )
      commit(
        'forums/appendThreadIdToForum',
        {
          parentId: forumId,
          childId: newThread.id
        },
        { root: true }
      )

      await dispatch(
        'posts/createPost',
        { text, threadId: newThread.id, isFirstPost: true },
        { root: true }
      )

      return findById(state.items, threadRef.id)
    },
    async updateThread({ commit, state, rootState }, { title, text, id }) {
      const thread = findById(state.items, id)
      const post = findById(rootState.posts.items, thread.posts[0])

      let updatedThread = { ...thread, title }
      let updatedPost = { ...post, text }

      const threadRef = doc(db, 'threads', id)
      const postRef = doc(db, 'posts', post.id)
      const batch = writeBatch(db)
      batch.update(threadRef, updatedThread)
      batch.update(postRef, updatedPost)
      await batch.commit()

      updatedThread = await getDoc(threadRef)
      updatedPost = await getDoc(postRef)
      commit(
        'setItem',
        { resource: 'threads', data: updatedThread },
        { root: true }
      )
      commit(
        'setItem',
        { resource: 'posts', data: updatedPost },
        { root: true }
      )

      return docToResource(updatedThread)
    },
    fetchThreads: ({ dispatch }) => {
      return dispatch(
        'fetchCollectionDocs',
        { resource: 'threads' },
        { root: true }
      )
    },
    fetchThreadById: makeFetchDocAction({ resource: 'threads' }),
    fetchThreadsByIds: makeFetchDocsAction({ resource: 'threads' }),
    fetchThreadsByPage: ({ dispatch, commit }, { ids, page, perPage = 5 }) => {
      commit('clearThreads')

      const index = page - 1
      const chunkedIds = chunk(ids, perPage)
      const firstChunk = chunkedIds[index]
      return dispatch('fetchThreadsByIds', { ids: firstChunk })
    }
  }
}
