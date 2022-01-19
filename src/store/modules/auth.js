import db from '@/config/firestore'
import useNotifications from '@/composables/useNotifications'
import { doc, getDoc } from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import storage from '@/config/storage'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authStateChangeObserver: null
  },
  getters: {
    authUser: (state, _getters, _rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  mutations: {
    setAuthId: (state, userId) => {
      state.authId = userId
    },
    setAuthUserUnsubscribe: (state, unsubscribe) => {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthStateChangeObserver: (state, unsubscribe) => {
      state.authStateChangeObserver = unsubscribe
    },
    unsubscribeAuthUser: (state) => {
      state.authUserUnsubscribe = null
    }
  },
  actions: {
    updateUserEmail: async (_, { email }) => {
      try {
        const auth = getAuth()
        await updateEmail(auth.currentUser, email)
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Failed updating Email.',
          timeout: 5000,
          type: 'error'
        })
      }
    },
    reauthenticateUser: async (_, { email, password }) => {
      const auth = getAuth()

      const credential = EmailAuthProvider.credential(email, password)
      try {
        return await reauthenticateWithCredential(auth.currentUser, credential)
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Failed confirming account.',
          timeout: 5000,
          type: 'error'
        })
      }
    },
    initAuthentication: ({ dispatch, commit }) => {
      dispatch('unsubscribeAuthStateChangeObserver')

      return new Promise((resolve) => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          dispatch('unsubscribeAuthUserListener')
          if (user) {
            await dispatch('fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthStateChangeObserver', unsubscribe)
      })
    },

    registerUserWithEmailAndPassword: async (
      { dispatch },
      { name, username, email, password, avatar }
    ) => {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      avatar = await dispatch('uploadAvatar', {
        userId: userCredential.user.uid,
        file: avatar
      })

      const newUserData = {
        name,
        username,
        email,
        password,
        avatar,
        id: userCredential.user.uid
      }
      await dispatch('users/createUser', newUserData, { root: true })
    },
    uploadAvatar: async ({ state }, { userId, file, filename }) => {
      if (!file) return null
      userId = userId || state.authId
      filename = filename || file.name

      try {
        const imageRef = ref(
          storage,
          `uploads/${userId}/images/${Date.now()}_${filename}`
        )
        const snapshot = await uploadBytes(imageRef, file)
        const downloadUrl = await getDownloadURL(snapshot.ref)
        return downloadUrl
      } catch (error) {
        const { addNotification } = useNotifications()
        addNotification({
          message: 'Error uploading avatar image',
          timeout: 5000,
          type: 'error'
        })
      }
    },

    signInWithEmailAndPassword: async (_, { email, password }) => {
      const auth = getAuth()
      return await signInWithEmailAndPassword(auth, email, password)
    },
    signInWithGoogle: async ({ dispatch }) => {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        return dispatch(
          'users/createUser',
          {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            username: user.email.replace(/@.*$/, ''),
            avatar: user.photoURL
          },
          { root: true }
        )
      }
    },
    signOut: async ({ commit }) => {
      const auth = getAuth()
      await signOut(auth)
      commit('setAuthId', null)
    },

    fetchAuthUser: async ({ commit, dispatch }) => {
      const userId = getAuth().currentUser?.uid
      if (!userId) return

      const unsubscribeHandler = (unsubscribe) =>
        commit('setAuthUserUnsubscribe', unsubscribe)
      await dispatch(
        'users/fetchUserById',
        {
          id: userId,
          unsubscribeHandler
        },
        { root: true }
      )
      commit('setAuthId', userId)
    },

    fetchAuthUserPosts: async ({ state, dispatch }, additionalContraints) => {
      const posts = await dispatch(
        'users/fetchUserPostsByQuery',
        { userId: state.authId, additionalContraints },
        { root: true }
      )
      return posts
    },

    unsubscribeAuthUserListener: async ({ state, commit }) => {
      if (state.authUserUnsubscribe) {
        // unsubscribe
        state.authUserUnsubscribe()
        commit('unsubscribeAuthUser')
      }
    },
    unsubscribeAuthStateChangeObserver: async ({ state }) => {
      if (state.authStateChangeObserver) {
        state.authStateChangeObserver()
      }
    }
  }
}
