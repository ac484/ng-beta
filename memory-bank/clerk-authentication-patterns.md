# Clerk 認證整合實作模式

## 核心配置

### 1. 基礎配置

#### 環境變數設定
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### ClerkProvider 配置
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 2. 中間件配置

#### 基礎中間件
```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

#### 路由保護中間件
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
])

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // 自定義邏輯
  const { userId, sessionClaims } = await auth()
  
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    // 重定向到 onboarding
    return Response.redirect(new URL('/onboarding', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## 認證實作

### 1. 伺服器端認證

#### Server Components 認證
```typescript
// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  const user = await currentUser()
  
  return (
    <div>
      <h1>歡迎, {user?.firstName}!</h1>
      <p>用戶 ID: {userId}</p>
    </div>
  )
}
```

#### Server Actions 認證
```typescript
// lib/actions/portfolio-actions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createProject(formData: FormData) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  try {
    // 專案建立邏輯
    const project = await projectService.createProject({
      ...Object.fromEntries(formData),
      createdBy: userId
    })
    
    revalidatePath('/dashboard/portfolio')
    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### Route Handlers 認證
```typescript
// app/api/projects/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  try {
    const projects = await projectService.getProjects(userId)
    return NextResponse.json(projects)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
```

### 2. 客戶端認證

#### 認證 Hooks
```typescript
// lib/hooks/use-auth.ts
'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()
  
  const logout = async () => {
    await signOut()
    router.push('/sign-in')
  }
  
  const checkPermission = (permission: string) => {
    if (!user) return false
    return user.publicMetadata.permissions?.includes(permission) || false
  }
  
  return {
    isLoaded,
    isSignedIn,
    user,
    userId: user?.id,
    logout,
    checkPermission,
  }
}
```

#### 權限檢查 Hook
```typescript
// lib/hooks/use-permissions.ts
'use client'

import { useUser } from '@clerk/nextjs'

export function usePermissions() {
  const { user } = useUser()
  
  const permissions = {
    portfolio: {
      read: user?.publicMetadata.permissions?.includes('portfolio:read') || false,
      write: user?.publicMetadata.permissions?.includes('portfolio:write') || false,
      delete: user?.publicMetadata.permissions?.includes('portfolio:delete') || false,
    },
    partners: {
      read: user?.publicMetadata.permissions?.includes('partners:read') || false,
      write: user?.publicMetadata.permissions?.includes('partners:write') || false,
      delete: user?.publicMetadata.permissions?.includes('partners:delete') || false,
    },
    documents: {
      read: user?.publicMetadata.permissions?.includes('documents:read') || false,
      write: user?.publicMetadata.permissions?.includes('documents:write') || false,
      delete: user?.publicMetadata.permissions?.includes('documents:delete') || false,
    },
    analytics: {
      read: user?.publicMetadata.permissions?.includes('analytics:read') || false,
      write: user?.publicMetadata.permissions?.includes('analytics:write') || false,
    },
  }
  
  return permissions
}
```

### 3. 權限管理

#### 權限檢查元件
```typescript
// components/auth/permission-gate.tsx
'use client'

import { usePermissions } from '@/lib/hooks/use-permissions'

interface PermissionGateProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

export function PermissionGate({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGateProps) {
  const permissions = usePermissions()
  
  // 解析權限字串 (例如: "portfolio:read")
  const [module, action] = permission.split(':')
  
  const hasPermission = permissions[module as keyof typeof permissions]?.[action as any] || false
  
  if (!hasPermission) {
    return fallback
  }
  
  return <>{children}</>
}
```

#### 路由級權限檢查
```typescript
// app/dashboard/portfolio/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function PortfolioPage() {
  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  // 檢查權限
  const hasPortfolioAccess = sessionClaims?.metadata?.permissions?.includes('portfolio:read')
  
  if (!hasPortfolioAccess) {
    redirect('/dashboard')
  }
  
  return (
    <div>
      <h1>Portfolio 管理</h1>
      {/* Portfolio 內容 */}
    </div>
  )
}
```

## 用戶管理

### 1. 用戶資料管理

