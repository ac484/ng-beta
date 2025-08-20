# Next.js 15 Server Actions 實作模式

## 核心概念

### 1. Server Actions 基礎

Server Actions 是 Next.js 15 的核心功能，允許在伺服器端執行資料變更操作，無需建立傳統的 API 端點。

#### 基本語法
```typescript
'use server'

export async function createEntity(formData: FormData) {
  // 伺服器端邏輯
  const data = Object.fromEntries(formData)
  const result = await entityService.create(data)
  
  // 快取管理
  revalidateTag('entities')
  revalidatePath('/dashboard')
  
  return { success: true, data: result }
}
```

### 2. 專案整合的 Server Actions 架構

#### 檔案組織結構
```
lib/
├── actions/
│   ├── auth-actions.ts          # 認證相關動作
│   ├── portfolio-actions.ts     # Portfolio 模組動作
│   ├── partners-actions.ts      # PartnerVerse 模組動作
│   ├── documents-actions.ts     # DocuParse 模組動作
│   ├── analytics-actions.ts     # 分析模組動作
│   └── shared-actions.ts        # 共用動作
├── services/
│   ├── firebase-service.ts      # Firebase 基礎服務
│   ├── project-service.ts       # 專案服務
│   ├── partner-service.ts       # 夥伴服務
│   ├── document-service.ts      # 文件服務
│   └── analytics-service.ts     # 分析服務
└── validations/
    ├── auth.schemas.ts          # 認證驗證
    ├── portfolio.schemas.ts     # Portfolio 驗證
    ├── partners.schemas.ts      # Partners 驗證
    ├── documents.schemas.ts     # Documents 驗證
    └── common.schemas.ts        # 共用驗證
```

## 實作模式

### 1. 基礎 Server Action 模式

