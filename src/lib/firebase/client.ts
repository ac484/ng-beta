import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import app from './config';

// Initialize Firebase services for client
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (only once)
if (
  process.env.NODE_ENV === 'development' &&
  !globalThis.__FIREBASE_EMULATOR_CONNECTED
) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true
    });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    globalThis.__FIREBASE_EMULATOR_CONNECTED = true;
  } catch (error) {
    console.warn('Firebase emulators not available:', error);
  }
}
