# Next.js 15 專案整合實施指南

## 核心技術架構

### 1. App Router 平行路由實作

#### 基本平行路由結構
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
  portfolio,
  partners,
  documents,
  analytics
}: {
  children: React.ReactNode
  portfolio: React.ReactNode
  partners: React.ReactNode
  documents: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {children}
        <div className="modules-container">
          {portfolio}
          {partners}
          {documents}
          {analytics}
        </div>
      </main>
    </div>
  )
}
```

#### 平行路由槽檔案結構
```
app/(dashboard)/
├── @portfolio/
│   ├── default.tsx      # 預設內容
│   ├── loading.tsx      # 載入狀態
│   ├── error.tsx        # 錯誤處理
│   └── page.tsx         # 主要頁面
├── @partners/
│   ├── default.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
├── @documents/
│   ├── default.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
├── @analytics/
│   ├── default.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── page.tsx
├── layout.tsx
└── page.tsx
```

### 2. Server Actions 實作模式

#### 基本 Server Action 結構
```typescript
// lib/actions/portfolio-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

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
    revalidatePath('/dashboard/portfolio')
    
    return { success: true, data: project }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

#### 條件渲染和權限控制
```typescript
// lib/hooks/use-module-visibility.ts
export function useModuleVisibility(permissions: UserPermissions) {
  return useMemo(() => ({
    portfolio: permissions.includes('portfolio:read'),
    partners: permissions.includes('partners:read'),
    documents: permissions.includes('documents:read'),
    analytics: permissions.includes('analytics:read'),
  }), [permissions])
}

// 在 layout 中使用
export default function DashboardLayout({ ... }) {
  const { user } = useAuth()
  const permissions = usePermissions(user?.id)
  const visibleModules = useModuleVisibility(permissions)
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {children}
        <div className="modules-container">
          {visibleModules.portfolio && (
            <ErrorBoundary fallback={<ModuleError module="Portfolio" />}>
              <Suspense fallback={<ModuleSkeleton />}>
                {portfolio}
              </Suspense>
            </ErrorBoundary>
          )}
          {/* 其他模組... */}
        </div>
      </main>
    </div>
  )
}
```

### 3. 錯誤處理和載入狀態

#### 模組級錯誤邊界
```typescript
// components/shared/module-error-boundary.tsx
'use client'

export function ModuleErrorBoundary({ 
  children, 
  moduleName 
}: { 
  children: React.ReactNode
  moduleName: string 
}) {
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

#### 載入狀態元件
```typescript
// components/shared/module-skeleton.tsx
export function ModuleSkeleton({ name }: { name: string }) {
  return (
    <div className="module-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title" />
        <div className="skeleton-actions" />
      </div>
      <div className="skeleton-content">
        <div className="skeleton-item" />
        <div className="skeleton-item" />
        <div className="skeleton-item" />
      </div>
    </div>
  )
}
```

## 資料層整合

### 1. Firebase 服務層

#### 統一 Firebase 服務
```typescript
// lib/services/firebase-service.ts
export class FirebaseService {
  private db = getFirestore()
  
  async create<T>(collection: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(this.db, collection), {
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return { id: docRef.id, ...data, createdAt: now, updatedAt: now }
  }

  async read<T>(collection: string, id: string): Promise<T | null> {
    const docRef = doc(this.db, collection, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  }

  async update<T>(collection: string, id: string, data: Partial<T>) {
    const docRef = doc(this.db, collection, id)
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    }
    await updateDoc(docRef, updateData)
    return updateData
  }

  async delete(collection: string, id: string) {
    const docRef = doc(this.db, collection, id)
    await deleteDoc(docRef)
  }

  async list<T>(
    collection: string, 
    constraints: {
      where?: [string, any, any][]
      orderBy?: [string, 'asc' | 'desc'][]
      limit?: number
    } = {}
  ): Promise<T[]> {
    let q = collection(this.db, collection)
    
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
```

### 2. TanStack Query 整合

#### Query Hooks 實作
```typescript
// lib/queries/portfolio-queries.ts
export function useProjects() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: () => projectService.getProjects(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
```

## 效能最佳化

### 1. 程式碼分割策略

#### 動態載入大型模組
```typescript
// 動態載入策略
const ModuleComponents = {
  Portfolio: dynamic(() => import('@/features/portfolio'), {
    loading: () => <ModuleSkeleton name="Portfolio" />,
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

### 2. 快取策略

#### Next.js 15 快取策略
```typescript
// 快取策略
export async function getProjects(userId: string) {
  const projects = await fetch(`/api/projects?userId=${userId}`, {
    next: { 
      revalidate: 300, // 5 分鐘
      tags: ['projects', `user-${userId}`] 
    }
  })
  
  return projects.json()
}

// TanStack Query 快取
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 分鐘
    gcTime: 10 * 60 * 1000,   // 10 分鐘
  })
}
```

## 開發工作流程

### 1. 功能開發流程

1. **定義 Server Action**
   ```typescript
   // lib/actions/feature-actions.ts
   'use server'
   export async function createFeature(formData: FormData) { ... }
   ```

2. **建立 TanStack Query Hook**
   ```typescript
   // lib/queries/feature-queries.ts
   export function useCreateFeature() { ... }
   ```

3. **實作 UI 元件**
   ```typescript
   // components/feature/feature-form.tsx
   export function FeatureForm() {
     const createFeature = useCreateFeature()
     // ...
   }
   ```

4. **整合到平行路由**
   ```typescript
   // app/(dashboard)/@feature/page.tsx
   export default function FeaturePage() { ... }
   ```

### 2. 測試策略

#### 測試 Server Actions
```typescript
// 測試 Server Actions
describe('createProject', () => {
  it('should create project successfully', async () => {
    const formData = new FormData()
    formData.append('title', 'Test Project')
    
    const result = await createProject(formData)
    expect(result.success).toBe(true)
  })
})
```

#### 測試 TanStack Query Hooks
```typescript
// 測試 TanStack Query Hooks
describe('useCreateProject', () => {
  it('should handle mutation correctly', async () => {
    const { result } = renderHook(() => useCreateProject(), {
      wrapper: QueryClientProvider,
    })
    
    await act(async () => {
      result.current.mutate(mockFormData)
    })
    
    expect(result.current.isSuccess).toBe(true)
  })
})
```

## 部署考量

### 1. 環境配置

#### Next.js 配置
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-domain.com'],
    },
  },
  // 其他配置...
}
```

### 2. 效能監控

#### 監控 Server Actions 效能
```typescript
// lib/monitoring.ts
export function trackServerAction(actionName: string, duration: number) {
  // 監控 Server Actions 效能
  analytics.track('server_action', {
    action: actionName,
    duration,
    timestamp: Date.now(),
  })
}
```

## 關鍵實作要點

1. **平行路由必須有 default.tsx** - 避免 404 錯誤
2. **Server Actions 必須使用 'use server' 指令**
3. **錯誤邊界要分層處理** - 全域、模組級、元件級
4. **快取策略要一致** - Next.js 快取 + TanStack Query 快取
5. **權限檢查要在多層實施** - 中間件、Server Actions、UI 元件
6. **程式碼分割要智慧化** - 根據權限和路由條件載入
7. **狀態管理要分層** - 伺服器狀態、客戶端狀態、表單狀態

這個指南確保了整合專案能夠充分利用 Next.js 15 的最新特性，建立高效能、可維護的現代化應用程式。