#### 標準 CRUD 動作
```typescript
// lib/actions/portfolio-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { projectService } from '@/lib/services/project-service'
import { projectCreateSchema, projectUpdateSchema } from '@/lib/validations/portfolio.schemas'

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
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    }

    const validatedData = projectCreateSchema.parse(rawData)
    
    const project = await projectService.createProject({
      ...validatedData,
      createdBy: userId,
      status: 'planning',
      progress: 0
    })

    revalidateTag('projects')
    revalidateTag(`user-projects-${userId}`)
    revalidatePath('/dashboard/portfolio')
    
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
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
      progress: Number(formData.get('progress')),
    }

    const validatedData = projectUpdateSchema.parse(rawData)
    
    // 檢查權限
    const existingProject = await projectService.getProject(projectId, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    const project = await projectService.updateProject(projectId, validatedData, userId)

    revalidateTag('projects')
    revalidateTag(`project-${projectId}`)
    revalidateTag(`user-projects-${userId}`)
    revalidatePath('/dashboard/portfolio')
    
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
    // 檢查權限
    const existingProject = await projectService.getProject(projectId, userId)
    if (!existingProject) {
      throw new Error('Project not found or unauthorized')
    }

    await projectService.deleteProject(projectId, userId)
    
    revalidateTag('projects')
    revalidateTag(`user-projects-${userId}`)
    revalidatePath('/dashboard/portfolio')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

#### 批次操作動作
```typescript
// lib/actions/portfolio-actions.ts
export async function batchUpdateProjects(updates: Array<{
  id: string
  data: Partial<Project>
}>) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const results = await Promise.allSettled(
      updates.map(async ({ id, data }) => {
        const existingProject = await projectService.getProject(id, userId)
        if (!existingProject) {
          throw new Error(`Project ${id} not found or unauthorized`)
        }
        return projectService.updateProject(id, data, userId)
      })
    )
    
    const successful = results.filter(
      (result): result is PromiseFulfilledResult<Project> => 
        result.status === 'fulfilled'
    )
    
    const failed = results.filter(
      (result): result is PromiseRejectedResult => 
        result.status === 'rejected'
    )
    
    if (successful.length > 0) {
      revalidateTag('projects')
      revalidateTag(`user-projects-${userId}`)
      revalidatePath('/dashboard/portfolio')
    }
    
    return {
      success: true,
      data: {
        updated: successful.length,
        failed: failed.length,
        results: successful.map(r => r.value),
        errors: failed.map(r => r.reason?.message || 'Unknown error')
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

### 2. 跨模組 Server Actions

#### 關聯資料更新
```typescript
// lib/actions/shared-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { projectService } from '@/lib/services/project-service'
import { partnerService } from '@/lib/services/partner-service'
import { documentService } from '@/lib/services/document-service'

export async function linkProjectToPartner(projectId: string, partnerId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // 檢查權限
    const [project, partner] = await Promise.all([
      projectService.getProject(projectId, userId),
      partnerService.getPartner(partnerId, userId)
    ])
    
    if (!project || !partner) {
      throw new Error('Project or partner not found or unauthorized')
    }

    // 更新關聯
    await Promise.all([
      projectService.updateProject(projectId, { partnerId }, userId),
      partnerService.updatePartner(partnerId, { 
        projectIds: [...(partner.projectIds || []), projectId] 
      }, userId)
    ])
    
    // 重新驗證相關快取
    revalidateTag('projects')
    revalidateTag('partners')
    revalidateTag(`project-${projectId}`)
    revalidateTag(`partner-${partnerId}`)
    revalidatePath('/dashboard/portfolio')
    revalidatePath('/dashboard/partners')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function linkDocumentToProject(documentId: string, projectId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // 檢查權限
    const [document, project] = await Promise.all([
      documentService.getDocument(documentId, userId),
      projectService.getProject(projectId, userId)
    ])
    
    if (!document || !project) {
      throw new Error('Document or project not found or unauthorized')
    }

    // 更新關聯
    await documentService.updateDocument(documentId, { projectId }, userId)
    
    // 重新驗證相關快取
    revalidateTag('documents')
    revalidateTag('projects')
    revalidateTag(`document-${documentId}`)
    revalidateTag(`project-${projectId}`)
    revalidatePath('/dashboard/documents')
    revalidatePath('/dashboard/portfolio')
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

### 3. AI 整合 Server Actions

#### AI 文件處理
```typescript
// lib/actions/documents-actions.ts
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'
import { documentService } from '@/lib/services/document-service'
import { aiService } from '@/lib/services/ai-service'

export async function processDocumentWithAI(documentId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const document = await documentService.getDocument(documentId, userId)
    if (!document) {
      throw new Error('Document not found or unauthorized')
    }

    // AI 處理
    const aiResults = await aiService.processDocument(document)
    
    // 更新文件
    const updatedDocument = await documentService.updateDocument(
      documentId, 
      {
        extractedText: aiResults.extractedText,
        summary: aiResults.summary,
        keywords: aiResults.keywords,
        entities: aiResults.entities,
        aiProcessed: true,
        aiProcessedAt: new Date()
      }, 
      userId
    )
    
    // 重新驗證快取
    revalidateTag('documents')
    revalidateTag(`document-${documentId}`)
    revalidatePath('/dashboard/documents')
    
    return { success: true, data: updatedDocument }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function generateProjectSubtasks(projectId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const project = await projectService.getProject(projectId, userId)
    if (!project) {
      throw new Error('Project not found or unauthorized')
    }

    // AI 生成子任務
    const subtasks = await aiService.generateSubtasks(project)
    
    // 建立子任務
    const createdSubtasks = await Promise.all(
      subtasks.map(subtask => 
        taskService.createTask({
          ...subtask,
          projectId,
          createdBy: userId
        })
      )
    )
    
    // 重新驗證快取
    revalidateTag('tasks')
    revalidateTag(`project-${projectId}`)
    revalidatePath('/dashboard/portfolio')
    
    return { success: true, data: createdSubtasks }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

## 快取管理策略

### 1. 快取標籤策略

#### 分層快取標籤
```typescript
// lib/cache/cache-tags.ts
export const CACHE_TAGS = {
  // 實體級標籤
  PROJECTS: 'projects',
  PARTNERS: 'partners',
  DOCUMENTS: 'documents',
  TASKS: 'tasks',
  
  // 使用者級標籤
  USER_PROJECTS: (userId: string) => `user-projects-${userId}`,
  USER_PARTNERS: (userId: string) => `user-partners-${userId}`,
  USER_DOCUMENTS: (userId: string) => `user-documents-${userId}`,
  
  // 關聯標籤
  PROJECT_PARTNERS: (projectId: string) => `project-partners-${projectId}`,
  PROJECT_DOCUMENTS: (projectId: string) => `project-documents-${projectId}`,
  PARTNER_PROJECTS: (partnerId: string) => `partner-projects-${partnerId}`,
  
  // 分析標籤
  ANALYTICS: 'analytics',
  USER_ANALYTICS: (userId: string) => `user-analytics-${userId}`,
  
  // 系統標籤
  SYSTEM: 'system',
  USER_PERMISSIONS: (userId: string) => `user-permissions-${userId}`
} as const

// 快取管理工具
export class CacheManager {
  static invalidateUserData(userId: string) {
    revalidateTag(CACHE_TAGS.USER_PROJECTS(userId))
    revalidateTag(CACHE_TAGS.USER_PARTNERS(userId))
    revalidateTag(CACHE_TAGS.USER_DOCUMENTS(userId))
    revalidateTag(CACHE_TAGS.USER_ANALYTICS(userId))
    revalidateTag(CACHE_TAGS.USER_PERMISSIONS(userId))
  }
  
  static invalidateProjectData(projectId: string) {
    revalidateTag(CACHE_TAGS.PROJECTS)
    revalidateTag(`project-${projectId}`)
    revalidateTag(CACHE_TAGS.PROJECT_PARTNERS(projectId))
    revalidateTag(CACHE_TAGS.PROJECT_DOCUMENTS(projectId))
  }
  
  static invalidatePartnerData(partnerId: string) {
    revalidateTag(CACHE_TAGS.PARTNERS)
    revalidateTag(`partner-${partnerId}`)
    revalidateTag(CACHE_TAGS.PARTNER_PROJECTS(partnerId))
  }
}
```

### 2. 路徑重新驗證策略

#### 智慧路徑重新驗證
```typescript
// lib/cache/path-revalidation.ts
export class PathRevalidator {
  static revalidateDashboard() {
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/portfolio')
    revalidatePath('/dashboard/partners')
    revalidatePath('/dashboard/documents')
    revalidatePath('/dashboard/analytics')
  }
  
  static revalidateModule(module: 'portfolio' | 'partners' | 'documents' | 'analytics') {
    revalidatePath(`/dashboard/${module}`)
    
    // 重新驗證相關子路徑
    switch (module) {
      case 'portfolio':
        revalidatePath('/dashboard/portfolio/projects')
        revalidatePath('/dashboard/portfolio/tasks')
        revalidatePath('/dashboard/portfolio/contracts')
        break
      case 'partners':
        revalidatePath('/dashboard/partners/directory')
        revalidatePath('/dashboard/partners/relationships')
        revalidatePath('/dashboard/partners/collaborations')
        break
      case 'documents':
        revalidatePath('/dashboard/documents/upload')
        revalidatePath('/dashboard/documents/library')
        revalidatePath('/dashboard/documents/parser')
        break
      case 'analytics':
        revalidatePath('/dashboard/analytics/overview')
        revalidatePath('/dashboard/analytics/reports')
        revalidatePath('/dashboard/analytics/insights')
        break
    }
  }
}
```

## 錯誤處理策略

### 1. 統一錯誤處理

#### 錯誤處理工具
```typescript
// lib/utils/error-handling.ts
export class ServerActionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message)
    this.name = 'ServerActionError'
  }
}

export function handleServerActionError(error: unknown): {
  success: false
  error: string
  code?: string
  details?: any
} {
  if (error instanceof ServerActionError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      details: error.details
    }
  }
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message
    }
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred'
  }
}

export function createServerActionError(
  message: string,
  code: string,
  statusCode: number = 400,
  details?: any
) {
  return new ServerActionError(message, code, statusCode, details)
}
```

#### 使用錯誤處理工具
```typescript
// lib/actions/portfolio-actions.ts
export async function createProject(formData: FormData) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      throw createServerActionError(
        'You must be signed in to create a project',
        'UNAUTHORIZED',
        401
      )
    }

    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
    }

    if (!rawData.title || !rawData.description) {
      throw createServerActionError(
        'Title and description are required',
        'VALIDATION_ERROR',
        400,
        { missing: ['title', 'description'].filter(field => !rawData[field as keyof typeof rawData]) }
      )
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
    return handleServerActionError(error)
  }
}
```

### 2. 驗證策略

#### Zod 驗證整合
```typescript
// lib/validations/portfolio.schemas.ts
import { z } from 'zod'

export const projectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date').optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
  budget: z.number().positive('Budget must be positive').optional(),
})

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  status: z.enum(['planning', 'active', 'paused', 'completed', 'cancelled']).optional(),
  progress: z.number().min(0, 'Progress cannot be negative').max(100, 'Progress cannot exceed 100%').optional(),
})

export const projectDeleteSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  force: z.boolean().optional(),
})
```

## 效能最佳化

### 1. 批次操作

#### 批次資料處理
```typescript
// lib/actions/shared-actions.ts
export async function batchCreateEntities<T>(
  entityType: string,
  entities: T[],
  createFunction: (entity: T) => Promise<any>
) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // 分批處理以避免超時
    const batchSize = 10
    const results = []
    
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize)
      const batchResults = await Promise.allSettled(
        batch.map(entity => createFunction(entity))
      )
      results.push(...batchResults)
    }
    
    const successful = results.filter(
      (result): result is PromiseFulfilledResult<any> => 
        result.status === 'fulfilled'
    )
    
    const failed = results.filter(
      (result): result is PromiseRejectedResult => 
        result.status === 'rejected'
    )
    
    return {
      success: true,
      data: {
        total: entities.length,
        created: successful.length,
        failed: failed.length,
        results: successful.map(r => r.value),
        errors: failed.map(r => r.reason?.message || 'Unknown error')
      }
    }
  } catch (error) {
    return handleServerActionError(error)
  }
}
```

### 2. 非同步處理

#### 背景任務處理
```typescript
// lib/actions/documents-actions.ts
export async function processLargeDocument(documentId: string) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    // 立即返回，開始背景處理
    processDocumentInBackground(documentId, userId)
    
    return { 
      success: true, 
      message: 'Document processing started in background',
      taskId: `doc-${documentId}-${Date.now()}`
    }
  } catch (error) {
    return handleServerActionError(error)
  }
}

async function processDocumentInBackground(documentId: string, userId: string) {
  try {
    // 更新狀態為處理中
    await documentService.updateDocument(
      documentId, 
      { status: 'processing' }, 
      userId
    )
    
    // 執行耗時的 AI 處理
    const aiResults = await aiService.processLargeDocument(documentId)
    
    // 更新處理結果
    await documentService.updateDocument(
      documentId, 
      {
        ...aiResults,
        status: 'completed',
        processedAt: new Date()
      }, 
      userId
    )
    
    // 重新驗證快取
    revalidateTag('documents')
    revalidateTag(`document-${documentId}`)
    revalidatePath('/dashboard/documents')
  } catch (error) {
    // 更新錯誤狀態
    await documentService.updateDocument(
      documentId, 
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      userId
    )
    
    // 記錄錯誤
    console.error('Document processing failed:', error)
  }
}
```

## 最佳實踐

### 1. 安全性

- 始終在 Server Actions 中驗證使用者身份
- 實作適當的權限檢查
- 驗證所有輸入資料
- 使用參數化查詢防止注入攻擊

### 2. 效能

- 實作適當的快取策略
- 使用批次操作處理大量資料
- 實作背景處理避免阻塞
- 監控 Server Actions 效能

### 3. 錯誤處理

- 提供有意义的錯誤訊息
- 實作統一的錯誤處理
- 記錄錯誤到監控服務
- 提供重試機制

### 4. 快取管理

- 使用一致的快取標籤策略
- 實作智慧路徑重新驗證
- 避免過度快取失效
- 監控快取命中率

這個 Server Actions 實作模式確保了專案整合的資料操作安全性、效能和可維護性。