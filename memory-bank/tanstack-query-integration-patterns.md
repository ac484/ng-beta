# TanStack Query 整合實作模式

## 核心概念

### 1. TanStack Query 基礎

TanStack Query 是專案整合中管理伺服器狀態的核心庫，提供資料獲取、快取、同步和更新功能。

#### 基本配置
```typescript
// lib/providers/query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 分鐘
            gcTime: 10 * 60 * 1000,   // 10 分鐘
            retry: (failureCount, error) => {
              // 自定義重試邏輯
              if (error instanceof Error && error.message.includes('Unauthorized')) {
                return false // 認證錯誤不重試
              }
              return failureCount < 3
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false, // 突變不重試
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

#### SSR 配置
```typescript
// lib/providers/ssr-query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function SSRQueryProvider({ 
  children, 
  dehydratedState 
}: { 
  children: React.ReactNode
  dehydratedState: any 
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // SSR 時設定較長的 staleTime
            gcTime: 5 * 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
```

## 實作模式

### 1. 基礎查詢 Hooks

#### 專案查詢 Hooks
```typescript
// lib/queries/portfolio-queries.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { projectService } from '@/lib/services/project-service'
import { projectCreateSchema, projectUpdateSchema } from '@/lib/validations/portfolio.schemas'

export function useProjects(filters?: ProjectFilters) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['projects', userId, filters],
    queryFn: () => projectService.getProjects(userId!, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useProject(projectId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['project', projectId, userId],
    queryFn: () => projectService.getProject(projectId, userId!),
    enabled: !!userId && !!projectId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useProjectsInfinite(filters?: ProjectFilters) {
  const { userId } = useAuth()
  
  return useInfiniteQuery({
    queryKey: ['projects-infinite', userId, filters],
    queryFn: ({ pageParam }) => 
      projectService.getProjects(userId!, filters, 20, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProjectStats() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['project-stats', userId],
    queryFn: () => projectService.getProjectStats(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}
```

#### 夥伴查詢 Hooks
```typescript
// lib/queries/partners-queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { partnerService } from '@/lib/services/partner-service'

export function usePartners(filters?: PartnerFilters) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['partners', userId, filters],
    queryFn: () => partnerService.getPartners(userId!, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePartner(partnerId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['partner', partnerId, userId],
    queryFn: () => partnerService.getPartner(partnerId, userId!),
    enabled: !!userId && !!partnerId,
    staleTime: 2 * 60 * 1000,
  })
}

export function usePartnerNetwork() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['partner-network', userId],
    queryFn: () => partnerService.getPartnerNetwork(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}
```

#### 文件查詢 Hooks
```typescript
// lib/queries/documents-queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { documentService } from '@/lib/services/document-service'

export function useDocuments(filters?: DocumentFilters) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['documents', userId, filters],
    queryFn: () => documentService.getDocuments(userId!, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDocument(documentId: string) {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['document', documentId, userId],
    queryFn: () => documentService.getDocument(documentId, userId!),
    enabled: !!userId && !!documentId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useDocumentAnalytics() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['document-analytics', userId],
    queryFn: () => documentService.getDocumentAnalytics(userId!),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000,
  })
}
```

### 2. 突變 Hooks

#### 專案突變 Hooks
```typescript
// lib/mutations/portfolio-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { createProject, updateProject, deleteProject } from '@/lib/actions/portfolio-actions'
import { toast } from 'sonner'

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.success) {
        // 重新驗證相關查詢
        queryClient.invalidateQueries({ queryKey: ['projects', userId] })
        queryClient.invalidateQueries({ queryKey: ['project-stats', userId] })
        
        toast.success('專案建立成功')
      } else {
        toast.error(data.error || '專案建立失敗')
      }
    },
    onError: (error) => {
      toast.error('專案建立失敗')
      console.error('Create project error:', error)
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      updateProject(projectId, formData),
    onSuccess: (data, variables) => {
      if (data.success) {
        // 重新驗證相關查詢
        queryClient.invalidateQueries({ queryKey: ['projects', userId] })
        queryClient.invalidateQueries({ queryKey: ['project', variables.projectId, userId] })
        queryClient.invalidateQueries({ queryKey: ['project-stats', userId] })
        
        toast.success('專案更新成功')
      } else {
        toast.error(data.error || '專案更新失敗')
      }
    },
    onError: (error) => {
      toast.error('專案更新失敗')
      console.error('Update project error:', error)
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (data, projectId) => {
      if (data.success) {
        // 重新驗證相關查詢
        queryClient.invalidateQueries({ queryKey: ['projects', userId] })
        queryClient.invalidateQueries({ queryKey: ['project-stats', userId] })
        
        // 從快取中移除已刪除的專案
        queryClient.removeQueries({ queryKey: ['project', projectId, userId] })
        
        toast.success('專案刪除成功')
      } else {
        toast.error(data.error || '專案刪除失敗')
      }
    },
    onError: (error) => {
      toast.error('專案刪除失敗')
      console.error('Delete project error:', error)
    },
  })
}
```

#### 批次操作 Hooks
```typescript
// lib/mutations/batch-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { batchUpdateProjects, batchDeleteProjects } from '@/lib/actions/portfolio-actions'
import { toast } from 'sonner'

export function useBatchUpdateProjects() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: batchUpdateProjects,
    onSuccess: (data) => {
      if (data.success) {
        // 重新驗證相關查詢
        queryClient.invalidateQueries({ queryKey: ['projects', userId] })
        queryClient.invalidateQueries({ queryKey: ['project-stats', userId] })
        
        toast.success(`成功更新 ${data.data.updated} 個專案`)
        
        if (data.data.failed > 0) {
          toast.warning(`${data.data.failed} 個專案更新失敗`)
        }
      } else {
        toast.error(data.error || '批次更新失敗')
      }
    },
    onError: (error) => {
      toast.error('批次更新失敗')
      console.error('Batch update error:', error)
    },
  })
}

