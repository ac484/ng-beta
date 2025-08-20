import { db } from '@/lib/firebase/client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
}

export interface CreateData<T>
  extends Omit<T, 'id' | 'createdAt' | 'updatedAt'> {
  createdBy: string;
}

export interface UpdateData<T>
  extends Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>> {
  updatedBy: string;
}

export class FirebaseService {
  async create<T extends BaseEntity>(
    collectionName: string,
    data: CreateData<T>
  ): Promise<T> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: now,
      updatedAt: now
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: now,
      updatedAt: now
    } as T;
  }

  async read<T extends BaseEntity>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update<T extends BaseEntity>(
    collectionName: string,
    id: string,
    data: UpdateData<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  async list<T extends BaseEntity>(
    collectionName: string,
    constraints: {
      where?: Array<[string, any, any]>;
      orderBy?: Array<[string, 'asc' | 'desc']>;
      limit?: number;
    } = {}
  ): Promise<T[]> {
    const queryConstraints: QueryConstraint[] = [];

    if (constraints.where) {
      constraints.where.forEach(([field, operator, value]) => {
        queryConstraints.push(where(field, operator, value));
      });
    }

    if (constraints.orderBy) {
      constraints.orderBy.forEach(([field, direction]) => {
        queryConstraints.push(orderBy(field, direction));
      });
    }

    if (constraints.limit) {
      queryConstraints.push(limit(constraints.limit));
    }

    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async exists(collectionName: string, id: string): Promise<boolean> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
}

export const firebaseService = new FirebaseService();
