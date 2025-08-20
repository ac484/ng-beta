# Next.js Server Actions 表單處理

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Form Handling  
**複雜度:** Medium  

## 概述

使用 Server Actions 處理各種表單場景，包括複雜表單、文件上傳、多步驟表單和表單驗證。

## 基本表單提交

### 描述
基本的表單提交和處理

### 處理模式
- **form action**: 使用 form action 屬性綁定 Server Action
- **formData**: 通過 FormData 獲取表單數據
- **progressive enhancement**: 即使 JavaScript 被禁用也能正常工作

### 範例

#### 服務器端 Server Action
```typescript
'use server'

export async function handleContactForm(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')
  
  // 驗證
  if (!name || !email || !message) {
    throw new Error('All fields are required')
  }
  
  // 發送郵件或保存到數據庫
  await sendContactEmail({
    name: name.toString(),
    email: email.toString(),
    message: message.toString()
  })
  
  redirect('/thank-you')
}
```

#### 客戶端表單
```tsx
<form action={handleContactForm}>
  <div>
    <label htmlFor='name'>Name:</label>
    <input type='text' id='name' name='name' required />
  </div>
  <div>
    <label htmlFor='email'>Email:</label>
    <input type='email' id='email' name='email' required />
  </div>
  <div>
    <label htmlFor='message'>Message:</label>
    <textarea id='message' name='message' required />
  </div>
  <button type='submit'>Send Message</button>
</form>
```

## 文件上傳

### 描述
處理文件上傳的 Server Action

### 實現方式
- **文件處理**: 使用 FormData 處理文件上傳
- **驗證**: 驗證文件類型和大小
- **存儲**: 保存文件到本地或雲存儲

### 範例
```typescript
'use server'

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) {
    throw new Error('No file uploaded')
  }
  
  // 驗證文件類型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  
  // 驗證文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large')
  }
  
  // 保存文件
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const fileName = `${Date.now()}-${file.name}`
  const filePath = path.join(process.cwd(), 'uploads', fileName)
  
  await fs.writeFile(filePath, buffer)
  
  return { success: true, fileName }
}
```

## 多步驟表單

### 描述
處理多步驟表單的複雜場景

### 處理模式
- **狀態管理**: 使用 URL 參數或會話管理表單狀態
- **步驟驗證**: 每步進行驗證，只有通過才能進入下一步
- **數據持久化**: 在步驟間保持已輸入的數據

### 範例
```typescript
'use server'

export async function handleStep1(formData: FormData) {
  const personalInfo = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email')
  }
  
  // 驗證第一步
  if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
    throw new Error('All personal information fields are required')
  }
  
  // 保存到會話或臨時存儲
  await saveToSession('step1', personalInfo)
  
  redirect('/form/step2')
}

export async function handleStep2(formData: FormData) {
  const addressInfo = {
    street: formData.get('street'),
    city: formData.get('city'),
    zipCode: formData.get('zipCode')
  }
  
  // 獲取第一步的數據
  const personalInfo = await getFromSession('step1')
  
  // 合併並保存所有數據
  const completeData = { ...personalInfo, ...addressInfo }
  await saveToDatabase(completeData)
  
  redirect('/form/complete')
}
```

## 表單驗證

### 描述
實現客戶端和服務器端的表單驗證

### 驗證方式
- **客戶端驗證**: 使用 HTML5 驗證屬性和 JavaScript 驗證
- **服務器驗證**: 在 Server Action 中進行最終驗證
- **實時驗證**: 使用 useFormState 實現實時驗證

### 範例
```tsx
import { useFormState } from 'react-dom'
import { createPost } from './actions'

const initialState = {
  message: null,
  errors: {}
}

function PostForm() {
  const [state, formAction] = useFormState(createPost, initialState)
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor='title'>Title:</label>
        <input 
          type='text' 
          id='title' 
          name='title' 
          required 
          aria-describedby='title-error'
        />
        {state.errors?.title && (
          <div id='title-error' className='error'>
            {state.errors.title}
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor='content'>Content:</label>
        <textarea 
          id='content' 
          name='content' 
          required 
          aria-describedby='content-error'
        />
        {state.errors?.content && (
          <div id='content-error' className='error'>
            {state.errors.content}
          </div>
        )}
      </div>
      
      <button type='submit'>Create Post</button>
      
      {state.message && (
        <div className='message'>{state.message}</div>
      )}
    </form>
  )
}
```

## 最佳實踐

1. 使用 HTML5 驗證屬性提供基本驗證
2. 在服務器端進行最終驗證
3. 提供清晰的錯誤消息和用戶反饋
4. 實現漸進式增強，確保無 JavaScript 環境下也能工作
5. 使用適當的 ARIA 屬性提升可訪問性
6. 考慮表單的用戶體驗和流程設計

## 常見模式

### 聯繫表單
聯繫表單、反饋表單

### 註冊表單
用戶註冊、登錄表單

### 數據輸入表單
數據輸入、編輯表單

### 文件上傳表單
文件上傳、圖片上傳

### 搜索表單
搜索、過濾表單
