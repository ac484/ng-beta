/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴、文件處理和分析的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview Firebase 統一服務類別 - 提供標準化的資料庫和儲存操作介面
 * @description
 * 統一的 Firebase 服務層，提供 CRUD 操作、檔案上傳下載、查詢功能等。
 * 支援泛型操作，自動處理時間戳記和基礎實體欄位，確保資料一致性。
 *
 * 主要功能：
 * - 標準化 CRUD 操作 (create, read, update, delete)
 * - 複雜查詢支援 (where, orderBy, limit)
 * - 檔案上傳和刪除
 * - 自動時間戳記管理
 * - 泛型類型支援
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Database: Firebase Firestore v9+
 * - Storage: Firebase Storage v9+
 * - Validation: TypeScript 泛型 + Zod schemas
 * - State: TanStack Query + Zustand
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 *
 * @usage
 * ```typescript
 * const firebaseService = new FirebaseService()
 *
 * // 建立文件
 * const project = await firebaseService.create<Project>('projects', projectData)
 *
 * // 查詢文件
 * const projects = await firebaseService.list<Project>('projects', {
 *   where: [{ field: 'status', operator: '==', value: 'active' }],
 *   orderBy: [['createdAt', 'desc']],
 *   limit: 10
 * })
 * ```
 *
 * @dependencies
 * - firebase/firestore: Firestore 資料庫操作
 * - firebase/storage: 檔案儲存操作
 *
 * @related
 * - src/lib/firebase/client.ts: Firebase 客戶端配置
 * - src/lib/services/project-service.ts: 專案服務
 * - src/lib/services/partner-service.ts: 夥伴服務
 * - src/lib/services/document-service.ts: 文件服務
 */

import { db, storage } from '../firebase/client';
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
  Timestamp,
  Query,
  DocumentData
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

interface QueryConstraint {
  field: string;
  operator: any;
  value: any;
}

export class FirebaseService {
  async create<T>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: now,
      updatedAt: now
    });
    return { id: docRef.id, ...data, createdAt: now, updatedAt: now } as T &
      BaseEntity;
  }

  async read<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>) {
    const docRef = doc(db, collectionName, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };
    await updateDoc(docRef, updateData);
    return updateData;
  }

  async delete(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  async list<T>(
    collectionName: string,
    constraints: {
      where?: QueryConstraint[];
      orderBy?: [string, 'asc' | 'desc'][];
      limit?: number;
    } = {}
  ): Promise<T[]> {
    let q: Query<DocumentData> = collection(db, collectionName);

    if (constraints.where) {
      constraints.where.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }

    if (constraints.orderBy) {
      constraints.orderBy.forEach(([field, direction]) => {
        q = query(q, orderBy(field, direction));
      });
    }

    if (constraints.limit) {
      q = query(q, limit(constraints.limit));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async uploadFile(path: string, file: File): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async deleteFile(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}
