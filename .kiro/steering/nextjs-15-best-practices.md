---
inclusion: always
---

# Next.js 15 App Router 最佳實踐指南

## App Router 核心概念

### 檔案系統路由
Next.js 15 App Router 使用檔案系統進行路由，每個資料夾代表一個路由段：

```
app/
├── page.tsx          # 根路由 "/"
├── about/
│   └── page.tsx      # "/about" 路由
└── blog/
    ├── page.tsx      # "/blog" 路由
    └── [slug]/
        └── page.tsx  # "/blog/[slug]" 動態路由
```

### 特殊檔案約定
- `page.tsx`: 定義路由的 UI
- `layout.tsx`: 共享的 UI 佈局
- `loading.tsx`: 載入 UI
- `error.tsx`: 錯誤 UI
- `not-found.tsx`: 404 UI
- `route.ts`: API 端點 (Route Handlers)

## Server Components vs Client Components

### Server Components (預設)
```typescript
// 預設為 Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const posts = await data.json()
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**優點**:
- 在伺服器端渲染，減少客戶端 JavaScript
- 可以直接存取後端資源
- 更好的 SEO 和初始載入效能

### Client Components
```typescript
'use client'

import { useState } from 'react'

export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

**使用時機**:
- 需要使用瀏覽器 API (localStorage, sessionStorage)
- 需要事件監聽器 (onClick, onChange)
- 需要使用 React hooks (useState, useEffect)
- 需要使用第三方庫 (需要瀏覽器環境)

## 平行路由 (Parallel Routes)

### 基本概念
平行路由允許在同一佈局中同時渲染多個頁面：

```
app/
├── layout.tsx
├── @team/
│   ├── page.tsx
│   └── settings/
│       └── page.tsx
├── @analytics/
│   ├── page.tsx
│   └── revenue/
│       └── page.tsx
└── page.tsx
```

### 佈局實作
```typescript
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <div className="main">{children}</div>
      <div className="sidebar">
        {team}
        {analytics}
      </div>
    </div>
  )
}
```

### 條件渲染
```typescript
// 根據使用者權限條件渲染
export default function Layout({
  children,
  admin,
  user
}: LayoutProps) {
  const { role } = useAuth()
  
  return (
    <div>
      {children}
      {role === 'admin' ? admin : user}
    </div>
  )
}
```

### Default 檔案
```typescript
// app/@team/default.tsx
export default function Default() {
  return null // 或預設內容
}
```

## 攔截路由 (Intercepting Routes)

### 路由攔截約定
- `(.)folder`: 攔截同級路由
- `(..)folder`: 攔截上一級路由
- `(..)(..)folder`: 攔截上兩級路由
- `(...)folder`: 攔截根目錄路由

### 模態框實作範例
```
app/
├── @modal/
│   ├── (.)photo/
│   │   └── [id]/
│   │       └── page.tsx  # 攔截 /photo/[id]
│   └── default.tsx
├── photo/
│   └── [id]/
│       └── page.tsx      # 原始路由
└── layout.tsx
```

```typescript
// app/layout.tsx
export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

// app/@modal/(.)photo/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <PhotoDetail id={params.id} />
    </Modal>
  )
}
```

## Route Handlers (API Routes)

### 基本結構
```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  const users = await getUsers()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  return Response.json(user, { status: 201 })
}
```

### 動態路由
```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id)
  
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }
  
  return Response.json(user)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const user = await updateUser(params.id, body)
  return Response.json(user)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id)
  return Response.json({ success: true })
}
```

### 中間件整合
```typescript
// app/api/protected/route.ts
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth(request)
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // 受保護的邏輯
  return Response.json({ data: 'protected data' })
}
```

## 資料獲取最佳實踐

### Server Components 中的資料獲取
```typescript
// 快取策略
async function getData() {
  // 預設快取 (force-cache)
  const res = await fetch('https://api.example.com/data')
  
  // 不快取 (no-store)
  const res2 = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })
  
  // 時間基礎重新驗證
  const res3 = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // 1 小時
  })
  
  return res.json()
}

export default async function Page() {
  const data = await getData()
  
  return <div>{/* 渲染資料 */}</div>
}
```

### 平行資料獲取
```typescript
export default async function Page() {
  // 平行獲取資料
  const [users, posts, comments] = await Promise.all([
    getUsers(),
    getPosts(),
    getComments()
  ])
  
  return (
    <div>
      <Users data={users} />
      <Posts data={posts} />
      <Comments data={comments} />
    </div>
  )
}
```

### 串流和 Suspense
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<UsersSkeleton />}>
        <Users />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>
    </div>
  )
}

// 慢速元件
async function Users() {
  const users = await getUsers() // 慢速 API 呼叫
  return <UsersList users={users} />
}
```

## 錯誤處理

### 錯誤邊界
```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

### 全域錯誤處理
```typescript
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  )
}
```

### Not Found 處理
```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}

// 程式化觸發 404
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  
  if (!user) {
    notFound()
  }
  
  return <UserProfile user={user} />
}
```

## 載入狀態

### 路由級載入
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  )
}
```

### 巢狀載入狀態
```typescript
// app/dashboard/users/loading.tsx
export default function UsersLoading() {
  return (
    <div className="users-skeleton">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton-item" />
      ))}
    </div>
  )
}
```

## 中間件 (Middleware)

### 基本中間件
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 認證檢查
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 地區重定向
  if (request.nextUrl.pathname === '/') {
    const country = request.geo?.country || 'US'
    return NextResponse.redirect(new URL(`/${country.toLowerCase()}`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### 條件中間件
```typescript
export function middleware(request: NextRequest) {
  // 只對特定路由執行
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return adminMiddleware(request)
  }
  
  if (request.nextUrl.pathname.startsWith('/api')) {
    return apiMiddleware(request)
  }
  
  return NextResponse.next()
}
```

## 效能最佳化

### 程式碼分割
```typescript
// 動態載入
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // 僅客戶端渲染
})

// 條件載入
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <AdminSkeleton />,
})

export default function Dashboard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### 圖片最佳化
```typescript
import Image from 'next/image'

export default function Gallery() {
  return (
    <div>
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority // 優先載入
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
    </div>
  )
}
```

### 字體最佳化
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

## 元資料管理

### 靜態元資料
```typescript
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'This is my awesome app',
  keywords: ['nextjs', 'react', 'typescript'],
  authors: [{ name: 'John Doe' }],
  openGraph: {
    title: 'My App',
    description: 'This is my awesome app',
    images: ['/og-image.jpg'],
  },
}

export default function Page() {
  return <div>Home Page</div>
}
```

### 動態元資料
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}
```

## 國際化 (i18n)

### 基本設定
```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'zh-TW', 'ja'],
    defaultLocale: 'en',
  },
}

// app/[lang]/layout.tsx
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh-TW' }, { lang: 'ja' }]
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}
```

## 測試策略

### 元件測試
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### API 測試
```typescript
// __tests__/api/users.test.ts
import { GET, POST } from '@/app/api/users/route'

describe('/api/users', () => {
  it('should return users', async () => {
    const request = new Request('http://localhost:3000/api/users')
    const response = await GET(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })
})
```

這些最佳實踐確保您能充分利用 Next.js 15 App Router 的強大功能，建立高效能、可維護的現代 web 應用程式。