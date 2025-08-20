# Firebase 整合實作模式

## 核心架構

### 1. Firebase 配置

#### 基礎配置
```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// 開發環境連接模擬器
if (process.env.NODE_ENV === 'development') {
  if (!globalThis.__FIREBASE_EMULATOR_CONNECTED) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectAuthEmulator(auth, 'http://localhost:9099')
      connectStorageEmulator(storage, 'localhost', 9199)
      connectFunctionsEmulator(functions, 'localhost', 5001)
      globalThis.__FIREBASE_EMULATOR_CONNECTED = true
      console.log('Firebase emulators connected')
    } catch (error) {
      console.warn('Firebase emulators already connected or not available')
    }
  }
}
```

#### 環境變數配置
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# 開發環境模擬器配置
FIREBASE_EMULATOR_HOST=localhost
FIREBASE_FIRESTORE_EMULATOR_PORT=8080
FIREBASE_AUTH_EMULATOR_PORT=9099
FIREBASE_STORAGE_EMULATOR_PORT=9199
FIREBASE_FUNCTIONS_EMULATOR_PORT=5001
```

### 2. 資料庫結構設計

#### 集合結構
```typescript
// lib/firebase/collections.ts
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  PARTNERS: 'partners',
  DOCUMENTS: 'documents',
  CONTRACTS: 'contracts',
  COLLABORATIONS: 'collaborations',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs'
} as const

export const SUBCOLLECTIONS = {
  PROJECT_TASKS: 'tasks',
  PROJECT_DOCUMENTS: 'documents',
  PROJECT_CONTRACTS: 'contracts',
  PARTNER_PROJECTS: 'projects',
  USER_PREFERENCES: 'preferences',
  USER_ACTIVITIES: 'activities'
} as const
```

#### 資料模型定義
```typescript
// lib/types/firebase.types.ts
import { Timestamp, FieldValue } from 'firebase/firestore'

export interface BaseEntity {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  updatedBy: string
  isDeleted?: boolean
  version: number
}

export interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
  role: UserRole
  permissions: Permission[]
  preferences: UserPreferences
  lastLoginAt?: Timestamp
  status: 'active' | 'inactive' | 'suspended'
}

export interface Project extends BaseEntity {
  title: string
  description: string
  status: ProjectStatus
  priority: Priority
  startDate: Timestamp
  endDate?: Timestamp
  progress: number
  tags: string[]
  budget?: number
  currency?: string
  partnerIds: string[]
  documentIds: string[]
  contractIds: string[]
  taskIds: string[]
  metadata: ProjectMetadata
}

export interface Partner extends BaseEntity {
  name: string
  type: PartnerType
  contactInfo: ContactInfo
  relationship: RelationshipType
  status: PartnerStatus
  projectIds: string[]
  documentIds: string[]
  collaborationIds: string[]
  rating?: number
  notes?: string
}

export interface Document extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  status: DocumentStatus
  projectId?: string
  partnerId?: string
  contractId?: string
  extractedText?: string
  summary?: string
  keywords: string[]
  entities: ExtractedEntity[]
  aiProcessed: boolean
  aiProcessedAt?: Timestamp
  metadata: DocumentMetadata
}

export interface Task extends BaseEntity {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  projectId: string
  assignedTo?: string
  dueDate?: Timestamp
  completedAt?: Timestamp
  estimatedHours?: number
  actualHours?: number
  subtasks: Subtask[]
  dependencies: string[]
  tags: string[]
}
```

## 服務層實作

### 1. 基礎 Firebase 服務

#### 通用 CRUD 服務
```typescript
// lib/services/firebase-service.ts
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
  startAfter,
  Timestamp,
  writeBatch,
  runTransaction,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { BaseEntity } from '@/lib/types/firebase.types'

export class FirebaseService {
  private db = db
  
  async create<T extends BaseEntity>(
    collectionName: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ): Promise<T> {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(this.db, collectionName), {
      ...data,
      createdAt: now,
      updatedAt: now,
      version: 1
    })
    
