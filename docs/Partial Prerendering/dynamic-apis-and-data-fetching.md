# Next.js Partial Prerendering 中的動態 API 和數據獲取

**版本**: Next.js 15+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

在 PPR 環境中使用動態 API、處理異步數據獲取和優化渲染性能。

**分類**: Data Fetching  
**複雜度**: High  
**用途**: 動態 API 整合、異步數據獲取、緩存策略、性能優化

## 🔌 動態 API

### Cookies API

使用 `next/headers` 中的 `cookies` API 訪問請求 cookies。

#### TypeScript 實現
```tsx
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
```

#### JavaScript 實現
```jsx
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
```

**行為**: 組件使用此 API 會選擇加入動態渲染，除非用 Suspense 包裝。

### Headers API

訪問請求頭信息。

**行為**: Next.js 15 中異步返回 `Promise<Headers>`  
**用法**: `await headers()` 獲取請求頭

### Draft Mode API

訪問草稿模式狀態。

**行為**: Next.js 15 中異步返回 `Promise<DraftMode>`  
**用法**: `await draftMode()` 獲取草稿模式狀態

## 🔗 Connection 工具

### 描述
`next/server` 中的 `connection()` 工具函數。

### 目的
控制預渲染行為，標記後續代碼應從預渲染中排除。

### 用法
`await connection()` 告知 Next.js 排除後續代碼的預渲染。

#### 代碼示例
```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  // 從這裡開始的代碼將被排除在預渲染之外
  const token = await getDataFrom3rdParty()
  validateToken(token)
  return ...
}
```

**Suspense 要求**: 使用 `connection()` 時需要 Suspense 邊界。

## 💾 緩存策略

### use cache 指令

使用 `'use cache'` 指令標記可緩存的異步函數。

**目的**: 允許數據在預渲染中包含，同時支持重新驗證。

#### 代碼示例

**之前**:
```typescript
async function getRecentArticles() {
  return db.query(...)
}
```

**之後**:
```typescript
async function getRecentArticles() {
  'use cache'
  cacheTag('articles')
  cacheLife('hours')
  return db.query(...)
}
```

### Cache Tag

使用 `unstable_cacheTag` 標記緩存。

**用法**: 可通過 webhook 或服務器操作重新驗證。

### Cache Life

使用 `unstable_cacheLife` 設置緩存生命週期。

**選項**: ["seconds", "minutes", "hours"]  
**影響**: 影響預渲染能力和客戶端路由緩存。

## 🔍 SearchParams 處理

### 描述
處理動態 `searchParams` 參數。

**異步行為**: Next.js 15 中 `searchParams` 是 Promise。

### 組件整合

#### TypeScript 實現
```tsx
export async function Table({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  const sort = (await searchParams).sort === 'true'
  return '...'
}
```

#### JavaScript 實現
```jsx
export async function Table({ searchParams }) {
  const sort = (await searchParams).sort === 'true'
  return '...'
}
```

**PPR 優勢**: 頁面可以預渲染，只有訪問 `searchParams` 值的組件會選擇加入動態渲染。

## ⚡ 性能優化

### 選擇性動態渲染
只有必要的組件選擇加入動態渲染。

### 靜態外殼優化
最大化靜態內容的預渲染。

### 流式傳輸優勢
動態內容並行流式傳輸。

### 緩存平衡
平衡緩存和預渲染需求。

## ✅ 最佳實踐

### API 訪問模式
在適當的組件層級訪問動態 API。

### Suspense 整合
使用 Suspense 包裝動態組件。

### 緩存策略
根據數據特性選擇適當的緩存策略。

### 錯誤處理
實現適當的錯誤邊界和錯誤處理。
