import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAppCheck } from 'firebase-admin/app-check'

// Initialize Firebase Admin for server-side operations
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    })
  : getApps()[0]

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
export const adminStorage = getStorage(app)
export const adminAppCheck = getAppCheck(app)

export async function verifyAppCheckTokenServer(token: string): Promise<boolean> {
  try {
    await adminAppCheck.verifyToken(token)
    return true
  } catch {
    return false
  }
}

export default app