import {
  findById,
  docToResource,
  makeFetchDocAction,
  makeFetchDocsAction,
  makeFetchDocsQueryAction
} from '@/helpers'
import db from '@/config/firestore'
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  increment
} from 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    post: (state) => {
      return (id) => {
        const post = findById(state.items, id)
        if (!post) return null

        return {
          ...post
        }
      }
    }
  },
  mutations: {},
  actions: {
    async createPost({ commit, rootState, rootGetters }, post) {
      post.publishedAt = serverTimestamp()
      post.userId = rootState.auth.authId
      post.isFirstPost = post.isFirstPost || false

      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const userRef = doc(db, 'users', rootState.auth.authId)
      const threadRef = doc(db, 'threads', post.threadId)

      batch.set(postRef, post)

      const updatedThread = {
        posts: arrayUnion(postRef.id),
        lastPostId: postRef.id,
        lastPostAt: post.publishedAt
      }
      if (!post.isFirstPost) {
        updatedThread.contributors = arrayUnion(rootState.auth.authId)
      }

      batch.update(threadRef, updatedThread)
      batch.update(userRef, {
        postsCount: increment(1)
      })
      await batch.commit()

      const newPost = await getDoc(postRef)
      commit(
        'setItem',
        {
          resource: 'posts',
          data: { ...newPost.data(), id: newPost.id }
        },
        { root: true }
      )
      commit(
        'threads/appendPostIdToThread',
        {
          parentId: post.threadId,
          childId: postRef.id
        },
        { root: true }
      )

      if (!post.isFirstPost) {
        commit(
          'threads/appendContributorToThread',
          {
            parentId: post.threadId,
            childId: rootState.auth.authId
          },
          { root: true }
        )
      }

      if (!rootGetters['threads/thread'](post.threadId).firstPostId) {
        commit(
          'threads/setThreadFirstPostId',
          {
            resourceId: post.threadId,
            value: postRef.id
          },
          { root: true }
        )
      }
      commit(
        'threads/setThreadLastPostId',
        {
          resourceId: post.threadId,
          value: postRef.id
        },
        { root: true }
      )
      commit(
        'threads/setThreadLastPostAt',
        {
          resourceId: post.threadId,
          value: post.publishedAt
        },
        { root: true }
      )

      return docToResource(newPost)
    },
    async updatePost({ commit, rootState }, { text, id }) {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: rootState.auth.authId,
          moderated: false
        }
      }

      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, post)
      const updatedPost = await getDoc(postRef)
      commit(
        'setItem',
        { resource: 'posts', data: updatedPost },
        { root: true }
      )
    },
    fetchPosts: ({ dispatch }) => {
      console.log('🔥 fetchPosts:', 'posts')
      return dispatch(
        'fetchCollectionDocs',
        { resource: 'posts' },
        { root: true }
      )
    },
    fetchPostById: makeFetchDocAction({ resource: 'posts' }),
    fetchPostsByIds: makeFetchDocsAction({ resource: 'posts' }),
    fetchPostsByQuery: makeFetchDocsQueryAction({ resource: 'posts' })
  }
}
