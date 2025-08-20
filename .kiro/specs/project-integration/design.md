# 專案整合設計文件

## 概述

本設計文件詳細說明如何將四個獨立的 Next.js 專案整合成一個統一的現代化平台。設計採用 Next.js 15 App Router 的平行路由架構，確保各模組既能獨立運作又能緊密整合。

## 系統架構

### 整體架構圖

```mermaid
graph TB
    subgraph "Client Layer"
        UI[統一 UI 介面]
        PWA[Progressive Web App]
    end
    
    subgraph "Next.js 15 App Router"
        AR[App Router]
        PR[平行路由]
        RH[Route Handlers]
        MW[Middleware]
    end
    
    subgraph "功能模組"
        PM[Projects 模組]
        CM[Contracts 模組]
        PV[Partners 模組]
        DP[Documents 模組]
        AN[Analytics 模組]
    end
    
    subgraph "服務層"
        AS[認證服務]
        AIS[AI 服務]
        NS[通知服務]
        CS[快取服務]
    end
    
    subgraph "資料層"
        FB[Firebase]
        FS[Firestore]
        ST[Storage]
        RT[Realtime]
    end
    
    UI --> AR
    AR --> PR
    PR --> PM
    PR --> CM
    PR --> PV
    PR --> DP
    PR --> AN
    
    PM --> AS
    CM --> AS
    PV --> AS
    DP --> AS
    AN --> AS
    
    AS --> AIS
    AIS --> NS
    NS --> CS
    
    CS --> FB
    FB --> FS
    FB --> ST
    FB --> RT
```

### 技術棧架構

```mermaid
graph LR
    subgraph "前端技術"
        React[React 19]
        Next[Next.js 15]
        TS[TypeScript]
        TW[Tailwind CSS 4]
        SH[shadcn/ui]
    end
    
    subgraph "狀態管理"
        ZU[Zustand]
        RC[React Context]
        RHF[React Hook Form]
        SWR[SWR/TanStack Query]
    end
    
    subgraph "後端服務"
        CL[Clerk Auth]
        FB[Firebase]
        GK[Google Genkit]
        VE[Vercel]
    end
    
    subgraph "開發工具"
        ES[ESLint]
        PR[Prettier]
        HU[Husky]
        JE[Jest]
        PW[Playwright]
    end
```

## 平行路由設計

### 路由結構

```
app/
├── (auth)/                     # 認證路由群組
│   ├── layout.tsx
│   ├── sign-in/[[...sign-in]]/
│   └── sign-up/[[...sign-up]]/
├── (dashboard)/                # 主要應用路由群組
│   ├── @projects/              # 專案管理平行路由槽
│   ├── @contracts/             # 合約管理平行路由槽
│   ├── @partners/              # 夥伴管理平行路由槽
│   ├── @documents/             # 文檔處理平行路由槽
│   ├── @analytics/             # 分析儀表板平行路由槽
│   ├── layout.tsx              # 統一佈局
│   └── page.tsx                # 儀表板首頁
└── api/                        # Route Handlers
```

### 平行路由實作

```typescript
// app/(dashboard)/layout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode
  projects: React.ReactNode
  contracts: React.ReactNode
  partners: React.ReactNode
  documents: React.ReactNode
  analytics: React.ReactNode
}

export default function DashboardLayout({
  children,
  projects,
  contracts,
  partners,
  documents,
  analytics
}: DashboardLayoutProps) {
  const { user, permissions } = useAuth()
  const { activeModules } = useModuleVisibility(permissions)
  
  return (
    <div className="dashboard-layout">
      <AppSidebar />
      <main className="main-content">
        <Header />
        <div className="content-area">
          {children}
          <div className="modules-grid">
            {activeModules.projects && (
              <Suspense fallback={<ModuleSkeleton name="Projects" />}>
                {projects}
              </Suspense>
            )}
            {activeModules.contracts && (
              <Suspense fallback={<ModuleSkeleton name="Contracts" />}>
                {contracts}
              </Suspense>
            )}
            {activeModules.partners && (
              <Suspense fallback={<ModuleSkeleton name="Partners" />}>
                {partners}
              </Suspense>
            )}
            {activeModules.documents && (
              <Suspense fallback={<ModuleSkeleton name="Documents" />}>
                {documents}
              </Suspense>
            )}
            {activeModules.analytics && (
              <Suspense fallback={<ModuleSkeleton name="Analytics" />}>
                {analytics}
              </Suspense>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
```

## 元件架構設計

### UI 元件層次結構

