# Next.js 15 平行路由實作模式

## 核心概念

### 1. 平行路由基礎

平行路由允許在同一佈局中同時渲染多個頁面，每個槽（slot）可以獨立導航和更新。

#### 基本語法
```typescript
// 佈局元件接收所有槽的 props
export default function Layout({
  children,
  slot1,
  slot2,
  slot3
}: {
  children: React.ReactNode
  slot1: React.ReactNode
  slot2: React.ReactNode
  slot3: React.ReactNode
}) {
  return (
    <div>
      {children}
      <div className="slot1">{slot1}</div>
      <div className="slot2">{slot2}</div>
      <div className="slot3">{slot3}</div>
    </div>
  )
}
```

### 2. 專案整合的平行路由結構

#### 完整路由結構
```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/
│   │   └── page.tsx
│   └── sign-up/
│       └── page.tsx
├── (dashboard)/
│   ├── @portfolio/           # Portfolio 模組槽
│   │   ├── default.tsx       # 預設內容
│   │   ├── loading.tsx       # 載入狀態
│   │   ├── error.tsx         # 錯誤處理
│   │   ├── page.tsx          # 主要頁面
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── tasks/
│   │   │   └── page.tsx
│   │   └── contracts/
│   │       └── page.tsx
│   ├── @partners/            # PartnerVerse 模組槽
│   │   ├── default.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── page.tsx
│   │   ├── directory/
│   │   │   └── page.tsx
│   │   ├── relationships/
│   │   │   └── page.tsx
│   │   └── collaborations/
│   │       └── page.tsx
│   ├── @documents/           # DocuParse 模組槽
│   │   ├── default.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── page.tsx
│   │   ├── upload/
│   │   │   └── page.tsx
│   │   ├── library/
│   │   │   └── page.tsx
│   │   └── parser/
│   │       └── page.tsx
│   ├── @analytics/           # 分析模組槽
│   │   ├── default.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── page.tsx
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── insights/
│   │       └── page.tsx
│   ├── layout.tsx            # 儀表板佈局
│   ├── page.tsx              # 儀表板首頁
│   ├── loading.tsx           # 全域載入
│   └── error.tsx             # 全域錯誤
├── layout.tsx                # 根佈局
└── page.tsx                  # 首頁
```

## 實作模式

### 1. 條件渲染模式

#### 基於權限的條件渲染
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
  const { user } = useAuth()
  const permissions = usePermissions(user?.id)
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        {children}
        <div className="modules-grid">
          {permissions.portfolio && (
            <ErrorBoundary fallback={<ModuleError module="Portfolio" />}>
              <Suspense fallback={<ModuleSkeleton name="Portfolio" />}>
                {portfolio}
              </Suspense>
            </ErrorBoundary>
          )}
          
          {permissions.partners && (
            <ErrorBoundary fallback={<ModuleError module="Partners" />}>
              <Suspense fallback={<ModuleSkeleton name="Partners" />}>
                {partners}
              </Suspense>
            </ErrorBoundary>
          )}
          
          {permissions.documents && (
            <ErrorBoundary fallback={<ModuleError module="Documents" />}>
              <Suspense fallback={<ModuleSkeleton name="Documents" />}>
                {documents}
              </Suspense>
            </ErrorBoundary>
          )}
          
          {permissions.analytics && (
            <ErrorBoundary fallback={<ModuleError module="Analytics" />}>
              <Suspense fallback={<ModuleSkeleton name="Analytics" />}>
                {analytics}
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </main>
    </div>
  )
}
```

#### 基於路由的條件渲染
```typescript
// lib/hooks/use-module-visibility.ts
export function useModuleVisibility(currentPath: string, permissions: UserPermissions) {
  return useMemo(() => {
    const pathSegments = currentPath.split('/').filter(Boolean)
    
    return {
      portfolio: permissions.portfolio && (
        pathSegments.includes('portfolio') || 
        pathSegments.includes('projects') || 
        pathSegments.includes('tasks') || 
        pathSegments.includes('contracts')
      ),
      partners: permissions.partners && (
        pathSegments.includes('partners') || 
        pathSegments.includes('directory') || 
        pathSegments.includes('relationships')
      ),
      documents: permissions.documents && (
        pathSegments.includes('documents') || 
        pathSegments.includes('upload') || 
        pathSegments.includes('library')
      ),
      analytics: permissions.analytics && (
        pathSegments.includes('analytics') || 
        pathSegments.includes('overview') || 
        pathSegments.includes('reports')
      )
    }
  }, [currentPath, permissions])
}
```

### 2. 模組載入模式

#### 動態載入模組
```typescript
// components/dashboard/module-loader.tsx
'use client'

