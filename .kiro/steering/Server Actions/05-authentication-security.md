# Next.js Server Actions 認證與安全

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Authentication & Security  
**複雜度:** High  

## 概述

在 Server Actions 中實現安全的認證機制、權限控制、輸入驗證和安全最佳實踐。

## 認證

### 描述
實現用戶認證和會話管理

### 認證模式
- **會話認證**: 使用會話進行用戶認證
- **JWT 認證**: 使用 JWT 令牌進行認證
- **OAuth 集成**: 集成第三方 OAuth 服務

### 範例

#### 登錄
```typescript
'use server'

export async function login(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')
  
  if (!email || !password) {
    throw new Error('Email and password are required')
  }
  
  try {
    // 驗證用戶憑證
    const user = await db.user.findUnique({
      where: { email: email.toString() },
      select: { id: true, email: true, password: true, role: true }
    })
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    // 驗證密碼
    const isValidPassword = await bcrypt.compare(password.toString(), user.password)
    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }
    
    // 創建會話
    const session = await createSession(user.id)
    
    // 設置 cookie
    cookies().set('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    redirect('/dashboard')
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }
  }
}
```

#### 登出
```typescript
'use server'
export async function logout() {
  const sessionId = cookies().get('sessionId')?.value
  
  if (sessionId) {
    // 刪除會話
    await db.session.delete({
      where: { id: sessionId }
    })
    
    // 清除 cookie
    cookies().delete('sessionId')
  }
  
  redirect('/login')
}
```

## 授權

### 描述
實現基於角色的權限控制

### 授權模式
- **基於角色**: 基於用戶角色控制訪問權限
- **基於權限**: 基於具體權限控制功能訪問
- **基於資源**: 基於資源所有權控制訪問

### 範例
```typescript
'use server'
export async function updatePost(postId: string, formData: FormData) {
  // 獲取當前用戶會話
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })
  
  if (!session) {
    throw new Error('Invalid session')
  }
  
  // 獲取要更新的文章
  const post = await db.post.findUnique({
    where: { id: postId },
    include: { author: true }
  })
  
  if (!post) {
    throw new Error('Post not found')
  }
  
  // 檢查權限：只有作者或管理員可以編輯
  if (post.author.id !== session.user.id && session.user.role !== 'ADMIN') {
    throw new Error('Insufficient permissions')
  }
  
  // 更新文章
  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string
    }
  })
  
  revalidatePath('/posts')
  revalidatePath(`/posts/${postId}`)
  
  return { success: true, post: updatedPost }
}
```

## 輸入驗證

### 描述
實現安全的輸入驗證和清理

### 驗證方式
- **模式驗證**: 使用 Zod 等庫進行模式驗證
- **數據清理**: 清理和轉義用戶輸入
- **類型檢查**: 確保數據類型的正確性

### 範例
```typescript
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

const PostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title too long')
    .transform(val => DOMPurify.sanitize(val)),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content too long')
    .transform(val => DOMPurify.sanitize(val)),
  tags: z.array(z.string().max(20)).max(5, 'Too many tags')
})

'use server'
export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.getAll('tags')
  }
  
  // 驗證和清理數據
  const result = PostSchema.safeParse(rawData)
  if (!result.success) {
    return { 
      success: false, 
      errors: result.error.flatten().fieldErrors 
    }
  }
  
  // 獲取當前用戶
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })
  
  if (!session) {
    throw new Error('Invalid session')
  }
  
  // 創建文章
  const post = await db.post.create({
    data: {
      ...result.data,
      authorId: session.user.id
    }
  })
  
  revalidatePath('/posts')
  return { success: true, post }
}
```

## 安全措施

### 描述
實現多層次的安全防護

### 安全措施
- **CSRF 保護**: Next.js 自動提供 CSRF 保護
- **頻率限制**: 實現請求頻率限制
- **輸入清理**: 清理和轉義所有用戶輸入
- **SQL 注入防護**: 使用參數化查詢
- **XSS 防護**: 防止跨站腳本攻擊

### 範例
```typescript
'use server'
export async function rateLimitedAction(formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  // 檢查請求頻率
  const requestCount = await db.requestLog.count({
    where: {
      sessionId,
      action: 'rateLimitedAction',
      createdAt: {
        gte: new Date(Date.now() - 60 * 1000) // 1 minute
      }
    }
  })
  
  if (requestCount >= 10) {
    throw new Error('Rate limit exceeded. Please try again later.')
  }
  
  // 記錄請求
  await db.requestLog.create({
    data: {
      sessionId,
      action: 'rateLimitedAction',
      ip: headers().get('x-forwarded-for') || 'unknown'
    }
  })
  
  // 執行實際操作
  const result = await performAction(formData)
  
  return { success: true, result }
}
```

## 最佳實踐

1. 始終驗證用戶身份和權限
2. 使用 HTTPS 保護所有通信
3. 實現適當的會話管理
4. 定期更新依賴和修補安全漏洞
5. 使用環境變量存儲敏感信息
6. 實現日誌記錄和監控
7. 定期進行安全審計
8. 教育用戶關於安全最佳實踐

## 安全標頭

### Content Security Policy
防止 XSS 攻擊

### X-Frame-Options
防止點擊劫持

### X-Content-Type-Options
防止 MIME 類型嗅探

### Referrer Policy
控制 referrer 信息

### Permissions Policy
控制瀏覽器功能權限

## 常見漏洞

### SQL 注入
使用參數化查詢防止

### XSS
清理用戶輸入防止

### CSRF
Next.js 自動保護

### 會話劫持
使用安全的會話管理

### 權限提升
實現嚴格的權限檢查
