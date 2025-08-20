# Next.js Server Actions 遷移指南

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Migration Guide  
**複雜度:** Medium  

## 概述

從傳統 API 路由遷移到 Server Actions 的完整指南，包括遷移策略、步驟和最佳實踐。

## 遷移概述

### 描述
遷移到 Server Actions 的概述和優勢

### 主要優勢
- 減少 API 路由數量
- 更好的類型安全
- 漸進式增強
- 內建錯誤處理
- 更好的開發體驗

### 遷移考量
- Next.js 14+ 版本要求
- 現有代碼的兼容性
- 團隊的學習曲線
- 測試策略的調整

## 遷移策略

### 描述
制定遷移策略和計劃

### 遷移方式
- **逐步遷移**: 逐步遷移，一次遷移一個功能
- **並行實現**: 並行實現，保持舊 API 和新 Server Actions 同時運行
- **完全重寫**: 完全重寫，一次性遷移所有功能

### 推薦方式
建議使用逐步遷移策略，先遷移簡單的功能，再遷移複雜的功能

### 遷移階段
1. **第一階段**: 簡單的表單提交
2. **第二階段**: 數據 CRUD 操作
3. **第三階段**: 複雜的業務邏輯
4. **第四階段**: 文件上傳和處理
5. **第五階段**: 認證和授權
6. **第六階段**: 清理和優化

## 逐步遷移

### 詳細的遷移步驟

#### 步驟 1: 分析現有 API 路由

**標題**: 分析現有 API 路由

**描述**: 識別可以遷移的 API 路由

**行動項目**:
- 列出所有現有的 API 路由
- 分析每個路由的功能和複雜度
- 識別依賴關係和調用方
- 評估遷移的優先級

**範例**:
```typescript
// 現有 API 路由分析
const apiRoutes = [
  { path: '/api/posts', method: 'POST', complexity: 'low', priority: 'high' },
  { path: '/api/posts/[id]', method: 'PUT', complexity: 'medium', priority: 'high' },
  { path: '/api/posts/[id]', method: 'DELETE', complexity: 'low', priority: 'medium' },
  { path: '/api/comments', method: 'POST', complexity: 'low', priority: 'high' },
  { path: '/api/auth/login', method: 'POST', complexity: 'high', priority: 'low' }
]
```

#### 步驟 2: 制定遷移計劃

**標題**: 制定遷移計劃

**描述**: 為每個 API 路由制定遷移計劃

**行動項目**:
- 確定遷移順序
- 識別需要修改的客戶端代碼
- 計劃測試策略
- 準備回滾計劃

#### 步驟 3: 實現 Server Actions

**標題**: 實現 Server Actions

**描述**: 將 API 路由轉換為 Server Actions

**行動項目**:
- 創建 actions.ts 文件
- 實現 Server Actions
- 添加適當的錯誤處理
- 實現數據驗證

**範例**:
```typescript
// 從 API 路由遷移到 Server Action

// 舊的 API 路由
// pages/api/posts.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { title, content } = req.body
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }
    
    const post = await db.post.create({
      data: { title, content, authorId: req.user.id }
    })
    
    res.status(201).json({ success: true, post })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

// 新的 Server Action
// app/actions/posts.ts
'use server'

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title')
    const content = formData.get('content')
    
    if (!title || !content) {
      throw new Error('Title and content are required')
    }
    
    const sessionId = cookies().get('sessionId')?.value
    if (!sessionId) {
      throw new Error('Unauthorized')
    }
    
    const post = await db.post.create({
      data: {
        title: title.toString(),
        content: content.toString(),
        authorId: sessionId
      }
    })
    
    revalidatePath('/posts')
    
    return { success: true, post }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }
  }
}
```

#### 步驟 4: 更新客戶端代碼

**標題**: 更新客戶端代碼

**描述**: 修改客戶端代碼以使用 Server Actions

