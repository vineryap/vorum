import firebaseApp from './firebase'
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'

const firestoreDb = initializeFirestore(firebaseApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
})
export default firestoreDb
