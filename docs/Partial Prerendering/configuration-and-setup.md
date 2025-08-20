# Next.js Partial Prerendering 配置與設置

**版本**: Next.js 15+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

詳細的 PPR 配置指南，包括全局設置、路由級別配置和最佳實踐。

**分類**: Configuration  
**複雜度**: Medium  
**用途**: 項目配置、路由設置、實驗性功能啟用

## 🌐 全局配置

### next.config.js/ts 配置

在 `next.config.js` 或 `next.config.ts` 中啟用 PPR：

#### TypeScript 配置
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig
```

#### JavaScript 配置
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

module.exports = nextConfig
```

#### 配置選項
- **`incremental`**: 啟用 PPR，允許個別路由選擇加入
- **`false`**: 為整個應用禁用 PPR

## 🛣️ 路由級別配置

### experimental_ppr 導出

在路由段中明確選擇加入 PPR，在 `layout.tsx` 或 `page.tsx` 文件頂部導出。

#### Layout 配置
```typescript
export const experimental_ppr = true

export default function Layout({ children }: { children: React.ReactNode }) {
  // ...
}
```

#### Page 配置
```typescript
export const experimental_ppr = true

export default function Page() {
  // ...
}
```

#### 繼承規則
- 父段設置會應用到所有子段，除非被子段覆蓋
- 子段可以設置 `experimental_ppr = false` 來禁用 PPR

## 📦 安裝要求

### Next.js 版本
```bash
npm install next@canary
```

### React 版本
React 18+ with Suspense support

### 實驗性功能
需要啟用實驗性功能標誌

## ✅ 配置最佳實踐

### 漸進式採用
使用 `'incremental'` 選項進行漸進式採用

### 路由特定控制
在需要 PPR 的路由中明確導出 `experimental_ppr`

### 測試環境
在開發環境中測試 PPR 功能

### 生產環境考慮
確保生產環境支持流式傳輸
