import { auth, db, storage } from '../firebase/client'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  DocumentData
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'

export class FirebaseService {
  // 認證相關
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return { user: userCredential.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  async signOutUser() {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  // Firestore 相關
  async getCollection(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      return { data: documents, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null }
      } else {
        return { data: null, error: 'Document not found' }
      }
    } catch (error) {
      return { data: null, error }
    }
  }

  async addDocument(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data)
      return { id: docRef.id, error: null }
    } catch (error) {
      return { id: null, error }
    }
  }

  async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, data)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  async deleteDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Storage 相關
  async uploadFile(path: string, file: File) {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return { url: downloadURL, error: null }
    } catch (error) {
      return { url: null, error }
    }
  }

  async deleteFile(path: string) {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // 查詢相關
  async queryCollection(collectionName: string, conditions: any[] = [], orderByField?: string, limitCount?: number) {
    try {
      let q: Query<DocumentData> = collection(db, collectionName)
      
      // 添加條件
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })
      
      // 添加排序
      if (orderByField) {
        q = query(q, orderBy(orderByField))
      }
      
      // 添加限制
      if (limitCount) {
        q = query(q, limit(limitCount))
      }
      
      const querySnapshot = await getDocs(q)
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return { data: documents, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}