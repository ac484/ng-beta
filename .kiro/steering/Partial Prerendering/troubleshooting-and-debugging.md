# Next.js Partial Prerendering 故障排除與調試指南

**版本:** Next.js 15+  
**描述:** 常見 PPR 問題的解決方案、調試工具和錯誤處理策略

**元數據:**
- **類別:** Troubleshooting
- **複雜度:** Medium
- **用途:** 問題診斷、錯誤修復、調試工具、最佳實踐
- **最後修改:** 2025-01-17
- **來源:** Vercel Next.js Official Documentation

## 常見問題

### 預渲染錯誤

**描述:** 預渲染過程中出現的錯誤

**原因:**
- 動態 API 在預渲染時被訪問
- 不穩定的緩存回調
- 同步訪問請求數據
- `Math.random()` 或 `Date.now()` 在預渲染時使用

**解決方案:**
- 使用 Suspense 包裝動態組件
- 實現適當的緩存策略
- 使用 `connection()` 排除預渲染
- 緩存隨機值或時間相關數據

### 水合不匹配

**描述:** 服務器端和客戶端渲染不匹配

**原因:**
- 客戶端組件在 SSR 時訪問瀏覽器 API
- 隨機值在服務器端和客戶端不同
- 時間相關數據不一致

**解決方案:**
- 使用 Suspense 包裝客戶端組件
- 實現安全的隨機值生成
- 緩存時間相關數據

### 動態渲染問題

**描述:** 動態渲染相關問題

**原因:**
- 未正確使用 Suspense 邊界
- 動態 API 訪問模式不當
- `searchParams` 處理錯誤

**解決方案:**
- 檢查 Suspense 邊界放置
- 優化動態 API 訪問模式
- 正確處理異步 `searchParams`

## 調試工具

### Next.js 構建調試

**命令:** `next build --debug-prerender`

**描述:** 啟用預渲染調試輸出

**功能:**
- 禁用服務器代碼壓縮
- 啟用源映射
- 第一個錯誤後繼續構建
- 詳細的預渲染錯誤信息

**注意:** 僅用於開發環境，不應在生產構建中使用

### 控制台日誌

**描述:** 使用 `console.log` 調試預渲染問題

**最佳實踐:**
- 在關鍵組件中添加日誌
- 記錄動態 API 訪問
- 監控 Suspense 邊界行為

### 瀏覽器開發者工具

**描述:** 使用瀏覽器開發者工具調試

**功能:**
- Network 標籤監控流式傳輸
- Console 標籤查看錯誤
- Elements 標籤檢查 DOM 結構

## 錯誤解決方案

### PPR 捕獲錯誤

**描述:** PPR 捕獲錯誤的解決方案

**解決方案:** 在 `try/catch` 塊之前調用 `unstable_noStore()`

**代碼示例:**

**修改前:**
```typescript
async function fetchData() {
  try {
    const response = await fetch(url);
    // ... 其他代碼
  } catch (x) {
    // ... 錯誤處理
  }
}
```

**修改後:**
```typescript
import { unstable_noStore } from 'next/cache'

async function fetchData() {
  unstable_noStore() // 在 try/catch 之前選擇退出
  try {
    const response = await fetch(url);
    // ... 其他代碼
  } catch (x) {
    // ... 錯誤處理
  }
}
```

### 缺少 Suspense 邊界

**描述:** 缺少 Suspense 邊界的解決方案

**解決方案:** 為使用 `connection()` 的組件添加 Suspense 邊界

**代碼示例:**
```tsx
import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicComponent() {
  await connection()
  return <div>Dynamic content</div>
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicComponent />
    </Suspense>
  )
}
```

### 動態元數據

**描述:** 動態元數據問題的解決方案

**解決方案:** 使用 `'use cache'` 指令或 Suspense 邊界

**代碼示例:**

**緩存解決方案:**
```typescript
export async function generateMetadata() {
  'use cache'
  const { title } = await cms.getPageData('/.../page')
  return { title }
}
```

**Suspense 解決方案:**
```tsx
export default function RootLayout({ children }) {
  return (
    <Suspense>
      <html>
        <body>{children}</body>
      </html>
    </Suspense>
  )
}
```

## 預防策略

- **代碼組織:** 組織代碼以最大化靜態內容
- **API 訪問模式:** 優化動態 API 訪問模式
- **Suspense 策略:** 戰略性使用 Suspense 邊界
- **緩存實現:** 實現適當的緩存策略
- **測試方法:** 建立全面的測試策略

## 監控和警報

- **錯誤追蹤:** 實施錯誤追蹤和監控
- **性能監控:** 監控 PPR 性能指標
- **用戶體驗追蹤:** 追蹤用戶體驗指標
- **警報系統:** 建立自動化警報系統