#### 用戶資料更新
```typescript
// lib/actions/user-actions.ts
'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function updateUserProfile(formData: FormData) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error('User not found')
    }
    
    const updateData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      publicMetadata: {
        ...user.publicMetadata,
        bio: formData.get('bio') as string,
        preferences: {
          theme: formData.get('theme') as string,
          language: formData.get('language') as string,
        },
      },
    }
    
    await clerkClient.users.updateUser(userId, updateData)
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### 用戶權限管理
```typescript
// lib/actions/admin-actions.ts
'use server'

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function updateUserPermissions(
  targetUserId: string, 
  permissions: string[]
) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  // 檢查當前用戶是否有管理權限
  const currentUser = await clerkClient.users.getUser(userId)
  const isAdmin = currentUser.publicMetadata.role === 'admin'
  
  if (!isAdmin) {
    throw new Error('Insufficient permissions')
  }
  
  try {
    await clerkClient.users.updateUser(targetUserId, {
      publicMetadata: {
        permissions,
        role: 'user',
      },
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 2. 組織管理

#### 組織權限檢查
```typescript
// lib/hooks/use-organization.ts
'use client'

import { useOrganization } from '@clerk/nextjs'

export function useOrganizationPermissions() {
  const { organization, isLoaded } = useOrganization()
  
  const permissions = {
    canManageMembers: organization?.membership?.role === 'admin',
    canManageSettings: organization?.membership?.role === 'admin',
    canViewAnalytics: organization?.membership?.role === 'admin' || 
                     organization?.membership?.role === 'moderator',
    canManageProjects: organization?.membership?.role === 'admin' || 
                      organization?.membership?.role === 'moderator',
  }
  
  return {
    organization,
    isLoaded,
    permissions,
    role: organization?.membership?.role,
  }
}
```

## 安全最佳實踐

### 1. 權限驗證

#### 與 Firebase App Check 整合
結合 Clerk 認證和 Firebase App Check 提供雙重安全保護：

```typescript
// lib/utils/security-utils.ts
import { auth } from '@clerk/nextjs/server'
import { getAppCheckToken } from '@/lib/services/app-check-service'

export async function validateRequest(request: Request) {
  // 1. Clerk 認證驗證
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized: User not authenticated')
  }
  
  // 2. App Check 驗證
  const appCheckToken = request.headers.get('X-Firebase-AppCheck')
  if (!appCheckToken) {
    throw new Error('Unauthorized: Missing App Check token')
  }
  
  try {
    const token = await getAppCheckToken()
    if (token.token !== appCheckToken) {
      throw new Error('Unauthorized: Invalid App Check token')
    }
  } catch (error) {
    throw new Error('Unauthorized: App Check validation failed')
  }
  
  return { userId, appCheckToken }
}
```

#### 安全中間件整合
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { validateAppCheckToken } from '@/lib/utils/security-utils'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/protected(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Clerk 認證
    await auth.protect()
    
    // App Check 驗證
    try {
      await validateAppCheckToken(req)
    } catch (error) {
      return new Response('App Check validation failed', { status: 401 })
    }
  }
})
```

#### 多層權限檢查
```typescript
// lib/utils/permission-utils.ts
export function validatePermissions(
  userPermissions: string[], 
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  )
}

