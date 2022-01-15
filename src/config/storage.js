import firebaseApp from './firebase'
import { getStorage } from 'firebase/storage'

const storage = getStorage(firebaseApp)

export default storage