import dynamic from 'next/dynamic'
import { ModuleSkeleton } from '@/components/shared/module-skeleton'

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
  }),
  Analytics: dynamic(() => import('@/features/analytics'), {
    loading: () => <ModuleSkeleton name="Analytics" />,
    ssr: false
  })
}

interface ModuleLoaderProps {
  moduleName: keyof typeof ModuleComponents
  fallback?: React.ReactNode
}

export function ModuleLoader({ moduleName, fallback }: ModuleLoaderProps) {
  const Component = ModuleComponents[moduleName]
  
  if (!Component) {
    return fallback || <ModuleSkeleton name={moduleName} />
  }
  
  return <Component />
}
```

#### 智慧載入策略
```typescript
// lib/hooks/use-smart-module-loading.ts
export function useSmartModuleLoading(visibleModules: ModuleVisibility) {
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set())
  
  // 預載入可見模組
  useEffect(() => {
    const modulesToLoad = Object.entries(visibleModules)
      .filter(([_, visible]) => visible)
      .map(([name, _]) => name)
    
    modulesToLoad.forEach(moduleName => {
      if (!loadedModules.has(moduleName)) {
        // 觸發模組載入
        setLoadedModules(prev => new Set([...prev, moduleName]))
      }
    })
  }, [visibleModules, loadedModules])
  
  return loadedModules
}
```

### 3. 狀態同步模式

#### 跨模組狀態同步
```typescript
// lib/services/module-sync-service.ts
export class ModuleSyncService {
  private listeners = new Map<string, Set<() => void>>()
  
  subscribe(moduleName: string, callback: () => void) {
    if (!this.listeners.has(moduleName)) {
      this.listeners.set(moduleName, new Set())
    }
    this.listeners.get(moduleName)!.add(callback)
    
    return () => {
      this.listeners.get(moduleName)?.delete(callback)
    }
  }
  
  notify(moduleName: string) {
    this.listeners.get(moduleName)?.forEach(callback => callback())
  }
  
  notifyAll() {
    this.listeners.forEach((callbacks, moduleName) => {
      callbacks.forEach(callback => callback())
    })
  }
}

export const moduleSyncService = new ModuleSyncService()
```

#### 使用同步服務
```typescript
// 在 Portfolio 模組中
useEffect(() => {
  const unsubscribe = moduleSyncService.subscribe('partners', () => {
    // 當 partners 模組更新時，重新載入相關資料
    refetchProjects()
  })
  
  return unsubscribe
}, [refetchProjects])

// 在 Partners 模組中
const updatePartner = async (partnerId: string, data: PartnerData) => {
  await partnerService.update(partnerId, data)
  
  // 通知其他模組更新
  moduleSyncService.notify('portfolio')
  moduleSyncService.notify('documents')
}
```

## 錯誤處理模式

### 1. 分層錯誤處理

#### 模組級錯誤邊界
```typescript
// components/shared/module-error-boundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  moduleName: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ModuleErrorBoundary extends Component<Props, State> {
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
      tags: { module: this.props.moduleName },
      extra: errorInfo
    })
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <ModuleErrorFallback
          error={this.state.error}
          moduleName={this.props.moduleName}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    
    return this.props.children
  }
}
```

#### 錯誤回退元件
```typescript
// components/shared/module-error-fallback.tsx
interface ModuleErrorFallbackProps {
  error: Error | null
  moduleName: string
  onRetry: () => void
}