export function checkResourceOwnership(
  resourceUserId: string, 
  currentUserId: string,
  userRole: string
): boolean {
  // 管理員可以存取所有資源
  if (userRole === 'admin') return true
  
  // 一般用戶只能存取自己的資源
  return resourceUserId === currentUserId
}
```

#### 權限裝飾器
```typescript
// lib/decorators/permission-decorator.ts
export function requirePermission(permission: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function (...args: any[]) {
      const { userId, sessionClaims } = await auth()
      
      if (!userId) {
        throw new Error('Unauthorized')
      }
      
      const userPermissions = sessionClaims?.metadata?.permissions || []
      
      if (!userPermissions.includes(permission)) {
        throw new Error('Insufficient permissions')
      }
      
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}
```

### 2. 會話管理

#### 會話安全配置
```typescript
// lib/config/session-config.ts
export const sessionConfig = {
  // 會話超時設定
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 小時
  
  // 多設備登入限制
  maxConcurrentSessions: 3,
  
  // 會話活動追蹤
  trackSessionActivity: true,
  
  // 自動登出設定
  autoLogout: {
    enabled: true,
    idleTimeout: 30 * 60 * 1000, // 30 分鐘
    warningTime: 5 * 60 * 1000,  // 5 分鐘警告
  },
}
```

#### 會話監控
```typescript
// lib/hooks/use-session-monitor.ts
'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

export function useSessionMonitor() {
  const { user } = useUser()
  const lastActivityRef = useRef(Date.now())
  
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [])
  
  useEffect(() => {
    const checkActivity = () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current
      
      if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 分鐘
        // 顯示警告或自動登出
        console.warn('Session timeout warning')
      }
    }
    
    const interval = setInterval(checkActivity, 60 * 1000) // 每分鐘檢查
    
    return () => clearInterval(interval)
  }, [])
}
```

## 整合模式

### 1. 與 TanStack Query 整合

#### 認證感知查詢
```typescript
// lib/queries/auth-aware-queries.ts
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/hooks/use-auth'

export function useAuthAwareQuery(
  queryKey: any[],
  queryFn: () => Promise<any>,
  options: any = {}
) {
  const { userId, isSignedIn } = useAuth()
  
  return useQuery({
    queryKey: [...queryKey, userId],
    queryFn,
    enabled: isSignedIn && !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
```

#### 認證感知突變
```typescript
// lib/mutations/auth-aware-mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/hooks/use-auth'

export function useAuthAwareMutation(
  mutationFn: (data: any) => Promise<any>,
  options: any = {}
) {
  const queryClient = useQueryClient()
  const { userId } = useAuth()
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context)
      }
      
      // 自動重新驗證相關查詢
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey: any[]) => {
          queryClient.invalidateQueries({ 
            queryKey: [...queryKey, userId] 
          })
        })
      }
    },
    ...options,
  })
}
```

### 2. 與 Server Actions 整合

#### 認證包裝器
```typescript
// lib/utils/auth-wrapper.ts
import { auth } from '@clerk/nextjs/server'

export function withAuth<T extends any[], R>(
  action: (userId: string, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('Unauthorized')
    }
    
    return action(userId, ...args)
  }
}

// 使用範例
export const createProject = withAuth(async (userId: string, formData: FormData) => {
  // 專案建立邏輯
  const project = await projectService.createProject({
    ...Object.fromEntries(formData),
    createdBy: userId
  })
  
  return { success: true, data: project }
})
```

## 錯誤處理

### 1. 認證錯誤處理

#### 統一錯誤處理
```typescript
// lib/utils/auth-error-handler.ts
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 401
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export function handleAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error
  }
  
  if (error instanceof Error) {
    if (error.message.includes('Unauthorized')) {
      return new AuthError('請重新登入', 'UNAUTHORIZED', 401)
    }
    
    if (error.message.includes('Insufficient permissions')) {
      return new AuthError('權限不足', 'INSUFFICIENT_PERMISSIONS', 403)
    }
  }
  
  return new AuthError('認證錯誤', 'AUTH_ERROR', 401)
}
```

### 2. 用戶友好錯誤訊息

#### 錯誤訊息元件
```typescript
// components/auth/auth-error-boundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth error:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="auth-error">
          <h2>認證錯誤</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            重試
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}
```

## 最佳實踐

### 1. 安全性

- 始終在伺服器端驗證用戶身份
- 實作適當的權限檢查
- 使用 HTTPS 保護所有通訊
- 實作會話超時和自動登出

### 2. 用戶體驗

- 提供清晰的錯誤訊息
- 實作無縫的認證流程
- 支援多種登入方式
- 實作記住登入狀態

### 3. 效能

- 使用適當的快取策略
- 實作懶載入認證狀態
- 優化權限檢查效能
- 監控認證相關效能指標

### 4. 可維護性

- 使用統一的認證模式
- 實作清晰的權限結構
- 提供完整的錯誤處理
- 建立認證相關測試

這個 Clerk 認證整合實作模式確保了專案整合的安全性、用戶體驗和可維護性。