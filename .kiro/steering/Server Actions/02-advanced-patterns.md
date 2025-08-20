# Next.js Server Actions 高級模式

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Advanced Patterns  
**複雜度:** High  

## 概述

Server Actions 的高級使用模式，包括樂觀更新、錯誤處理、驗證、緩存管理和安全性最佳實踐。

## 樂觀更新

### 描述
在服務器響應前立即更新 UI，提升用戶體驗

### 實現方式
使用 `useOptimistic` hook 實現樂觀更新

### 範例
```tsx
const [optimisticPosts, addOptimisticPost] = useOptimistic(
  posts,
  (state, newPost) => [newPost, ...state]
)

const handleSubmit = async (formData: FormData) => {
  const newPost = {
    id: Date.now(),
    title: formData.get('title'),
    content: formData.get('content')
  }
  
  addOptimisticPost(newPost)
  await createPost(formData)
}
```

## 錯誤處理

### 描述
實現健壯的錯誤處理和用戶反饋

### 處理模式
- **try-catch**: 使用 try-catch 捕獲和處理錯誤
- **錯誤邊界**: 實現錯誤邊界組件
- **用戶反饋**: 提供清晰的錯誤消息和恢復選項

### 範例
```typescript
'use server'

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title')
    const content = formData.get('content')
    
    if (!title || !content) {
      throw new Error('Title and content are required')
    }
    
    const post = await db.posts.create({
      title: title.toString(),
      content: content.toString()
    })
    
    revalidatePath('/posts')
    return { success: true, post }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

## 驗證

### 描述
實現服務器端和客戶端驗證

### 驗證方式
- **服務器驗證**: 在 Server Action 中進行最終驗證
- **客戶端驗證**: 在客戶端進行即時驗證
- **模式驗證**: 使用 Zod 等庫進行模式驗證

### 範例
```typescript
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters')
})

'use server'
export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content')
  }
  
  const result = PostSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false, errors: result.error.flatten() }
  }
  
  // 處理驗證後的數據
  const post = await db.posts.create(result.data)
  revalidatePath('/posts')
  return { success: true, post }
}
```

## 緩存策略

### 描述
使用 Next.js 緩存機制優化性能

### 緩存方法
- **revalidatePath**: 重新驗證特定路徑的緩存
- **revalidateTag**: 重新驗證特定標籤的緩存
- **cache**: 控制函數的緩存行為

### 範例
```typescript
'use server'
export async function updatePost(id: string, formData: FormData) {
  const post = await db.posts.update(id, {
    title: formData.get('title'),
    content: formData.get('content')
  })
  
  // 重新驗證相關緩存
  revalidatePath('/posts')
  revalidatePath(`/posts/${id}`)
  revalidateTag('posts')
  
  return post
}
```

## 安全考量

### 輸入驗證
始終驗證和清理所有輸入數據

### 認證
在 Server Actions 中檢查用戶權限

### CSRF 保護
Next.js 自動提供 CSRF 保護

### 頻率限制
實現請求頻率限制

### SQL 注入防護
使用參數化查詢防止 SQL 注入

## 性能優化

### 流式處理
使用流式響應處理長時間運行的操作

### 後台處理
將耗時操作移到後台任務

### 緩存優化
合理使用緩存減少重複計算

### 數據庫優化
優化數據庫查詢和連接
