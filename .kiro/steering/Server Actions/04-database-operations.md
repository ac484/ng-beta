# Next.js Server Actions 數據庫操作

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Database Operations  
**複雜度:** High  

## 概述

使用 Server Actions 進行數據庫操作，包括 CRUD 操作、事務處理、數據驗證和緩存管理。

## CRUD 操作

### 描述
基本的增刪改查操作

### 操作類型
- **create**: 創建新記錄
- **read**: 讀取數據
- **update**: 更新現有記錄
- **delete**: 刪除記錄

### 範例

#### 創建用戶
```typescript
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  
  // 驗證
  if (!name || !email) {
    throw new Error('Name and email are required')
  }
  
  // 檢查郵箱是否已存在
  const existingUser = await db.user.findUnique({
    where: { email: email.toString() }
  })
  
  if (existingUser) {
    throw new Error('Email already exists')
  }
  
  // 創建用戶
  const user = await db.user.create({
    data: {
      name: name.toString(),
      email: email.toString()
    }
  })
  
  revalidatePath('/users')
  return { success: true, user }
}
```

#### 讀取用戶
```typescript
'use server'
export async function getUser(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      posts: true,
      profile: true
    }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  return user
}
```

#### 更新用戶
```typescript
'use server'
export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name')
  const email = formData.get('email')
  
  // 驗證
  if (!name || !email) {
    throw new Error('Name and email are required')
  }
  
  // 檢查郵箱是否被其他用戶使用
  const existingUser = await db.user.findFirst({
    where: {
      email: email.toString(),
      NOT: { id }
    }
  })
  
  if (existingUser) {
    throw new Error('Email already exists')
  }
  
  // 更新用戶
  const user = await db.user.update({
    where: { id },
    data: {
      name: name.toString(),
      email: email.toString()
    }
  })
  
  revalidatePath('/users')
  revalidatePath(`/users/${id}`)
  return { success: true, user }
}
```

#### 刪除用戶
```typescript
'use server'
export async function deleteUser(id: string) {
  // 檢查用戶是否存在
  const user = await db.user.findUnique({
    where: { id }
  })
  
  if (!user) {
    throw new Error('User not found')
  }
  
  // 刪除相關數據（級聯刪除）
  await db.$transaction([
    db.post.deleteMany({ where: { authorId: id } }),
    db.profile.deleteMany({ where: { userId: id } }),
    db.user.delete({ where: { id } })
  ])
  
  revalidatePath('/users')
  return { success: true }
}
```

## 事務處理

### 描述
使用數據庫事務確保數據一致性

### 處理模式
- **原子操作**: 確保多個操作要麼全部成功，要麼全部失敗
- **回滾**: 在錯誤時自動回滾所有更改
- **數據完整性**: 維護數據庫的完整性約束

### 範例
```typescript
'use server'
export async function transferMoney(fromAccountId: string, toAccountId: string, amount: number) {
  return await db.$transaction(async (tx) => {
    // 檢查源賬戶餘額
    const fromAccount = await tx.account.findUnique({
      where: { id: fromAccountId },
      select: { balance: true }
    })
    
    if (!fromAccount || fromAccount.balance < amount) {
      throw new Error('Insufficient funds')
    }
    
    // 扣除源賬戶金額
    await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } }
    })
    
    // 增加目標賬戶金額
    await tx.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } }
    })
    
    // 記錄交易
    await tx.transaction.create({
      data: {
        fromAccountId,
        toAccountId,
        amount,
        type: 'TRANSFER',
        status: 'COMPLETED'
      }
    })
    
    return { success: true, amount }
  })
}
```

## 數據驗證

### 描述
在數據庫操作前進行數據驗證

### 驗證方式
- **模式驗證**: 使用 Zod 等庫進行模式驗證
- **業務規則**: 實現業務邏輯驗證
- **約束檢查**: 檢查數據庫約束

### 範例
```typescript
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR'])
})

'use server'
export async function createUser(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: Number(formData.get('age')),
    role: formData.get('role')
  }
  
  // 驗證數據
  const result = UserSchema.safeParse(rawData)
  if (!result.success) {
    return { 
      success: false, 
      errors: result.error.flatten().fieldErrors 
    }
  }
  
  // 檢查業務規則
  if (result.data.role === 'ADMIN' && result.data.age < 21) {
    return {
      success: false,
      errors: { role: ['Admin users must be at least 21 years old'] }
    }
  }
  
  // 檢查唯一性約束
  const existingUser = await db.user.findUnique({
    where: { email: result.data.email }
  })
  
  if (existingUser) {
    return {
      success: false,
      errors: { email: ['Email already exists'] }
    }
  }
  
  // 創建用戶
  const user = await db.user.create({
    data: result.data
  })
  
  revalidatePath('/users')
  return { success: true, user }
}
```

## 緩存策略

### 描述
使用 Next.js 緩存機制優化數據庫查詢

### 緩存方法
- **revalidatePath**: 重新驗證特定路徑的緩存
- **revalidateTag**: 重新驗證特定標籤的緩存
- **cache control**: 控制函數的緩存行為

### 範例
```typescript
'use server'
export async function getPosts(category?: string) {
  const posts = await db.post.findMany({
    where: category ? { category } : {},
    include: {
      author: {
        select: { name: true, avatar: true }
      },
      tags: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return posts
}

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      authorId: formData.get('authorId') as string
    }
  })
  
  // 重新驗證相關緩存
  revalidatePath('/posts')
  revalidatePath(`/posts/${post.id}`)
  revalidateTag('posts')
  revalidateTag(`category-${post.category}`)
  
  return post
}
```

## 最佳實踐

1. 始終在數據庫操作前進行數據驗證
2. 使用事務處理複雜的多步驟操作
3. 實現適當的錯誤處理和用戶反饋
4. 使用緩存策略減少重複數據庫查詢
5. 考慮數據庫性能，優化查詢語句
6. 實現適當的權限檢查和訪問控制
7. 使用參數化查詢防止 SQL 注入
8. 定期備份和維護數據庫

## 常見模式

### 用戶管理
用戶註冊、登錄、權限管理

### 內容管理
文章、評論、媒體管理

### 電子商務
產品、訂單、庫存管理

### 社交功能
好友、關注、消息管理

### 數據分析
數據統計、報表生成