**行動項目**:
- 更新表單的 action 屬性
- 修改事件處理函數
- 更新錯誤處理邏輯
- 調整 UI 響應

**範例**:
```typescript
// 從 fetch 遷移到 Server Actions

// 舊的客戶端代碼
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create post')
    }
    
    const result = await response.json()
    // 處理成功響應
  } catch (error) {
    // 處理錯誤
  }
}

// 新的客戶端代碼
import { createPost } from '@/app/actions/posts'

const handleSubmit = async (formData: FormData) => {
  try {
    const result = await createPost(formData)
    
    if (result.success) {
      // 處理成功響應
    } else {
      // 處理錯誤
    }
  } catch (error) {
    // 處理錯誤
  }
}

// 或者直接使用表單 action
<form action={createPost}>
  <input name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
  <textarea name='content' value={content} onChange={(e) => setContent(e.target.value)} />
  <button type='submit'>Create Post</button>
</form>
```

#### 步驟 5: 測試遷移後的功能

**標題**: 測試遷移後的功能

**描述**: 確保遷移後的功能正常工作

**行動項目**:
- 編寫單元測試
- 進行集成測試
- 測試錯誤情況
- 驗證性能表現

#### 步驟 6: 清理舊代碼

**標題**: 清理舊代碼

**描述**: 移除不再需要的舊 API 路由

**行動項目**:
- 確認所有功能都正常工作
- 移除舊的 API 路由文件
- 清理相關的測試代碼
- 更新文檔

## 常見遷移模式

### 描述
常見的遷移模式和轉換

### 遷移模式
- **表單提交**: 表單提交的遷移模式
- **數據操作**: 數據操作的遷移模式
- **文件上傳**: 文件上傳的遷移模式
- **認證邏輯**: 認證邏輯的遷移模式

### 範例
- **表單提交**: 舊的 API 路由處理表單提交，新的 Server Action 直接處理 FormData
- **數據操作**: 舊的 API 路由使用 req.body，新的 Server Action 使用 FormData 或參數
- **文件上傳**: 舊的 API 路由處理 multipart/form-data，新的 Server Action 直接處理 File 對象
- **認證邏輯**: 舊的 API 路由使用 req.headers 或 req.cookies，新的 Server Action 使用 cookies() 和 headers()

## 遷移挑戰

### 描述
遷移過程中可能遇到的挑戰和解決方案

### 主要挑戰
- **複雜驗證**: 複雜驗證邏輯的遷移
- **中間件依賴**: 中間件依賴的處理
- **第三方集成**: 第三方服務集成的遷移
- **性能優化**: 性能優化的考慮

### 解決方案
- **複雜驗證**: 使用 Zod 等驗證庫重構驗證邏輯
- **中間件依賴**: 將中間件邏輯移到 Server Actions 內部
- **第三方集成**: 保持第三方服務的調用邏輯，只改變調用方式
- **性能優化**: 使用 Next.js 的緩存機制和優化功能

## 遷移檢查清單

### 描述
遷移完成的檢查清單

### 檢查項目
- 所有功能都正常工作
- 錯誤處理正確實現
- 數據驗證完整
- 權限檢查正確
- 緩存策略適當
- 測試覆蓋率足夠
- 文檔已更新
- 舊代碼已清理
- 性能表現良好
- 安全檢查通過

## 最佳實踐

1. 制定詳細的遷移計劃
2. 逐步遷移，避免一次性大改動
3. 保持舊 API 和新 Server Actions 並行運行
4. 充分測試每個遷移的功能
5. 準備回滾計劃
6. 記錄遷移過程和決策
7. 培訓團隊使用新的開發模式
8. 監控遷移後的性能表現

## 遷移工具

### 代碼分析
使用工具分析現有代碼結構

### 自動化測試
自動化測試確保功能正確性

### 性能監控
監控遷移後的性能表現

### 錯誤追蹤
追蹤和分析錯誤
