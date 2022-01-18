import firebaseApp from './firebase'
import { getFirestore } from 'firebase/firestore'

const firestoreDb = getFirestore(firebaseApp)
export default firestoreDb
