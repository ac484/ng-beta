{
  "title": "Next.js Server Actions 認證與安全",
  "version": "Next.js 14+",
  "description": "在 Server Actions 中實現安全的認證機制、權限控制、輸入驗證和安全最佳實踐",
  "metadata": {
    "category": "Authentication & Security",
    "complexity": "High",
    "usage": "用戶認證、權限控制、安全驗證、會話管理、數據保護",
    "lastmod": "2025-01-17"
  },
  "content": {
    "authentication": {
      "description": "實現用戶認證和會話管理",
      "patterns": {
        "session_based": "使用會話進行用戶認證",
        "jwt_based": "使用 JWT 令牌進行認證",
        "oauth_integration": "集成第三方 OAuth 服務"
      },
      "examples": {
        "login": "'use server'\n\nexport async function login(formData: FormData) {\n  const email = formData.get('email')\n  const password = formData.get('password')\n  \n  if (!email || !password) {\n    throw new Error('Email and password are required')\n  }\n  \n  try {\n    // 驗證用戶憑證\n    const user = await db.user.findUnique({\n      where: { email: email.toString() },\n      select: { id: true, email: true, password: true, role: true }\n    })\n    \n    if (!user) {\n      throw new Error('Invalid credentials')\n    }\n    \n    // 驗證密碼\n    const isValidPassword = await bcrypt.compare(password.toString(), user.password)\n    if (!isValidPassword) {\n      throw new Error('Invalid credentials')\n    }\n    \n    // 創建會話\n    const session = await createSession(user.id)\n    \n    // 設置 cookie\n    cookies().set('sessionId', session.id, {\n      httpOnly: true,\n      secure: process.env.NODE_ENV === 'production',\n      sameSite: 'lax',\n      maxAge: 60 * 60 * 24 * 7 // 7 days\n    })\n    \n    redirect('/dashboard')\n  } catch (error) {\n    return { \n      success: false, \n      error: error instanceof Error ? error.message : 'Login failed' \n    }\n  }\n}",
        "logout": "'use server'\nexport async function logout() {\n  const sessionId = cookies().get('sessionId')?.value\n  \n  if (sessionId) {\n    // 刪除會話\n    await db.session.delete({\n      where: { id: sessionId }\n    })\n    \n    // 清除 cookie\n    cookies().delete('sessionId')\n  }\n  \n  redirect('/login')\n}"
      }
    },
    "authorization": {
      "description": "實現基於角色的權限控制",
      "patterns": {
        "role_based": "基於用戶角色控制訪問權限",
        "permission_based": "基於具體權限控制功能訪問",
        "resource_based": "基於資源所有權控制訪問"
      },
      "example": "'use server'\nexport async function updatePost(postId: string, formData: FormData) {\n  // 獲取當前用戶會話\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) {\n    throw new Error('Unauthorized')\n  }\n  \n  const session = await db.session.findUnique({\n    where: { id: sessionId },\n    include: { user: true }\n  })\n  \n  if (!session) {\n    throw new Error('Invalid session')\n  }\n  \n  // 獲取要更新的文章\n  const post = await db.post.findUnique({\n    where: { id: postId },\n    include: { author: true }\n  })\n  \n  if (!post) {\n    throw new Error('Post not found')\n  }\n  \n  // 檢查權限：只有作者或管理員可以編輯\n  if (post.author.id !== session.user.id && session.user.role !== 'ADMIN') {\n    throw new Error('Insufficient permissions')\n  }\n  \n  // 更新文章\n  const updatedPost = await db.post.update({\n    where: { id: postId },\n    data: {\n      title: formData.get('title') as string,\n      content: formData.get('content') as string\n    }\n  })\n  \n  revalidatePath('/posts')\n  revalidatePath(`/posts/${postId}`)\n  \n  return { success: true, post: updatedPost }\n}"
    },
    "input_validation": {
      "description": "實現安全的輸入驗證和清理",
      "approaches": {
        "schema_validation": "使用 Zod 等庫進行模式驗證",
        "sanitization": "清理和轉義用戶輸入",
        "type_checking": "確保數據類型的正確性"
      },
      "example": "import { z } from 'zod'\nimport DOMPurify from 'isomorphic-dompurify'\n\nconst PostSchema = z.object({\n  title: z.string()\n    .min(1, 'Title is required')\n    .max(100, 'Title too long')\n    .transform(val => DOMPurify.sanitize(val)),\n  content: z.string()\n    .min(10, 'Content must be at least 10 characters')\n    .max(10000, 'Content too long')\n    .transform(val => DOMPurify.sanitize(val)),\n  tags: z.array(z.string().max(20)).max(5, 'Too many tags')\n})\n\n'use server'\nexport async function createPost(formData: FormData) {\n  const rawData = {\n    title: formData.get('title'),\n    content: formData.get('content'),\n    tags: formData.getAll('tags')\n  }\n  \n  // 驗證和清理數據\n  const result = PostSchema.safeParse(rawData)\n  if (!result.success) {\n    return { \n      success: false, \n      errors: result.error.flatten().fieldErrors \n    }\n  }\n  \n  // 獲取當前用戶\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) {\n    throw new Error('Unauthorized')\n  }\n  \n  const session = await db.session.findUnique({\n    where: { id: sessionId },\n    include: { user: true }\n  })\n  \n  if (!session) {\n    throw new Error('Invalid session')\n  }\n  \n  // 創建文章\n  const post = await db.post.create({\n    data: {\n      ...result.data,\n      authorId: session.user.id\n    }\n  })\n  \n  revalidatePath('/posts')\n  return { success: true, post }\n}"
    },
    "security_measures": {
      "description": "實現多層次的安全防護",
      "measures": {
        "csrf_protection": "Next.js 自動提供 CSRF 保護",
        "rate_limiting": "實現請求頻率限制",
        "input_sanitization": "清理和轉義所有用戶輸入",
        "sql_injection_prevention": "使用參數化查詢",
        "xss_prevention": "防止跨站腳本攻擊"
      },
      "example": "'use server'\nexport async function rateLimitedAction(formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) {\n    throw new Error('Unauthorized')\n  }\n  \n  // 檢查請求頻率\n  const requestCount = await db.requestLog.count({\n    where: {\n      sessionId,\n      action: 'rateLimitedAction',\n      createdAt: {\n        gte: new Date(Date.now() - 60 * 1000) // 1 minute\n      }\n    }\n  })\n  \n  if (requestCount >= 10) {\n    throw new Error('Rate limit exceeded. Please try again later.')\n  }\n  \n  // 記錄請求\n  await db.requestLog.create({\n    data: {\n      sessionId,\n      action: 'rateLimitedAction',\n      ip: headers().get('x-forwarded-for') || 'unknown'\n    }\n  })\n  \n  // 執行實際操作\n  const result = await performAction(formData)\n  \n  return { success: true, result }\n}"
    }
  },
  "best_practices": [
    "始終驗證用戶身份和權限",
    "使用 HTTPS 保護所有通信",
    "實現適當的會話管理",
    "定期更新依賴和修補安全漏洞",
    "使用環境變量存儲敏感信息",
    "實現日誌記錄和監控",
    "定期進行安全審計",
    "教育用戶關於安全最佳實踐"
  ],
  "security_headers": {
    "content_security_policy": "防止 XSS 攻擊",
    "x_frame_options": "防止點擊劫持",
    "x_content_type_options": "防止 MIME 類型嗅探",
    "referrer_policy": "控制 referrer 信息",
    "permissions_policy": "控制瀏覽器功能權限"
  },
  "common_vulnerabilities": {
    "sql_injection": "使用參數化查詢防止",
    "xss": "清理用戶輸入防止",
    "csrf": "Next.js 自動保護",
    "session_hijacking": "使用安全的會話管理",
    "privilege_escalation": "實現嚴格的權限檢查"
  }
}