export function useBatchDeleteProjects() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: batchDeleteProjects,
    onSuccess: (data) => {
      if (data.success) {
        // 重新驗證相關查詢
        queryClient.invalidateQueries({ queryKey: ['projects', userId] })
        queryClient.invalidateQueries({ queryKey: ['project-stats', userId] })
        
        toast.success(`成功刪除 ${data.data.deleted} 個專案`)
        
        if (data.data.failed > 0) {
          toast.warning(`${data.data.failed} 個專案刪除失敗`)
        }
      } else {
        toast.error(data.error || '批次刪除失敗')
      }
    },
    onError: (error) => {
      toast.error('批次刪除失敗')
      console.error('Batch delete error:', error)
    },
  })
}
```

### 3. 樂觀更新模式

#### 樂觀更新實作
```typescript
// lib/mutations/optimistic-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { updateProject } from '@/lib/actions/portfolio-actions'

export function useOptimisticUpdateProject() {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn: ({ projectId, formData }: { projectId: string; formData: FormData }) =>
      updateProject(projectId, formData),
    onMutate: async ({ projectId, formData }) => {
      // 取消進行中的查詢
      await queryClient.cancelQueries({ queryKey: ['project', projectId, userId] })
      await queryClient.cancelQueries({ queryKey: ['projects', userId] })
      
      // 儲存之前的資料
      const previousProject = queryClient.getQueryData(['project', projectId, userId])
      const previousProjects = queryClient.getQueryData(['projects', userId])
      
      // 樂觀更新專案資料
      const updatedData = Object.fromEntries(formData)
      queryClient.setQueryData(['project', projectId, userId], (old: any) => ({
        ...old,
        ...updatedData,
        updatedAt: new Date(),
      }))
      
      // 樂觀更新專案列表
      queryClient.setQueryData(['projects', userId], (old: any) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((project: any) =>
            project.id === projectId
              ? { ...project, ...updatedData, updatedAt: new Date() }
              : project
          ),
        }
      })
      
      return { previousProject, previousProjects }
    },
    onError: (error, variables, context) => {
      // 發生錯誤時恢復之前的資料
      if (context?.previousProject) {
        queryClient.setQueryData(
          ['project', variables.projectId, userId],
          context.previousProject
        )
      }
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', userId], context.previousProjects)
      }
    },
    onSettled: (data, error, variables) => {
      // 無論成功或失敗都重新驗證
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId, userId] })
      queryClient.invalidateQueries({ queryKey: ['projects', userId] })
    },
  })
}
```

### 4. 查詢預取模式

#### 路由預取
```typescript
// lib/hooks/use-prefetch.ts
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { projectService } from '@/lib/services/project-service'
import { partnerService } from '@/lib/services/partner-service'

