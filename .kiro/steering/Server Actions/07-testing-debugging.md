# Next.js Server Actions 測試與調試

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Testing & Debugging  
**複雜度:** Medium  

## 概述

測試和調試 Server Actions 的方法，包括單元測試、集成測試、錯誤處理和調試技巧。

## 單元測試

### 描述
對 Server Actions 進行單元測試

### 測試框架
- **Jest**: 使用 Jest 進行測試
- **Vitest**: 使用 Vitest 進行測試
- **Testing Library**: 使用 React Testing Library 測試組件

### 範例

#### 基本測試
```typescript
import { describe, it, expect, vi } from 'vitest'
import { createPost } from './actions'
import { revalidatePath } from 'next/cache'

// Mock Next.js functions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(() => ({ value: 'mock-session-id' }))
  })
}))

// Mock database
const mockDb = {
  post: {
    create: vi.fn()
  }
}

vi.mock('./db', () => ({
  default: mockDb
}))

describe('createPost', () => {
  it('should create a post successfully', async () => {
    const mockPost = {
      id: '1',
      title: 'Test Post',
      content: 'Test Content',
      authorId: 'user-1'
    }
    
    mockDb.post.create.mockResolvedValue(mockPost)
    
    const formData = new FormData()
    formData.append('title', 'Test Post')
    formData.append('content', 'Test Content')
    
    const result = await createPost(formData)
    
    expect(result).toEqual({
      success: true,
      post: mockPost
    })
    expect(mockDb.post.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Post',
        content: 'Test Content',
        authorId: 'user-1'
      }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/posts')
  })
  
  it('should return error for missing title', async () => {
    const formData = new FormData()
    formData.append('content', 'Test Content')
    
    const result = await createPost(formData)
    
    expect(result).toEqual({
      success: false,
      error: 'Title is required'
    })
    expect(mockDb.post.create).not.toHaveBeenCalled()
  })
})
```

#### 模擬外部服務
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendEmail } from './actions'

// Mock external email service
const mockEmailService = {
  send: vi.fn()
}

vi.mock('./email-service', () => ({
  default: mockEmailService
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('sendEmail', () => {
  it('should send email successfully', async () => {
    mockEmailService.send.mockResolvedValue({ messageId: 'msg-123' })
    
    const formData = new FormData()
    formData.append('to', 'test@example.com')
    formData.append('subject', 'Test Subject')
    formData.append('body', 'Test Body')
    
    const result = await sendEmail(formData)
    
    expect(result).toEqual({
      success: true,
      messageId: 'msg-123'
    })
    expect(mockEmailService.send).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test Body'
    })
  })
  
  it('should handle email service errors', async () => {
    mockEmailService.send.mockRejectedValue(new Error('Email service unavailable'))
    
    const formData = new FormData()
    formData.append('to', 'test@example.com')
    formData.append('subject', 'Test Subject')
    formData.append('body', 'Test Body')
    
    const result = await sendEmail(formData)
    
    expect(result).toEqual({
      success: false,
      error: 'Email service unavailable'
    })
  })
})
```

## 集成測試

### 描述
測試 Server Actions 與其他組件的集成

### 測試方式
- **組件測試**: 測試使用 Server Actions 的組件
- **API 測試**: 測試 Server Actions 的 API 行為
- **端到端**: 端到端測試完整流程

### 範例
```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostForm } from './PostForm'
import { createPost } from './actions'

// Mock the Server Action
vi.mock('./actions', () => ({
  createPost: vi.fn()
}))

const mockCreatePost = createPost as vi.MockedFunction<typeof createPost>

describe('PostForm Integration', () => {
  it('should submit form and show success message', async () => {
    const user = userEvent.setup()
    
    mockCreatePost.mockResolvedValue({
      success: true,
      post: { id: '1', title: 'Test Post', content: 'Test Content' }
    })
    
    render(<PostForm />)
    
    // Fill form
    await user.type(screen.getByLabelText(/title/i), 'Test Post')
    await user.type(screen.getByLabelText(/content/i), 'Test Content')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create post/i }))
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/post created successfully/i)).toBeInTheDocument()
    })
    
    expect(mockCreatePost).toHaveBeenCalled()
  })
  
  it('should show error message on validation failure', async () => {
    const user = userEvent.setup()
    
    mockCreatePost.mockResolvedValue({
      success: false,
      errors: {
        title: ['Title is required'],
        content: ['Content must be at least 10 characters']
      }
    })
    
    render(<PostForm />)
    
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /create post/i }))
    
    // Wait for error messages
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/content must be at least 10 characters/i)).toBeInTheDocument()
    })
  })
})
```

## 錯誤處理測試

### 描述
測試錯誤處理和邊界情況

### 測試場景
- **驗證錯誤**: 測試輸入驗證錯誤
- **數據庫錯誤**: 測試數據庫操作錯誤
- **網絡錯誤**: 測試網絡和外部服務錯誤
- **權限錯誤**: 測試權限和認證錯誤

### 範例
```typescript
import { describe, it, expect, vi } from 'vitest'
import { updatePost } from './actions'

