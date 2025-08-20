# Next.js Server Actions 性能優化

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Performance Optimization  
**複雜度:** High  

## 概述

優化 Server Actions 的性能，包括緩存策略、流式處理、並發控制和資源管理。

## 緩存策略

### 描述
實現有效的緩存策略提升性能

### 緩存方法
- **revalidatePath**: 重新驗證特定路徑的緩存
- **revalidateTag**: 重新驗證特定標籤的緩存
- **cache function**: 控制函數的緩存行為
- **unstable_cache**: 使用實驗性緩存功能

### 範例

#### 選擇性重新驗證
```typescript
'use server'
export async function updatePost(postId: string, formData: FormData) {
  const post = await db.post.update({
    where: { id: postId },
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string
    }
  })
  
  // 選擇性重新驗證緩存
  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
  revalidateTag('posts')
  revalidateTag(`post-${postId}`)
  revalidateTag(`category-${post.category}`)
  
  return post
}
```

#### 緩存控制
```typescript
'use server'
export async function getExpensiveData(params: SearchParams) {
  // 緩存昂貴的計算結果
  const cacheKey = `expensive-${JSON.stringify(params)}`
  
  const cached = await unstable_cache(
    async () => {
      // 執行昂貴的計算
      const result = await performExpensiveCalculation(params)
      return result
    },
    [cacheKey],
    {
      tags: ['expensive-data'],
      revalidate: 3600 // 1 hour
    }
  )()
  
  return cached
}
```

## 流式處理和異步

### 描述
使用流式處理和異步操作優化響應時間

### 處理模式
- **流式響應**: 使用流式響應處理長時間運行的操作
- **後台處理**: 將耗時操作移到後台任務
- **並行執行**: 並行執行多個操作

### 範例
```typescript
'use server'
export async function processLargeDataset(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error('No file uploaded')
  }
  
  // 立即返回響應，在後台處理數據
  const processingId = generateId()
  
  // 啟動後台處理
  processInBackground(processingId, file)
  
  return { 
    success: true, 
    processingId,
    message: 'File processing started' 
  }
}

async function processInBackground(id: string, file: File) {
  try {
    // 處理大文件
    const result = await processFile(file)
    
    // 保存結果
    await db.processingResult.create({
      data: {
        id,
        status: 'COMPLETED',
        result: JSON.stringify(result)
      }
    })
  } catch (error) {
    // 記錄錯誤
    await db.processingResult.create({
      data: {
        id,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
```

## 數據庫優化

### 描述
優化數據庫查詢和連接管理

### 優化技術
- **查詢優化**: 優化 SQL 查詢和索引
- **連接池**: 使用連接池管理數據庫連接
- **批量操作**: 批量處理多個操作
- **選擇性加載**: 只加載需要的數據

### 範例
```typescript
'use server'
export async function getOptimizedPosts(category?: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit
  
  // 並行執行多個查詢
  const [posts, totalCount] = await Promise.all([
    db.post.findMany({
      where: category ? { category } : {},
      select: {
        id: true,
        title: true,
        excerpt: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit
    }),
    db.post.count({
      where: category ? { category } : {}
    })
  ])
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  }
}
```

## 並發控制

### 描述
控制並發操作避免資源競爭

### 控制模式
- **頻率限制**: 限制請求頻率
- **信號量**: 使用信號量控制並發數量
- **隊列系統**: 實現隊列系統處理請求

### 範例
```typescript
import { Semaphore } from 'async-sema'

// 限制同時處理的文件數量
const fileProcessingSemaphore = new Semaphore(3)

'use server'
export async function processMultipleFiles(formData: FormData) {
  const files = formData.getAll('files') as File[]
  
  if (files.length === 0) {
    throw new Error('No files uploaded')
  }
  
  // 並行處理文件，但限制並發數量
  const results = await Promise.all(
    files.map(async (file) => {
      return await fileProcessingSemaphore.acquire(async () => {
        try {
          const result = await processFile(file)
          return { success: true, fileName: file.name, result }
        } catch (error) {
          return { 
            success: false, 
            fileName: file.name, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }
        }
      })
    })
  )
  
  return { results }
}
```

## 內存管理

### 描述
優化內存使用和資源管理

### 管理技術
- **流式處理**: 使用流式處理大文件
- **分塊操作**: 分塊處理大量數據
- **垃圾回收**: 及時釋放不需要的資源

### 範例
```typescript
'use server'
export async function processLargeFile(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error('No file uploaded')
  }
  
  // 分塊處理大文件
  const chunkSize = 1024 * 1024 // 1MB chunks
  const chunks = Math.ceil(file.size / chunkSize)
  const results = []
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    // 處理每個塊
    const chunkResult = await processChunk(chunk, i)
    results.push(chunkResult)
    
    // 定期清理內存
    if (i % 10 === 0) {
      global.gc?.()
    }
  }
  
  // 合併結果
  const finalResult = mergeResults(results)
  
  return { success: true, result: finalResult }
}
```

## 監控和指標

### 描述
監控 Server Actions 的性能指標

### 性能指標
- **響應時間**: 響應時間
- **吞吐量**: 吞吐量
- **錯誤率**: 錯誤率
- **資源使用**: 資源使用情況

### 監控工具
- **Next.js Analytics**: Next.js 內建分析
- **自定義指標**: 自定義性能指標
- **APM 工具**: 應用性能監控工具

## 最佳實踐

1. 使用適當的緩存策略減少重複計算
2. 實現流式處理處理長時間運行的操作
3. 優化數據庫查詢和連接管理
4. 控制並發數量避免資源競爭
5. 監控性能指標識別瓶頸
6. 使用分塊處理處理大文件
7. 實現適當的錯誤處理和重試機制
8. 定期清理不需要的緩存和資源

## 性能模式

### 延遲加載
延遲加載非關鍵資源

### 預取
預取可能需要的數據

### 壓縮
使用壓縮減少傳輸大小

### CDN 集成
使用 CDN 加速靜態資源

### 數據庫索引
優化數據庫索引提升查詢性能