```mermaid
graph TD
    subgraph "UI 元件層次"
        A[shadcn/ui 基礎元件] --> B[共用業務元件]
        B --> C[模組專用元件]
        C --> D[頁面元件]
        
        A1[Button, Input, Card] --> B1[DataTable, SearchInput]
        B1 --> C1[ProjectCard, PartnerCard]
        C1 --> D1[ProjectList, PartnerDirectory]
    end
```

### 元件設計原則

```typescript
// 基礎元件範例
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

// 業務元件範例
interface BusinessComponentProps extends BaseComponentProps {
  data: DataType
  onAction?: (action: ActionType) => void
  loading?: boolean
  error?: Error | null
}

// 模組元件範例
interface ModuleComponentProps extends BusinessComponentProps {
  moduleConfig: ModuleConfig
  permissions: UserPermissions
}
```

## 資料架構設計

### 統一資料模型

```typescript
// 核心實體定義
interface BaseEntity {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string
  updatedBy: string
}

interface User extends BaseEntity {
  email: string
  name: string
  avatar?: string
  role: UserRole
  permissions: Permission[]
  preferences: UserPreferences
}

interface Project extends BaseEntity {
  title: string
  description: string
  status: ProjectStatus
  priority: Priority
  startDate: Date
  endDate?: Date
  progress: number
  tags: string[]
  // 關聯資料
  partnerId?: string
  documentIds: string[]
  taskIds: string[]
  contractIds: string[]
}

interface Partner extends BaseEntity {
  name: string
  type: PartnerType
  contactInfo: ContactInfo
  relationship: RelationshipType
  status: PartnerStatus
  // 關聯資料
  projectIds: string[]
  documentIds: string[]
  collaborationIds: string[]
}

interface Document extends BaseEntity {
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  // AI 處理結果
  extractedText?: string
  summary?: string
  keywords: string[]
  entities: ExtractedEntity[]
  // 關聯資料
  projectId?: string
  partnerId?: string
  contractId?: string
}
```

### 資料關係圖

```mermaid
erDiagram
    User ||--o{ Project : creates
    User ||--o{ Partner : manages
    User ||--o{ Document : uploads
    
    Project ||--o{ Task : contains
    Project ||--o{ Contract : has
    Project }o--o{ Partner : collaborates
    Project ||--o{ Document : references
    
    Partner ||--o{ Collaboration : participates
    Partner ||--o{ Document : shares
    
    Document ||--o{ AIAnalysis : generates
    Document }o--|| Contract : represents
    
    Task ||--o{ Subtask : breaks_into
    Task }o--|| Project : belongs_to
```

## 認證與授權設計

### Clerk 整合架構

```typescript
// 認證配置
const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding'
}

// 權限系統設計
interface Permission {
  resource: string // 'projects', 'partners', 'documents'
  action: string   // 'create', 'read', 'update', 'delete'
  scope: string    // 'own', 'team', 'all'
}

interface Role {
  name: string
  permissions: Permission[]
}

// 預定義角色
const roles: Record<string, Role> = {
  admin: {
    name: 'Administrator',
    permissions: [
      { resource: '*', action: '*', scope: 'all' }
    ]
  },
  manager: {
    name: 'Project Manager',
    permissions: [
      { resource: 'projects', action: '*', scope: 'team' },
      { resource: 'partners', action: 'read', scope: 'all' },
      { resource: 'documents', action: '*', scope: 'team' }
    ]
  },
  user: {
    name: 'Regular User',
    permissions: [
      { resource: 'projects', action: '*', scope: 'own' },
      { resource: 'partners', action: 'read', scope: 'all' },
      { resource: 'documents', action: '*', scope: 'own' }
    ]
  }
}
```

### 中間件設計

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { auth } = getAuth(request)
  
  // 公開路由
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  
  // 認證檢查
  if (!auth.userId) {
    return redirectToSignIn({ returnBackUrl: request.url })
  }
  
  // 權限檢查
  const hasPermission = await checkPermission(
    auth.userId,
    request.nextUrl.pathname,
    request.method
  )
  
  if (!hasPermission) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
  
  return NextResponse.next()
}
```

## AI 服務整合設計

### 統一 AI 服務架構

```typescript
// AI 服務抽象層
interface AIService {
  generateSubtasks(project: Project): Promise<Subtask[]>
  summarizeDocument(document: Document): Promise<DocumentSummary>
  suggestPartners(project: Project): Promise<Partner[]>
  generateInsights(data: CrossModuleData): Promise<Insights>
}

// Google Genkit 實作
class GenkitAIService implements AIService {
  private genkit: Genkit
  
  constructor() {
    this.genkit = configureGenkit({
      plugins: [googleAI()],
      logLevel: 'debug'
    })
  }
  