    return { 
      id: docRef.id, 
      ...data, 
      createdAt: now, 
      updatedAt: now, 
      version: 1 
    } as T
  }

  async read<T extends BaseEntity>(
    collectionName: string, 
    id: string
  ): Promise<T | null> {
    const docRef = doc(this.db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      if (data.isDeleted) return null
      
      return { 
        id: docSnap.id, 
        ...data 
      } as T
    }
    return null
  }

  async update<T extends BaseEntity>(
    collectionName: string, 
    id: string, 
    data: Partial<T>,
    userId: string
  ): Promise<T> {
    const docRef = doc(this.db, collectionName, id)
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
      updatedBy: userId,
      version: FieldValue.increment(1)
    }
    
    await updateDoc(docRef, updateData)
    return updateData as T
  }

  async delete(
    collectionName: string, 
    id: string,
    userId: string,
    softDelete: boolean = true
  ): Promise<void> {
    const docRef = doc(this.db, collectionName, id)
    
    if (softDelete) {
      await updateDoc(docRef, {
        isDeleted: true,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
        version: FieldValue.increment(1)
      })
    } else {
      await deleteDoc(docRef)
    }
  }

  async list<T extends BaseEntity>(
    collectionName: string, 
    constraints: QueryConstraint[] = [],
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ data: T[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    let q = collection(this.db, collectionName)
    
    // 添加約束條件
    constraints.forEach(constraint => {
      q = query(q, constraint)
    })
    
    // 添加分頁
    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }
    q = query(q, limit(pageSize))
    
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[]
    
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    
    return { 
      data: data.filter(item => !item.isDeleted), 
      lastDoc: lastVisible 
    }
  }

  async batchWrite<T extends BaseEntity>(
    operations: Array<{
      type: 'create' | 'update' | 'delete'
      collection: string
      data?: Partial<T>
      id?: string
      userId: string
    }>
  ): Promise<void> {
    const batch = writeBatch(this.db)
    
    operations.forEach(operation => {
      const docRef = operation.id 
        ? doc(this.db, operation.collection, operation.id)
        : doc(collection(this.db, operation.collection))
      
      switch (operation.type) {
        case 'create':
          if (operation.data) {
            const now = Timestamp.now()
            batch.set(docRef, {
              ...operation.data,
              createdAt: now,
              updatedAt: now,
              version: 1
            })
          }
          break
        case 'update':
          if (operation.data && operation.id) {
            batch.update(docRef, {
              ...operation.data,
              updatedAt: Timestamp.now(),
              updatedBy: operation.userId,
              version: FieldValue.increment(1)
            })
          }
          break
        case 'delete':
          if (operation.id) {
            batch.update(docRef, {
              isDeleted: true,
              updatedAt: Timestamp.now(),
              updatedBy: operation.userId,
              version: FieldValue.increment(1)
            })
          }
          break
      }
    })
    
    await batch.commit()
  }

  async transaction<T>(
    updateFunction: (transaction: any) => Promise<T>
  ): Promise<T> {
    return runTransaction(this.db, updateFunction)
  }
}

export const firebaseService = new FirebaseService()
```

### 2. 專案服務實作

#### Portfolio 服務
```typescript
// lib/services/project-service.ts
import { firebaseService } from './firebase-service'
import { Project, CreateProjectData, UpdateProjectData } from '@/lib/types/firebase.types'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { where, orderBy, query, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export class ProjectService extends FirebaseService {
  private collectionName = COLLECTIONS.PROJECTS

  async createProject(data: CreateProjectData, userId: string): Promise<Project> {
    return this.create<Project>(this.collectionName, {
      ...data,
      createdBy: userId,
      updatedBy: userId
    })
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const project = await this.read<Project>(this.collectionName, id)
    
    if (!project) return null
    
    // 檢查權限
    if (project.createdBy !== userId) {
      throw new Error('Unauthorized access to project')
    }
    
    return project
  }

  async getProjects(
    userId: string, 
    filters: {
      status?: ProjectStatus[]
      priority?: Priority[]
      tags?: string[]
      partnerId?: string
    } = {},
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<{ data: Project[]; lastDoc?: any }> {
    const constraints: any[] = [
      where('createdBy', '==', userId),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    ]
    
    if (filters.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }
    
    if (filters.priority && filters.priority.length > 0) {
      constraints.push(where('priority', 'in', filters.priority))
    }
    
    if (filters.partnerId) {
      constraints.push(where('partnerIds', 'array-contains', filters.partnerId))
    }
    
    return this.list<Project>(this.collectionName, constraints, pageSize, lastDoc)
  }

  async updateProject(
    id: string, 
    data: UpdateProjectData, 
    userId: string
  ): Promise<Project> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    return this.update<Project>(this.collectionName, id, data, userId)
  }

  async deleteProject(id: string, userId: string, softDelete: boolean = true): Promise<void> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    await this.delete(this.collectionName, id, userId, softDelete)
  }

  async getProjectStats(userId: string): Promise<{
    total: number
    active: number
    completed: number
    overdue: number
    totalProgress: number
  }> {
    const projects = await this.getProjects(userId)
    
    const stats = projects.data.reduce((acc, project) => {
      acc.total++
      acc.totalProgress += project.progress
      
      if (project.status === 'active') acc.active++
      if (project.status === 'completed') acc.completed++
      if (project.endDate && project.endDate.toDate() < new Date() && project.status !== 'completed') {
        acc.overdue++
      }
      
      return acc
    }, {
      total: 0,
      active: 0,
      completed: 0,
      overdue: 0,
      totalProgress: 0
    })
    
    stats.totalProgress = stats.total > 0 ? Math.round(stats.totalProgress / stats.total) : 0
    
    return stats
  }

  async searchProjects(
    userId: string,
    searchTerm: string,
    filters: any = {}
  ): Promise<Project[]> {
    // 實作全文搜尋邏輯
    const projects = await this.getProjects(userId, filters)
    
    return projects.data.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }
}