export function ModuleErrorFallback({ 
  error, 
  moduleName, 
  onRetry 
}: ModuleErrorFallbackProps) {
  return (
    <div className="module-error-fallback">
      <div className="error-icon">⚠️</div>
      <h3>{moduleName} 模組載入失敗</h3>
      <p className="error-message">
        {error?.message || '發生未知錯誤'}
      </p>
      <div className="error-actions">
        <button onClick={onRetry} className="retry-button">
          重試
        </button>
        <button onClick={() => window.location.reload()} className="reload-button">
          重新載入頁面
        </button>
      </div>
    </div>
  )
}
```

### 2. 載入狀態處理

#### 模組載入骨架
```typescript
// components/shared/module-skeleton.tsx
interface ModuleSkeletonProps {
  name: string
  variant?: 'compact' | 'full'
}

export function ModuleSkeleton({ name, variant = 'full' }: ModuleSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className="module-skeleton-compact">
        <div className="skeleton-title" />
        <div className="skeleton-content">
          <div className="skeleton-item" />
          <div className="skeleton-item" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="module-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title" />
        <div className="skeleton-actions">
          <div className="skeleton-button" />
          <div className="skeleton-button" />
        </div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-item" />
        <div className="skeleton-item" />
        <div className="skeleton-item" />
        <div className="skeleton-item" />
      </div>
    </div>
  )
}
```

## 效能最佳化

### 1. 程式碼分割策略

#### 路由級程式碼分割
```typescript
// 根據路由動態載入模組
const getModuleComponent = (moduleName: string) => {
  switch (moduleName) {
    case 'portfolio':
      return dynamic(() => import('@/features/portfolio'), {
        loading: () => <ModuleSkeleton name="Portfolio" />,
        ssr: false
      })
    case 'partners':
      return dynamic(() => import('@/features/partners'), {
        loading: () => <ModuleSkeleton name="Partners" />,
        ssr: false
      })
    case 'documents':
      return dynamic(() => import('@/features/documents'), {
        loading: () => <ModuleSkeleton name="Documents" />,
        ssr: false
      })
    case 'analytics':
      return dynamic(() => import('@/features/analytics'), {
        loading: () => <ModuleSkeleton name="Analytics" />,
        ssr: false
      })
    default:
      return null
  }
}
```

#### 條件載入策略
```typescript
// 根據使用者行為預載入模組
export function useModulePreloading(visibleModules: ModuleVisibility) {
  const preloadModule = useCallback((moduleName: string) => {
    switch (moduleName) {
      case 'portfolio':
        import('@/features/portfolio')
        break
      case 'partners':
        import('@/features/partners')
        break
      case 'documents':
        import('@/features/documents')
        break
      case 'analytics':
        import('@/features/analytics')
        break
    }
  }, [])
  
  // 當模組變為可見時預載入
  useEffect(() => {
    Object.entries(visibleModules).forEach(([name, visible]) => {
      if (visible) {
        preloadModule(name)
      }
    })
  }, [visibleModules, preloadModule])
  
  return preloadModule
}
```

### 2. 快取策略

#### 模組級快取
```typescript
// lib/cache/module-cache.ts
export class ModuleCache {
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
}

export const moduleCache = new ModuleCache()
```

## 最佳實踐

### 1. 檔案組織

- 每個槽都必須有 `default.tsx` 檔案
- 使用 `loading.tsx` 提供載入狀態
- 使用 `error.tsx` 處理錯誤情況
- 保持槽的檔案結構一致

### 2. 效能考量

- 使用 `Suspense` 包裝每個槽
- 實作錯誤邊界防止一個模組影響其他模組
- 使用動態載入減少初始 bundle 大小
- 實作智慧預載入策略

### 3. 狀態管理

- 避免在槽之間共享複雜狀態
- 使用事件系統進行模組間通訊
- 實作統一的快取策略
- 保持模組的獨立性

### 4. 錯誤處理

- 實作分層錯誤處理
- 提供有意义的錯誤訊息
- 實作重試機制
- 記錄錯誤到監控服務

這個平行路由實作模式確保了專案整合的模組化、可維護性和高效能。