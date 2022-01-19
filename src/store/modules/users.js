import {
  findById,
  filterById,
  docToResource,
  makeAppendChildtoParentMutation,
  makeFetchDocAction,
  makeFetchDocsAction
} from '@/helpers'
import db from '@/config/firestore'
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    user: (state, _getters, rootState, _rootGetters) => {
      return (id) => {
        const user = findById(state.items, id)
        if (!user) return null

        return {
          ...user,
          get posts() {
            return filterById({
              resources: rootState.posts.items,
              resourceKey: 'userId',
              id: user.id
            })
          },
          get postsCount() {
            return user.postsCount || 0
          },
          get threads() {
            return rootState.threads.items.filter(
              (thread) => thread.userId === user.id
            )
          },
          get threadIds() {
            return user.threads
          },
          get threadsCount() {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  mutations: {
    appendThreadIdToUser: makeAppendChildtoParentMutation({ child: 'threads' })
  },
  actions: {
    async createUser({ commit }, { id, name, username, email, avatar }) {
      const userData = {
        avatar,
        bio: '',
        email: email.toLowerCase(),
        name,
        registeredAt: serverTimestamp(),
        username,
        usernameLower: username.toLowerCase(),
        threads: []
      }
      const userRef = doc(db, 'users', id)
      await setDoc(userRef, userData)

      const newUser = await getDoc(userRef)
      commit('setItem', { resource: 'users', data: newUser }, { root: true })
      return docToResource(newUser)
    },
    async updateUser(
      { commit },
      { id, name, username, bio, email, avatar, website, location }
    ) {
      const updates = {
        avatar,
        name,
        email: email.toLowerCase() || null,
        username,
        bio: bio || null,
        website: website || null,
        location: location || null
      }
      const userRef = doc(db, 'users', id)
      await updateDoc(userRef, updates)

      commit('setItem', { resource: 'users', data: updates }, { root: true })
    },
    fetchUsers: ({ dispatch }) => {
      return dispatch(
        'fetchCollectionDocs',
        { resource: 'users' },
        { root: true }
      )
    },
    fetchUserById: makeFetchDocAction({ resource: 'users' }),
    fetchUsersByIds: makeFetchDocsAction({ resource: 'users' }),
    fetchUserPostsByQuery: async (
      { dispatch },
      { userId, additionalContraints = null }
    ) => {
      const queryConstraints = {
        whereCondition: { key: 'userId', operator: '==', value: userId },
        order: {
          path: 'publishedAt',
          direction: 'desc'
        },
        limitNumber: 5
      }

      if (additionalContraints) {
        const { lastPost, lastPostId, sortDir, limitNumber, paginate } =
          additionalContraints
        if (sortDir && isString(sortDir))
          queryConstraints.order.direction = sortDir
        if (lastPostId) {
          const lastPost = await getDoc(doc(db, 'posts', lastPostId))
          queryConstraints.startAfterDoc = lastPost
        }
        if (lastPost) {
          queryConstraints.startAfterDoc = lastPost
        }
        if (limitNumber) {
          queryConstraints.limitNumber = limitNumber
        }
        if (paginate) {
          queryConstraints.paginate = paginate
        }
      }

      return await dispatch(
        'posts/fetchPostsByQuery',
        { ...queryConstraints },
        { root: true }
      )
    }
  }
}