export const projectService = new ProjectService()
```

### 3. 夥伴服務實作

#### PartnerVerse 服務
```typescript
// lib/services/partner-service.ts
import { firebaseService } from './firebase-service'
import { Partner, CreatePartnerData, UpdatePartnerData } from '@/lib/types/firebase.types'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { where, orderBy, query, collection, getDocs } from 'firebase/firestore'

export class PartnerService extends FirebaseService {
  private collectionName = COLLECTIONS.PARTNERS

  async createPartner(data: CreatePartnerData, userId: string): Promise<Partner> {
    return this.create<Partner>(this.collectionName, {
      ...data,
      createdBy: userId,
      updatedBy: userId
    })
  }

  async getPartner(id: string, userId: string): Promise<Partner | null> {
    const partner = await this.read<Partner>(this.collectionName, id)
    
    if (!partner) return null
    
    // 檢查權限
    if (partner.createdBy !== userId) {
      throw new Error('Unauthorized access to partner')
    }
    
    return partner
  }

  async getPartners(
    userId: string,
    filters: {
      type?: PartnerType[]
      status?: PartnerStatus[]
      rating?: number
    } = {},
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<{ data: Partner[]; lastDoc?: any }> {
    const constraints: any[] = [
      where('createdBy', '==', userId),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    ]
    
    if (filters.type && filters.type.length > 0) {
      constraints.push(where('type', 'in', filters.type))
    }
    
    if (filters.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }
    
    if (filters.rating) {
      constraints.push(where('rating', '>=', filters.rating))
    }
    
    return this.list<Partner>(this.collectionName, constraints, pageSize, lastDoc)
  }

  async updatePartner(
    id: string, 
    data: UpdatePartnerData, 
    userId: string
  ): Promise<Partner> {
    // 先檢查權限
    const existingPartner = await this.getPartner(id, userId)
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized')
    }

    return this.update<Partner>(this.collectionName, id, data, userId)
  }

  async deletePartner(id: string, userId: string, softDelete: boolean = true): Promise<void> {
    // 先檢查權限
    const existingPartner = await this.getPartner(id, userId)
    if (!existingPartner) {
      throw new Error('Partner not found or unauthorized')
    }

    await this.delete(this.collectionName, id, userId, softDelete)
  }

  async getPartnerNetwork(userId: string): Promise<{
    partners: Partner[]
    connections: Array<{ from: string; to: string; type: string }>
  }> {
    const partners = await this.getPartners(userId)
    
    // 建立連接關係
    const connections: Array<{ from: string; to: string; type: string }> = []
    
    partners.data.forEach(partner => {
      partner.projectIds?.forEach(projectId => {
        connections.push({
          from: partner.id,
          to: projectId,
          type: 'project'
        })
      })
      
      partner.collaborationIds?.forEach(collaborationId => {
        connections.push({
          from: partner.id,
          to: collaborationId,
          type: 'collaboration'
        })
      })
    })
    
    return {
      partners: partners.data,
      connections
    }
  }

  async suggestPartners(
    userId: string,
    projectRequirements: {
      skills: string[]
      industry: string
      budget: number
    }
  ): Promise<Partner[]> {
    const partners = await this.getPartners(userId)
    
    // 實作夥伴推薦算法
    return partners.data
      .filter(partner => 
        partner.status === 'active' &&
        partner.rating && partner.rating >= 4
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
  }
}

export const partnerService = new PartnerService()
```

### 4. 文件服務實作

#### DocuParse 服務
```typescript
// lib/services/document-service.ts
import { firebaseService } from './firebase-service'
import { Document, CreateDocumentData, UpdateDocumentData } from '@/lib/types/firebase.types'
import { COLLECTIONS } from '@/lib/firebase/collections'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase/config'

export class DocumentService extends FirebaseService {
  private collectionName = COLLECTIONS.DOCUMENTS

