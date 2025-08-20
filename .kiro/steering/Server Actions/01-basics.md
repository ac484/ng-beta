# Next.js Server Actions 基礎概念

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Core Concepts  
**複雜度:** Medium  

## 概述

Server Actions 是 Next.js 14 引入的革命性功能，允許在客戶端組件中直接調用服務器端函數，無需創建 API 路由。

### 定義
Server Actions 是 Next.js 14+ 的功能，允許在客戶端組件中直接調用服務器端函數

### 主要優勢
- 無需創建 API 路由
- 自動類型安全
- 漸進式增強
- 內建錯誤處理
- SEO 友好

### 使用場景
- 表單提交
- 數據庫操作
- 文件上傳
- 認證邏輯
- 第三方 API 調用

## 基本語法

### Server Action 定義
在服務器端組件或獨立文件中使用 `'use server'` 指令

### 客戶端使用
在客戶端組件中直接調用 Server Action

### 基本範例

#### 服務器端 (app/actions.ts)
```typescript
'use server'

export async function submitForm(formData: FormData) {
  const name = formData.get('name')
  // 處理邏輯
}
```

#### 客戶端組件
```tsx
// 在客戶端組件中
import { submitForm } from './actions'

<form action={submitForm}>
  <input name='name' />
  <button type='submit'>Submit</button>
</form>
```

## 核心特性

### 漸進式增強
即使 JavaScript 被禁用，表單仍能正常工作

### 類型安全
完整的 TypeScript 支持，自動類型推斷

### 錯誤處理
內建錯誤處理和驗證

### 樂觀更新
支持樂觀更新 UI

### 重新驗證
自動重新驗證數據

## 完整範例

### 基本表單提交 Server Action

#### 服務器端代碼
```typescript
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
  
  // 驗證
  if (!title || !content) {
    throw new Error('Title and content are required')
  }
  
  // 保存到數據庫
  const post = await db.posts.create({
    title: title.toString(),
    content: content.toString()
  })
  
  revalidatePath('/posts')
  redirect('/posts')
}
```

#### 客戶端組件
```tsx
<form action={createPost}>
  <input name='title' placeholder='Post title' required />
  <textarea name='content' placeholder='Post content' required />
  <button type='submit'>Create Post</button>
</form>
```

## 最佳實踐

1. 使用 `'use server'` 指令標記 Server Actions
2. 在獨立的 `actions.ts` 文件中組織 Server Actions
3. 實現適當的錯誤處理和驗證
4. 使用 `revalidatePath` 和 `revalidateTag` 進行緩存管理
5. 考慮安全性，驗證所有輸入數據
