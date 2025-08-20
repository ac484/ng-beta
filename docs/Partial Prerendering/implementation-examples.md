# Next.js Partial Prerendering 實現示例

**版本**: Next.js 15+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

完整的 PPR 實現示例、代碼模式和最佳實踐。

**分類**: Implementation Examples  
**複雜度**: Medium  
**用途**: 代碼示例、實現模式、最佳實踐、學習參考

## 🚀 基本實現

### 簡單的 PPR 頁面

**描述**: 基本的 PPR 頁面實現。

**文件**: `app/page.tsx`

#### TypeScript 實現
```tsx
import { Suspense } from 'react'
import StaticComponent from './StaticComponent'
import DynamicComponent from './DynamicComponent'
import Fallback from './Fallback'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
```

#### JavaScript 實現
```jsx
import { Suspense } from 'react'
import StaticComponent from './StaticComponent'
import DynamicComponent from './DynamicComponent'
import Fallback from './Fallback'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
```

**組件說明**:
- **StaticComponent**: 靜態組件，在構建時預渲染
- **DynamicComponent**: 動態組件，在請求時流式傳輸
- **Fallback**: 加載時的備用 UI

### 啟用 PPR 的佈局

**描述**: 啟用 PPR 的佈局組件。

**文件**: `app/layout.tsx`

#### TypeScript 實現
```tsx
export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

#### JavaScript 實現
```jsx
export const experimental_ppr = true

export default function Layout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

## 🔌 動態 API 整合

### Cookies 組件

**描述**: 使用 cookies API 的動態組件。

**文件**: `app/components/User.tsx`

#### TypeScript 實現
```tsx
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return (
    <div>
      <h2>User Profile</h2>
      <p>Session: {session || 'No session'}</p>
    </div>
  )
}
```

#### JavaScript 實現
```jsx
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return (
    <div>
      <h2>User Profile</h2>
      <p>Session: {session || 'No session'}</p>
    </div>
  )
}
```

**用法**: 在頁面中用 Suspense 包裝此組件以啟用 PPR。

### SearchParams 組件

**描述**: 處理 searchParams 的動態組件。

**文件**: `app/components/Table.tsx`

#### TypeScript 實現
```tsx
export async function Table({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  const sort = (await searchParams).sort === 'true'
  return (
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </tbody>
    </table>
  )
}
```

#### JavaScript 實現
```jsx
export async function Table({ searchParams }) {
  const sort = (await searchParams).sort === 'true'
  return (
    <table>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </tbody>
    </table>
  )
}
```

## ⚡ Suspense 整合

### 用戶資料頁面

**描述**: 使用 Suspense 的用戶資料頁面。

**文件**: `app/profile/page.tsx`

#### TypeScript 實現
```tsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './components/User'

export const experimental_ppr = true

export default function ProfilePage() {
  return (
    <section>
      <h1>User Profile</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

#### JavaScript 實現
```jsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './components/User'

export const experimental_ppr = true

export default function ProfilePage() {
  return (
    <section>
      <h1>User Profile</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

### 數據表格頁面

**描述**: 使用 Suspense 的數據表格頁面。

**文件**: `app/dashboard/page.tsx`

#### TypeScript 實現
```tsx
import { Table, TableSkeleton } from './components/Table'
import { Suspense } from 'react'

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  return (
    <section>
      <h1>Dashboard</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
```

#### JavaScript 實現
```jsx
import { Table, TableSkeleton } from './components/Table'
import { Suspense } from 'react'

export default function DashboardPage({ searchParams }) {
  return (
    <section>
      <h1>Dashboard</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
```

## 💾 緩存示例

### 緩存數據獲取

**描述**: 使用 `'use cache'` 指令的數據獲取。

**文件**: `app/lib/data.ts`

#### 之前
```typescript
async function getRecentArticles() {
  return db.query(...)
}
```

#### 之後
```typescript
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { unstable_cacheLife as cacheLife } from 'next/cache'

async function getRecentArticles() {
  'use cache'
  // 可通過 webhook 或服務器操作重新驗證
  cacheTag('articles')
  // 緩存將在一小時後自動重新驗證
  cacheLife('hours')
  return db.query(...)
}
```

### 緩存元數據

**描述**: 使用緩存的元數據生成。

**文件**: `app/blog/[slug]/page.tsx`

```tsx
import { cms } from '@/lib/cms'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  'use cache'
  const { title } = await cms.getPageData(`/blog/${params.slug}`)
  return { title }
}

async function getPageText({ params }: { params: { slug: string } }) {
  'use cache'
  const { text } = await cms.getPageData(`/blog/${params.slug}`)
  return text
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const text = await getPageText({ params })
  return <article>{text}</article>
}
```

## 🔗 Connection 工具示例

### 第三方整合

**描述**: 使用 `connection()` 的第三方整合。

**文件**: `app/api/third-party/page.tsx`

```tsx
import { connection } from 'next/server'
import { Suspense } from 'react'

async function ThirdPartyData() {
  await connection()
  // 從這裡開始的代碼將被排除在預渲染之外
  const token = await getDataFrom3rdParty()
  validateToken(token)
  return <div>Third party data loaded</div>
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading third party data...</div>}>
      <ThirdPartyData />
    </Suspense>
  )
}
```

## 🎭 Fallback 組件

### 頭像骨架屏

**描述**: 頭像加載時的骨架屏。

**文件**: `app/components/AvatarSkeleton.tsx`

#### TypeScript 實現
```tsx
export function AvatarSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
      <div className='mt-2 w-24 h-4 bg-gray-300 rounded'></div>
    </div>
  )
}
```

#### JavaScript 實現
```jsx
export function AvatarSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
      <div className='mt-2 w-24 h-4 bg-gray-300 rounded'></div>
    </div>
  )
}
```

### 表格骨架屏

**描述**: 表格加載時的骨架屏。

**文件**: `app/components/TableSkeleton.tsx`

#### TypeScript 實現
```tsx
export function TableSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='w-full h-8 bg-gray-300 rounded mb-4'></div>
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='w-full h-6 bg-gray-300 rounded'></div>
        ))}
      </div>
    </div>
  )
}
```

#### JavaScript 實現
```jsx
export function TableSkeleton() {
  return (
    <div className='animate-pulse'>
      <div className='w-full h-8 bg-gray-300 rounded mb-4'></div>
      <div className='space-y-2'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='w-full h-6 bg-gray-300 rounded'></div>
        ))}
      </div>
    </div>
  )
}
```

## 📁 項目結構

### 推薦的 PPR 項目結構

**描述**: 推薦的 PPR 項目結構。

**結構**:
```
app/
├── layout.tsx          # 根佈局，啟用 PPR
├── page.tsx            # 首頁
├── components/
│   ├── User.tsx        # 動態用戶組件
│   ├── Table.tsx       # 動態表格組件
│   ├── AvatarSkeleton.tsx  # 頭像骨架屏
│   └── TableSkeleton.tsx   # 表格骨架屏
└── lib/
    └── data.ts         # 數據獲取函數
next.config.ts          # Next.js 配置，啟用 PPR
```
