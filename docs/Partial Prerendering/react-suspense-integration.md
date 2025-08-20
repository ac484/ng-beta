# React Suspense 與 Next.js Partial Prerendering 整合

**版本**: Next.js 15+ / React 18+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

使用 React Suspense 在 PPR 中定義動態邊界，實現靜態內容預渲染和動態內容流式傳輸。

**分類**: React Integration  
**複雜度**: High  
**用途**: 動態邊界定義、流式傳輸、fallback UI、組件異步加載

## 🎯 Suspense 基礎

### 目的
在 PPR 中定義動態邊界，允許 Next.js 預渲染靜態內容和 fallback UI。

### 動態邊界
使用 Suspense 包裝動態組件，創建可流式傳輸的區域。

### Fallback UI
在動態內容加載時顯示的備用 UI。

## 🚀 基本實現

### 基本整合模式

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

## 🔧 動態組件包裝

### 使用動態 API 的組件

#### Cookies 示例 (TypeScript)
```tsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true

export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

#### Cookies 示例 (JavaScript)
```jsx
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true

export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

## 🔍 SearchParams 整合

### 處理動態 searchParams

#### TypeScript 實現
```tsx
import { Table, TableSkeleton } from './table'
import { Suspense } from 'react'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
```

#### JavaScript 實現
```jsx
import { Table, TableSkeleton } from './table'
import { Suspense } from 'react'

export default function Page({ searchParams }) {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<TableSkeleton />}>
        <Table searchParams={searchParams} />
      </Suspense>
    </section>
  )
}
```

## ✅ Suspense 最佳實踐

### Fallback 設計
設計有意義的 fallback UI，提供良好的用戶體驗。

### 邊界放置
在適當的組件層級放置 Suspense 邊界。

### 錯誤邊界
結合 Error Boundaries 處理動態組件錯誤。

### 性能優化
避免過度使用 Suspense，保持合理的組件粒度。

## 🚀 高級模式

### 嵌套 Suspense
在動態組件內部使用嵌套的 Suspense 邊界。

### 條件 Suspense
根據條件動態決定是否使用 Suspense。

### 加載狀態整合
結合自定義加載狀態和 Suspense fallback。