  async uploadDocument(
    file: File, 
    metadata: Partial<CreateDocumentData>, 
    userId: string
  ): Promise<Document> {
    // 上傳到 Firebase Storage
    const storageRef = ref(storage, `documents/${userId}/${Date.now()}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    // 建立文件記錄
    const documentData: CreateDocumentData = {
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: downloadURL,
      status: 'uploaded',
      aiProcessed: false,
      metadata: {
        uploadedAt: new Date(),
        uploadedBy: userId,
        ...metadata.metadata
      },
      ...metadata
    }
    
    return this.create<Document>(this.collectionName, documentData)
  }

  async getDocument(id: string, userId: string): Promise<Document | null> {
    const document = await this.read<Document>(this.collectionName, id)
    
    if (!document) return null
    
    // 檢查權限
    if (document.createdBy !== userId) {
      throw new Error('Unauthorized access to document')
    }
    
    return document
  }

  async getDocuments(
    userId: string,
    filters: {
      status?: DocumentStatus[]
      mimeType?: string[]
      projectId?: string
      partnerId?: string
      aiProcessed?: boolean
    } = {},
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<{ data: Document[]; lastDoc?: any }> {
    const constraints: any[] = [
      where('createdBy', '==', userId),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    ]
    
    if (filters.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status))
    }
    
    if (filters.mimeType && filters.mimeType.length > 0) {
      constraints.push(where('mimeType', 'in', filters.mimeType))
    }
    
    if (filters.projectId) {
      constraints.push(where('projectId', '==', filters.projectId))
    }
    
    if (filters.partnerId) {
      constraints.push(where('partnerId', '==', filters.partnerId))
    }
    
    if (filters.aiProcessed !== undefined) {
      constraints.push(where('aiProcessed', '==', filters.aiProcessed))
    }
    
    return this.list<Document>(this.collectionName, constraints, pageSize, lastDoc)
  }

  async updateDocument(
    id: string, 
    data: UpdateDocumentData, 
    userId: string
  ): Promise<Document> {
    // 先檢查權限
    const existingDocument = await this.getDocument(id, userId)
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized')
    }

    return this.update<Document>(this.collectionName, id, data, userId)
  }

  async deleteDocument(id: string, userId: string, softDelete: boolean = true): Promise<void> {
    // 先檢查權限
    const existingDocument = await this.getDocument(id, userId)
    if (!existingDocument) {
      throw new Error('Document not found or unauthorized')
    }

    if (!softDelete) {
      // 硬刪除時同時刪除 Storage 中的檔案
      const storageRef = ref(storage, existingDocument.url)
      await deleteObject(storageRef)
    }

    await this.delete(this.collectionName, id, userId, softDelete)
  }

  async searchDocuments(
    userId: string,
    searchTerm: string,
    filters: any = {}
  ): Promise<Document[]> {
    const documents = await this.getDocuments(userId, filters)
    
    return documents.data.filter(document => 
      document.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.extractedText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  async getDocumentAnalytics(userId: string): Promise<{
    total: number
    byType: Record<string, number>
    byStatus: Record<string, number>
    totalSize: number
    aiProcessed: number
  }> {
    const documents = await this.getDocuments(userId)
    
    const analytics = documents.data.reduce((acc, document) => {
      acc.total++
      acc.totalSize += document.size
      
      // 按類型統計
      const type = document.mimeType.split('/')[0]
      acc.byType[type] = (acc.byType[type] || 0) + 1
      
      // 按狀態統計
      acc.byStatus[document.status] = (acc.byStatus[document.status] || 0) + 1
      
      // AI 處理統計
      if (document.aiProcessed) {
        acc.aiProcessed++
      }
      
      return acc
    }, {
      total: 0,
      byType: {},
      byStatus: {},
      totalSize: 0,
      aiProcessed: 0
    })
    
    return analytics
  }
}

export const documentService = new DocumentService()
```

## 安全規則配置

### 1. Firestore 安全規則

#### 基礎安全規則
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 使用者只能存取自己的資料
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // 檢查使用者是否已認證
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 檢查使用者角色
    function hasRole(role) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // 檢查使用者權限
    function hasPermission(permission) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions[permission] == true;
    }
    
    // 使用者集合
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      allow read: if hasRole('admin');
    }
    