  async generateSubtasks(project: Project): Promise<Subtask[]> {
    const flow = defineFlow(
      {
        name: 'generateSubtasks',
        inputSchema: projectSchema,
        outputSchema: subtasksSchema
      },
      async (input) => {
        const prompt = `
          Based on the project: ${input.title}
          Description: ${input.description}
          Generate 5-10 specific subtasks that would help complete this project.
        `
        
        const response = await generate({
          model: gemini15Flash,
          prompt
        })
        
        return parseSubtasks(response.text())
      }
    )
    
    return await runFlow(flow, project)
  }
}
```

### AI 流程設計

```mermaid
graph TD
    A[使用者請求] --> B{AI 服務類型}
    B -->|專案分析| C[專案 AI 流程]
    B -->|文件處理| D[文件 AI 流程]
    B -->|夥伴建議| E[夥伴 AI 流程]
    B -->|跨模組分析| F[整合 AI 流程]
    
    C --> G[Genkit 處理]
    D --> G
    E --> G
    F --> G
    
    G --> H[結果快取]
    H --> I[回傳結果]
```

## 狀態管理設計

### Zustand Store 架構

```typescript
// 全域狀態結構
interface AppState {
  // 認證狀態
  auth: AuthState
  // UI 狀態
  ui: UIState
  // 模組狀態
  projects: ProjectsState
  contracts: ContractsState
  partners: PartnersState
  documents: DocumentsState
  analytics: AnalyticsState
}

// 認證 Store
interface AuthState {
  user: User | null
  permissions: Permission[]
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User) => void
  setPermissions: (permissions: Permission[]) => void
  logout: () => void
  checkPermission: (resource: string, action: string) => boolean
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // 狀態
  user: null,
  permissions: [],
  isLoading: false,
  error: null,
  
  // 動作
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  logout: () => set({ user: null, permissions: [] }),
  checkPermission: (resource, action) => {
    const { permissions } = get()
    return permissions.some(p => 
      (p.resource === resource || p.resource === '*') &&
      (p.action === action || p.action === '*')
    )
  }
}))
```

### 跨模組資料同步

```typescript
// 資料同步服務
class DataSyncService {
  private stores: Map<string, any> = new Map()
  
  registerStore(name: string, store: any) {
    this.stores.set(name, store)
  }
  
  async syncData(entityType: string, entityId: string, data: any) {
    // 更新相關的所有 stores
    for (const [name, store] of this.stores) {
      if (store.updateEntity) {
        await store.updateEntity(entityType, entityId, data)
      }
    }
    
    // 觸發相關的 UI 更新
    this.notifySubscribers(entityType, entityId, data)
  }
  
  private notifySubscribers(entityType: string, entityId: string, data: any) {
    // 實作訂閱者通知邏輯
  }
}
```

## 資料處理設計

### Server Actions 架構

基於 Next.js 15 的最佳實踐，我們使用 Server Actions 取代傳統的 API Routes：

```typescript
// lib/actions/projects-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { projectService } from '@/lib/services/project-service'
import { projectCreateSchema } from '@/lib/validations/projects.schemas'