// Mock database with error scenarios
const mockDb = {
  post: {
    findUnique: vi.fn(),
    update: vi.fn()
  },
  session: {
    findUnique: vi.fn()
  }
}

vi.mock('./db', () => ({
  default: mockDb
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(() => ({ value: 'mock-session-id' }))
  })
}))

describe('updatePost Error Handling', () => {
  it('should handle unauthorized access', async () => {
    mockDb.session.findUnique.mockResolvedValue(null)
    
    const formData = new FormData()
    formData.append('title', 'Updated Title')
    formData.append('content', 'Updated Content')
    
    await expect(updatePost('post-1', formData)).rejects.toThrow('Unauthorized')
  })
  
  it('should handle post not found', async () => {
    mockDb.session.findUnique.mockResolvedValue({
      user: { id: 'user-1', role: 'USER' }
    })
    mockDb.post.findUnique.mockResolvedValue(null)
    
    const formData = new FormData()
    formData.append('title', 'Updated Title')
    formData.append('content', 'Updated Content')
    
    await expect(updatePost('post-1', formData)).rejects.toThrow('Post not found')
  })
  
  it('should handle insufficient permissions', async () => {
    mockDb.session.findUnique.mockResolvedValue({
      user: { id: 'user-2', role: 'USER' }
    })
    mockDb.post.findUnique.mockResolvedValue({
      id: 'post-1',
      author: { id: 'user-1' }
    })
    
    const formData = new FormData()
    formData.append('title', 'Updated Title')
    formData.append('content', 'Updated Content')
    
    await expect(updatePost('post-1', formData)).rejects.toThrow('Insufficient permissions')
  })
  
  it('should handle database errors', async () => {
    mockDb.session.findUnique.mockResolvedValue({
      user: { id: 'user-1', role: 'USER' }
    })
    mockDb.post.findUnique.mockResolvedValue({
      id: 'post-1',
      author: { id: 'user-1' }
    })
    mockDb.post.update.mockRejectedValue(new Error('Database connection failed'))
    
    const formData = new FormData()
    formData.append('title', 'Updated Title')
    formData.append('content', 'Updated Content')
    
    await expect(updatePost('post-1', formData)).rejects.toThrow('Database connection failed')
  })
})
```

## 調試技巧

### 描述
調試 Server Actions 的技巧和工具

### 調試方法
- **console.log**: 使用 console.log 進行調試
- **錯誤邊界**: 實現錯誤邊界捕獲錯誤
- **開發者工具**: 使用開發者工具進行調試
- **日誌框架**: 使用專業的日誌框架

### 範例
```typescript
'use server'
export async function debugAction(formData: FormData) {
  try {
    console.log('Debug: Starting action execution')
    console.log('Debug: FormData contents:', Object.fromEntries(formData.entries()))
    
    // 記錄環境信息
    console.log('Debug: Environment:', {
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
    
    const result = await performAction(formData)
    
    console.log('Debug: Action completed successfully:', result)
    return { success: true, result }
    
  } catch (error) {
    console.error('Debug: Action failed with error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    
    // 重新拋出錯誤
    throw error
  }
}
```

## 測試工具

### 描述
測試 Server Actions 的實用工具和輔助函數

### 工具類型
- **測試數據生成器**: 生成測試數據
- **模擬工廠**: 創建模擬對象
- **斷言輔助**: 自定義斷言函數
- **測試設置**: 測試環境設置

### 範例
```typescript
// Test utilities

export function createMockFormData(data: Record<string, any>): FormData {
  const formData = new FormData()
  
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, item))
    } else {
      formData.append(key, value)
    }
  })
  
  return formData
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    ...overrides
  }
}

export function createMockPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-1',
    title: 'Test Post',
    content: 'Test Content',
    authorId: 'user-1',
    createdAt: new Date(),
    ...overrides
  }
}

export async function expectValidationError(
  action: Function,
  formData: FormData,
  expectedErrors: Record<string, string[]>
) {
  const result = await action(formData)
  
  expect(result.success).toBe(false)
  expect(result.errors).toEqual(expectedErrors)
}

export async function expectSuccessResult(
  action: Function,
  formData: FormData,
  expectedData?: any
) {
  const result = await action(formData)
  
  expect(result.success).toBe(true)
  if (expectedData) {
    expect(result).toMatchObject(expectedData)
  }
}
```

## 最佳實踐

1. 為每個 Server Action 編寫單元測試
2. 測試正常流程和錯誤情況
3. 使用模擬對象隔離外部依賴
4. 測試邊界情況和異常輸入
5. 實現適當的錯誤處理和日誌記錄
6. 使用類型安全的測試工具
7. 定期運行測試套件
8. 維護測試數據和測試環境

## 測試模式

### Arrange-Act-Assert
安排、執行、斷言的測試模式

### Given-When-Then
給定、當、那麼的測試模式

### Test Doubles
測試替身（模擬、存根、假對象）

### Property-Based Testing
基於屬性的測試

### Contract Testing
契約測試