export function usePrefetch() {
  const queryClient = useQueryClient()
  const router = useRouter()
  
  const prefetchProject = async (projectId: string, userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['project', projectId, userId],
      queryFn: () => projectService.getProject(projectId, userId),
      staleTime: 2 * 60 * 1000,
    })
  }
  
  const prefetchPartner = async (partnerId: string, userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['partner', partnerId, userId],
      queryFn: () => partnerService.getPartner(partnerId, userId),
      staleTime: 2 * 60 * 1000,
    })
  }
  
  const prefetchProjects = async (userId: string, filters?: any) => {
    await queryClient.prefetchQuery({
      queryKey: ['projects', userId, filters],
      queryFn: () => projectService.getProjects(userId, filters),
      staleTime: 5 * 60 * 1000,
    })
  }
  
  return {
    prefetchProject,
    prefetchPartner,
    prefetchProjects,
  }
}
```

#### 滑鼠懸停預取
```typescript
// components/shared/prefetch-link.tsx
'use client'

import Link from 'next/link'
import { usePrefetch } from '@/lib/hooks/use-prefetch'
import { useAuth } from '@/hooks/use-auth'

interface PrefetchLinkProps {
  href: string
  children: React.ReactNode
  prefetchType: 'project' | 'partner' | 'projects'
  prefetchId?: string
  className?: string
}

export function PrefetchLink({ 
  href, 
  children, 
  prefetchType, 
  prefetchId, 
  className 
}: PrefetchLinkProps) {
  const { prefetchProject, prefetchPartner, prefetchProjects } = usePrefetch()
  const { userId } = useAuth()
  
  const handleMouseEnter = async () => {
    if (!userId) return
    
    try {
      switch (prefetchType) {
        case 'project':
          if (prefetchId) {
            await prefetchProject(prefetchId, userId)
          }
          break
        case 'partner':
          if (prefetchId) {
            await prefetchPartner(prefetchId, userId)
          }
          break
        case 'projects':
          await prefetchProjects(userId)
          break
      }
    } catch (error) {
      console.error('Prefetch error:', error)
    }
  }
  
  return (
    <Link 
      href={href} 
      className={className}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </Link>
  )
}
```

### 5. 錯誤處理和重試

#### 自定義錯誤處理
```typescript
// lib/hooks/use-query-error-handler.ts
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function useQueryErrorHandler(error: Error | null) {
  const { reset } = useQueryErrorResetBoundary()
  
  useEffect(() => {
    if (error) {
      // 根據錯誤類型顯示不同的訊息
      if (error.message.includes('Unauthorized')) {
        toast.error('請重新登入')
        // 可以重定向到登入頁面
      } else if (error.message.includes('Network')) {
        toast.error('網路連線問題，請檢查網路設定')
      } else if (error.message.includes('Timeout')) {
        toast.error('請求超時，請稍後再試')
      } else {
        toast.error('發生未知錯誤，請稍後再試')
      }
      
      console.error('Query error:', error)
    }
  }, [error])
  
  return { reset }
}
```

#### 重試策略
```typescript
// lib/config/query-retry-config.ts
export const queryRetryConfig = {
  // 認證錯誤不重試
  retry: (failureCount: number, error: Error) => {
    if (error.message.includes('Unauthorized')) {
      return false
    }
    
    // 網路錯誤重試 3 次
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      return failureCount < 3
    }
    
    // 伺服器錯誤重試 2 次
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return failureCount < 2
    }
    
    // 其他錯誤重試 1 次
    return failureCount < 1
  },
  
  // 指數退避重試延遲
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
}
```

### 6. 快取管理

#### 快取標籤管理
```typescript
// lib/cache/query-cache-manager.ts
import { QueryClient } from '@tanstack/react-query'

export class QueryCacheManager {
  constructor(private queryClient: QueryClient) {}
  
  // 根據標籤重新驗證快取
  invalidateByTag(tag: string) {
    this.queryClient.invalidateQueries({ queryKey: [tag] })
  }
  
  // 根據模式重新驗證快取
  invalidateByPattern(pattern: string) {
    this.queryClient.invalidateQueries({
      predicate: (query) => 
        query.queryKey.some(key => 
          typeof key === 'string' && key.includes(pattern)
        )
    })
  }
  
  // 清除特定使用者的快取
  clearUserCache(userId: string) {
    this.queryClient.invalidateQueries({
      predicate: (query) => 
        query.queryKey.includes(userId)
    })
  }
  
  // 清除所有快取
  clearAllCache() {
    this.queryClient.clear()
  }
  
  // 獲取快取統計
  getCacheStats() {
    const queries = this.queryClient.getQueryCache().getAll()
    const mutations = this.queryClient.getMutationCache().getAll()
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.isActive()).length,
      totalMutations: mutations.length,
      pendingMutations: mutations.filter(m => m.state.status === 'pending').length,
    }
  }
}
```

#### 快取持久化
```typescript
// lib/cache/persist-cache.ts
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export function setupCachePersistence(queryClient: QueryClient) {
  const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    key: 'ng-beta-query-cache',
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })
  
  persistQueryClient({
    queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 小時
    buster: 'v1', // 快取版本標識
  })
}
```

## 與 Server Actions 整合

### 1. 自動重新驗證

#### 整合模式
```typescript
// lib/actions/portfolio-actions.ts
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import { projectService } from '@/lib/services/project-service'