export async function createProject(formData: FormData) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
    }

    const validatedData = projectCreateSchema.parse(rawData)
    
    const project = await projectService.createProject({
      ...validatedData,
      createdBy: userId
    })

    revalidateTag('projects')
    revalidatePath('/dashboard/projects')
    
    return { success: true, data: project }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
    }

    const project = await projectService.updateProject(projectId, rawData, userId)

    revalidateTag('projects')
    revalidateTag(`project-${projectId}`)
    
    return { success: true, data: project }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function deleteProject(projectId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    await projectService.deleteProject(projectId, userId)
    
    revalidateTag('projects')
    revalidatePath('/dashboard/projects')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

### TanStack Query 整合

使用 @tanstack/react-query 進行客戶端狀態管理和 Firebase 整合：

```typescript
// lib/queries/projects-queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { projectService } from '@/lib/services/project-service'
import { createProject, updateProject, deleteProject } from '@/lib/actions/projects-actions'

export function useProjects() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: () => projectService.getProjects(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProject(projectId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      }
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      updateProject(projectId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
      }
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      }
    },
  })
}
```

### Firebase 整合設計

使用 Firebase v9+ 的模組化 SDK 和 TanStack Query Firebase：

```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  // Firebase 配置
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

// 開發環境連接模擬器
if (process.env.NODE_ENV === 'development') {
  if (!globalThis.__FIREBASE_EMULATOR_CONNECTED) {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectStorageEmulator(storage, 'localhost', 9199)
    globalThis.__FIREBASE_EMULATOR_CONNECTED = true
  }
}

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
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export class FirebaseService {
  async create<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...data, createdAt: now, updatedAt: now }
  }

  async read<T>(collectionName: string, id: string): Promise<T | null> {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>) {
    const docRef = doc(db, collectionName, id)
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    }
    await updateDoc(docRef, updateData)
    return updateData
  }

  async delete(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  }

  async list<T>(
    collectionName: string, 
    constraints: {
      where?: [string, any, any][]
      orderBy?: [string, 'asc' | 'desc'][]
      limit?: number
    } = {}
  ): Promise<T[]> {
    let q = collection(db, collectionName)
    
    if (constraints.where) {
      constraints.where.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value))
      })
    }
    
    if (constraints.orderBy) {
      constraints.orderBy.forEach(([field, direction]) => {
        q = query(q, orderBy(field, direction))
      })
    }
    
    if (constraints.limit) {
      q = query(q, limit(constraints.limit))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[]
  }
}

// lib/services/project-service.ts
import { FirebaseService } from './firebase-service'
import { Project, CreateProjectData } from '@/types/projects.types'

export class ProjectService extends FirebaseService {
  private collectionName = 'projects'

  async createProject(data: CreateProjectData): Promise<Project> {
    return this.create<Project>(this.collectionName, data)
  }

  async getProject(id: string, userId: string): Promise<Project | null> {
    const project = await this.read<Project>(this.collectionName, id)
    
    // 檢查權限
    if (project && project.createdBy !== userId) {
      throw new Error('Unauthorized')
    }
    
    return project
  }

  async getProjects(userId: string): Promise<Project[]> {
    return this.list<Project>(this.collectionName, {
      where: [['createdBy', '==', userId]],
      orderBy: [['updatedAt', 'desc']],
    })
  }

  async updateProject(id: string, data: Partial<Project>, userId: string): Promise<Project> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    await this.update(this.collectionName, id, data)
    return { ...existingProject, ...data } as Project
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    // 先檢查權限
    const existingProject = await this.getProject(id, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    await this.delete(this.collectionName, id)
  }
}

export const projectService = new ProjectService()
```

## 效能最佳化設計

### 快取策略

```mermaid
graph TD
    A[使用者請求] --> B{快取檢查}
    B -->|命中| C[返回快取資料]
    B -->|未命中| D[查詢資料庫]
    D --> E[更新快取]
    E --> F[返回資料]
    
    G[資料更新] --> H[無效化快取]
    H --> I[更新相關快取]
```

### 程式碼分割策略

```typescript
// 動態載入策略
const ModuleComponents = {
  Projects: dynamic(() => import('@/features/projects'), {
    loading: () => <ModuleSkeleton name="Projects" />,
    ssr: false
  }),
  Contracts: dynamic(() => import('@/features/contracts'), {
    loading: () => <ModuleSkeleton name="Contracts" />,
    ssr: false
  }),
  Partners: dynamic(() => import('@/features/partners'), {
    loading: () => <ModuleSkeleton name="Partners" />,
    ssr: false
  }),
  Documents: dynamic(() => import('@/features/documents'), {
    loading: () => <ModuleSkeleton name="Documents" />,
    ssr: false
  })
}

// 條件載入
export default function Dashboard({ activeModules }: DashboardProps) {
  return (
    <div className="dashboard">
      {activeModules.map(module => {
        const Component = ModuleComponents[module]
        return Component ? <Component key={module} /> : null
      })}
    </div>
  )
}
```

## 錯誤處理設計

### 錯誤邊界架構

```typescript
// 全域錯誤邊界
class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤到監控服務
    errorReportingService.captureException(error, {
      extra: errorInfo,
      tags: { component: 'GlobalErrorBoundary' }
    })
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    
    return this.props.children
  }
}

// 模組級錯誤邊界
const ModuleErrorBoundary = ({ children, moduleName }: Props) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ModuleErrorFallback
          error={error}
          moduleName={moduleName}
          onRetry={resetErrorBoundary}
        />
      )}
      onError={(error, errorInfo) => {
        errorReportingService.captureException(error, {
          tags: { module: moduleName },
          extra: errorInfo
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
```

## 測試策略設計

### 測試金字塔

```mermaid
graph TD
    A[E2E 測試] --> B[整合測試]
    B --> C[單元測試]
    
    A1[Playwright<br/>跨模組流程測試] --> B1[API 測試<br/>模組間整合測試]
    B1 --> C1[Jest + Testing Library<br/>元件和函數測試]
```

### 測試覆蓋率目標

- **單元測試**: > 80% 程式碼覆蓋率
- **整合測試**: > 70% API 端點覆蓋
- **E2E 測試**: 100% 關鍵使用者流程覆蓋

這個設計確保了系統的可維護性、可擴展性和高效能，同時提供了優秀的使用者體驗和開發者體驗。