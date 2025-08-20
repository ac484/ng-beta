import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import app from './config'

// Initialize Firebase services for client
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch (error) {
    // Emulators might not be running, ignore error
  }
}