export async function createProject(formData: FormData) {
  try {
    // ... 建立專案邏輯
    
    // 重新驗證 Next.js 快取
    revalidateTag('projects')
    revalidatePath('/dashboard/portfolio')
    
    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### 客戶端整合
```typescript
// lib/mutations/portfolio-mutations.ts
export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      if (data.success) {
        // 重新驗證 TanStack Query 快取
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['project-stats'] })
      }
    },
  })
}
```

### 2. 樂觀更新與 Server Actions

#### 整合樂觀更新
```typescript
// lib/mutations/optimistic-server-actions.ts
export function useOptimisticUpdateProjectWithServerAction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateProject,
    onMutate: async ({ projectId, formData }) => {
      // 樂觀更新邏輯
      await queryClient.cancelQueries({ queryKey: ['project', projectId] })
      const previousProject = queryClient.getQueryData(['project', projectId])
      
      // 樂觀更新
      queryClient.setQueryData(['project', projectId], (old: any) => ({
        ...old,
        ...Object.fromEntries(formData),
        updatedAt: new Date(),
      }))
      
      return { previousProject }
    },
    onError: (error, variables, context) => {
      // 錯誤時恢復
      if (context?.previousProject) {
        queryClient.setQueryData(
          ['project', variables.projectId],
          context.previousProject
        )
      }
    },
    onSettled: (data, error, variables) => {
      // 重新驗證
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
    },
  })
}
```

## 效能最佳化

### 1. 查詢去重

#### 自動去重配置
```typescript
// lib/config/query-deduplication.ts
export const queryDeduplicationConfig = {
  // 啟用查詢去重
  enabled: true,
  
  // 去重時間窗口
  deduplicationTime: 1000, // 1 秒
  
  // 自定義去重邏輯
  deduplicationFn: (queryKey: any[]) => {
    // 根據查詢鍵進行去重
    return queryKey.join('|')
  },
}
```

### 2. 背景更新

#### 背景更新配置
```typescript
// lib/hooks/use-background-update.ts
export function useBackgroundUpdate(queryKey: any[], enabled: boolean = true) {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!enabled) return
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey })
    }, 30 * 1000) // 30 秒更新一次
    
    return () => clearInterval(interval)
  }, [queryKey, enabled, queryClient])
}
```

## 監控和分析

### 1. 查詢效能監控

#### 效能追蹤
```typescript
// lib/monitoring/query-performance.ts
export class QueryPerformanceMonitor {
  static trackQuery(queryKey: any[], duration: number, success: boolean) {
    analytics.track('query_performance', {
      queryKey: queryKey.join('.'),
      duration,
      success,
      timestamp: Date.now(),
    })
  }
  
  static trackMutation(mutationKey: any[], duration: number, success: boolean) {
    analytics.track('mutation_performance', {
      mutationKey: mutationKey.join('.'),
      duration,
      success,
      timestamp: Date.now(),
    })
  }
}
```

### 2. 快取命中率監控

#### 快取統計
```typescript
// lib/monitoring/cache-analytics.ts
export class CacheAnalytics {
  static trackCacheHit(queryKey: any[]) {
    analytics.track('cache_hit', {
      queryKey: queryKey.join('.'),
      timestamp: Date.now(),
    })
  }
  
  static trackCacheMiss(queryKey: any[]) {
    analytics.track('cache_miss', {
      queryKey: queryKey.join('.'),
      timestamp: Date.now(),
    })
  }
}
```

## 最佳實踐

### 1. 查詢鍵設計

- 使用陣列格式的查詢鍵
- 包含相關的過濾器和參數
- 保持查詢鍵的一致性

### 2. 快取策略

- 根據資料特性設定適當的 `staleTime`
- 使用 `gcTime` 控制記憶體使用
- 實作智慧的快取失效策略

### 3. 錯誤處理

- 實作統一的錯誤處理邏輯
- 根據錯誤類型決定重試策略
- 提供用戶友好的錯誤訊息

### 4. 效能考量

- 使用查詢去重避免重複請求
- 實作樂觀更新提升用戶體驗
- 監控查詢效能和快取命中率

這個 TanStack Query 整合實作模式確保了專案整合的資料管理高效性、一致性和用戶體驗。