    // 專案集合
    match /projects/{projectId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('projects:read');
      allow write: if hasPermission('projects:write');
    }
    
    // 夥伴集合
    match /partners/{partnerId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('partners:read');
      allow write: if hasPermission('partners:write');
    }
    
    // 文件集合
    match /documents/{documentId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('documents:read');
      allow write: if hasPermission('documents:write');
    }
    
    // 任務集合
    match /tasks/{taskId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('tasks:read');
      allow write: if hasPermission('tasks:write');
    }
    
    // 合約集合
    match /contracts/{contractId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('contracts:read');
      allow write: if hasPermission('contracts:write');
    }
    
    // 協作集合
    match /collaborations/{collaborationId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('collaborations:read');
      allow write: if hasPermission('collaborations:write');
    }
    
    // 分析集合
    match /analytics/{analyticsId} {
      allow read, write: if isOwner(resource.data.createdBy);
      allow read: if hasPermission('analytics:read');
      allow write: if hasPermission('analytics:write');
    }
    
    // 通知集合
    match /notifications/{notificationId} {
      allow read, write: if isOwner(resource.data.userId);
      allow read: if hasPermission('notifications:read');
    }
    
    // 稽核日誌集合
    match /audit_logs/{logId} {
      allow read: if hasRole('admin');
      allow write: if false; // 只允許系統寫入
    }
  }
}
```

### 2. Storage 安全規則

#### Storage 安全規則
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 使用者只能存取自己的檔案
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 公開檔案（如頭像）
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 系統檔案
    match /system/{allPaths=**} {
      allow read: if true;
      allow write: if false; // 只允許系統寫入
    }
  }
}
```

## 效能最佳化

### 1. 查詢最佳化

#### 索引配置
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "isDeleted", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "partners",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "documents",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdBy", "order": "ASCENDING" },
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 2. 快取策略

#### 客戶端快取
```typescript
// lib/cache/firebase-cache.ts
export class FirebaseCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  invalidate(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
  
  clear() {
    this.cache.clear()
  }
}

export const firebaseCache = new FirebaseCache()
```

## 監控和日誌

### 1. 效能監控

#### 查詢效能監控
```typescript
// lib/monitoring/firebase-monitoring.ts
export class FirebaseMonitoring {
  static trackQuery(collection: string, operation: string, duration: number) {
    // 追蹤查詢效能
    analytics.track('firebase_query', {
      collection,
      operation,
      duration,
      timestamp: Date.now()
    })
  }
  
  static trackError(collection: string, operation: string, error: Error) {
    // 追蹤錯誤
    errorReportingService.captureException(error, {
      tags: { 
        collection, 
        operation,
        service: 'firebase'
      }
    })
  }
  
  static trackUsage(collection: string, operation: string, documentCount: number) {
    // 追蹤使用量
    analytics.track('firebase_usage', {
      collection,
      operation,
      documentCount,
      timestamp: Date.now()
    })
  }
}
```

### 2. 稽核日誌

#### 操作日誌記錄
```typescript
// lib/services/audit-service.ts
export class AuditService {
  async logOperation(
    userId: string,
    operation: string,
    collection: string,
    documentId: string,
    details: any
  ) {
    const auditLog = {
      userId,
      operation,
      collection,
      documentId,
      details,
      timestamp: new Date(),
      ipAddress: 'client-ip', // 從請求中獲取
      userAgent: 'client-user-agent' // 從請求中獲取
    }
    
    await firebaseService.create(COLLECTIONS.AUDIT_LOGS, auditLog)
  }
}
```

## 最佳實踐

### 1. 資料建模

- 使用適當的資料類型（Timestamp, FieldValue）
- 實作軟刪除機制
- 使用版本控制追蹤變更
- 正規化資料避免重複

### 2. 安全性

- 實作適當的權限檢查
- 使用參數化查詢
- 驗證所有輸入資料
- 實作稽核日誌

### 3. 效能

- 使用適當的索引
- 實作分頁查詢
- 使用快取減少查詢
- 監控查詢效能

### 4. 可維護性

- 使用統一的服務層
- 實作錯誤處理
- 使用 TypeScript 類型
- 實作單元測試

這個 Firebase 整合實作模式確保了專案整合的資料安全性、效能和可維護性。