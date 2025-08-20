# Next.js Partial Prerendering API 參考與配置

**版本**: Next.js 15+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

完整的 PPR API 參考、配置選項和技術規範。

**分類**: API Reference  
**複雜度**: High  
**用途**: API 參考、配置選項、技術規範、開發指南

## ⚙️ 配置選項

### next.config.js

#### experimental.ppr

**類型**: `string | boolean`  
**默認值**: `false`  
**描述**: 啟用 Partial Prerendering 的全局配置

**值**:
- **`incremental`**: 啟用 PPR，允許個別路由選擇加入
- **`false`**: 為整個應用禁用 PPR

**示例**:
```javascript
experimental: { ppr: 'incremental' }
```

### 路由段配置

#### experimental_ppr

**類型**: `boolean`  
**默認值**: `false` (如果未明確設置)  
**描述**: 明確選擇特定路由段加入 PPR

**適用於**: `app` 目錄中的 Layouts 和 Pages  
**繼承**: 父段設置會應用到所有子段，除非被子段覆蓋

**示例**:
```typescript
export const experimental_ppr = true
```

## 🔌 動態 API

### cookies

**導入**: `import { cookies } from 'next/headers'`  
**返回類型**: `Promise<Cookies>`  
**行為**: 組件使用此 API 會選擇加入動態渲染，除非用 Suspense 包裝  
**用法**: `const session = (await cookies()).get('session')?.value`

### headers

**導入**: `import { headers } from 'next/headers'`  
**返回類型**: `Promise<Headers>`  
**行為**: Next.js 15 中異步返回  
**用法**: `const userAgent = (await headers()).get('user-agent')`

### draftMode

**導入**: `import { draftMode } from 'next/headers'`  
**返回類型**: `Promise<DraftMode>`  
**行為**: Next.js 15 中異步返回  
**用法**: `const { isEnabled } = await draftMode()`

## 🛠️ 工具函數

### connection

**導入**: `import { connection } from 'next/server'`  
**返回類型**: `Promise<void>`  
**目的**: 控制預渲染行為，標記後續代碼應從預渲染中排除  
**用法**: `await connection()`  
**Suspense 要求**: 使用時需要 Suspense 邊界

### unstable_noStore

**導入**: `import { unstable_noStore } from 'next/cache'`  
**返回類型**: `void`  
**目的**: 在 try/catch 塊之前選擇退出靜態生成  
**用法**: `unstable_noStore()`

## 💾 緩存 API

### unstable_cacheTag

**導入**: `import { unstable_cacheTag as cacheTag } from 'next/cache'`  
**返回類型**: `void`  
**目的**: 標記緩存，可通過 webhook 或服務器操作重新驗證  
**用法**: `cacheTag('articles')`

### unstable_cacheLife

**導入**: `import { unstable_cacheLife as cacheLife } from 'next/cache'`  
**返回類型**: `void`  
**目的**: 設置緩存生命週期  
**選項**: ["seconds", "minutes", "hours"]  
**用法**: `cacheLife('hours')`

## 🔍 SearchParams API

**類型**: `Promise<{ [key: string]: string | string[] | undefined }>`  
**描述**: Next.js 15 中 searchParams 是 Promise  
**用法**: `const sort = (await searchParams).sort === 'true'`  
**PPR 優勢**: 頁面可以預渲染，只有訪問 searchParams 值的組件會選擇加入動態渲染

## ⚡ Suspense 整合

**導入**: `import { Suspense } from 'react'`  
**目的**: 在 PPR 中定義動態邊界  
**fallback 屬性**: 在動態內容加載時顯示的備用 UI  
**動態邊界**: 使用 Suspense 包裝動態組件，創建可流式傳輸的區域

## 🔧 構建和調試

### debug-prerender

**命令**: `next build --debug-prerender`  
**描述**: 啟用預渲染調試輸出

**功能**:
- 禁用服務器代碼壓縮
- 啟用源映射
- 第一個錯誤後繼續構建
- 詳細的預渲染錯誤信息

**用法**: 僅用於開發環境，不應在生產構建中使用。

## 🚨 錯誤處理

### PPR 捕獲錯誤

**錯誤信息**: `Route {pathname} needs to bail out of prerendering at this point because it used {expression}`  
**解決方案**: 在 try/catch 塊之前調用 `unstable_noStore()`  
**預防**: 使用 Suspense 包裝動態組件

### 缺少 Suspense

**錯誤信息**: `Missing Suspense boundary for component using connection()`  
**解決方案**: 為使用 `connection()` 的組件添加 Suspense 邊界

## ⚡ 性能考慮

### 靜態內容優化
最大化靜態內容的預渲染。

### 動態內容隔離
使用 Suspense 隔離動態內容。

### 緩存策略
實現適當的緩存策略。

### 流式傳輸優化
優化流式傳輸性能。

## ✅ 兼容性說明

### Next.js 版本
Next.js 15+

### React 版本
React 18+ with Suspense support

### 實驗狀態
實驗性功能，需要明確啟用。

### 瀏覽器支持
現代瀏覽器支持流式傳輸。
