import db from '@/config/firestore'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  deleteDoc
} from 'firebase/firestore'
import { findById } from '@/helpers'

export default {
  fetchDoc(
    { state, commit },
    {
      id,
      resource,
      unsubscribeHandler = null,
      once = false,
      onSnapshotFn = null
    }
  ) {
    if (!id) return null

    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(
        doc(db, resource, id),
        { includeMetadataChanges: false },
        (doc) => {
          if (once) unsubscribe()

          if (doc.exists()) {
            const data = { ...doc.data(), id: doc.id }
            let previousDoc = findById(state[resource].items, id)
            previousDoc = previousDoc ? { ...previousDoc } : null
            commit('setItem', { resource, data })
            if (typeof onSnapshotFn === 'function') {
              const isLocal = doc.metadata.hasPendingWrites
              onSnapshotFn({ currentDoc: { ...data }, previousDoc, isLocal })
            }
            resolve(data)
          } else {
            resolve(null)
          }
        }
      )

      if (unsubscribeHandler) unsubscribeHandler(unsubscribe)
      else commit('appendUnsubscribe', { unsubscribe })
    })
  },
  fetchDocs({ dispatch }, { ids, resource, onSnapshotFn = null }) {
    ids = ids.length > 0 ? [...new Set(ids)] : []
    return Promise.all(
      ids.map((id) => dispatch('fetchDoc', { id, resource, onSnapshotFn }))
    )
  },
  fetchCollectionDocs({ commit }, { resource }) {
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(
        collection(db, resource),
        (collections) => {
          const collection = collections.docs.map((doc) => {
            const data = { ...doc.data(), id: doc.id }
            commit('setItem', { resource, data })
            return data
          })
          resolve(collection)
        }
      )
      commit('appendUnsubscribe', { unsubscribe })
    })
  },
  fetchDocsByQuery(
    { commit },
    {
      resource,
      whereCondition,
      order = null,
      limitNumber,
      startAfterDoc,
      paginate = false
    }
  ) {
    if (!whereCondition) return null

    return new Promise((resolve) => {
      const queryConstrains = [
        where(whereCondition.key, whereCondition.operator, whereCondition.value)
      ]
      if (limitNumber) queryConstrains.push(limit(limitNumber))
      if (order) queryConstrains.push(orderBy(order.path, order.direction))
      if (startAfterDoc) queryConstrains.push(startAfter(startAfterDoc))
      const q = query(collection(db, resource), ...queryConstrains)

      getDocs(q).then((documentSnapshots) => {
        documentSnapshots.docs.forEach((data) => {
          commit('setItem', { resource, data })
        })

        if (paginate) {
          const lastVisible =
            documentSnapshots.docs[documentSnapshots.docs.length - 1]
          resolve(lastVisible)
        } else {
          resolve(documentSnapshots)
        }
      })
    })
  },
  unsubscribeFirestoreListeners: async ({ state, commit }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllUnsubscribes')
  },
  clearItems: ({ commit }, { modules = [] }) => {
    commit('clearItems', { modules })
  },
  deleteDoc: (_, { resource, id }) => {
    if (!id) return null
    return new Promise(async (resolve) => {
      const docRef = doc(db, resource, id)
      const res = await deleteDoc(docRef)
      resolve(res)
    })
  }
}
