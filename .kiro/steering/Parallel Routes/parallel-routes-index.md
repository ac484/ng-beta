# Next.js Parallel Routes 文檔索引

**版本:** Next.js 15+  
**描述:** Next.js 平行路由的完整文檔索引，提供所有相關文檔的導航和概述  
**分類:** Documentation Index  
**複雜度:** All Levels  
**用途:** 文檔導航、學習路徑、快速參考  
**最後更新:** 2025-01-17

## 概述

平行路由是 Next.js 15+ 的強大功能，允許在同一佈局中同時渲染多個頁面，每個槽位可以獨立導航和更新

### 主要特性
- 獨立導航和更新
- 模組化架構
- 更好的用戶體驗
- 代碼組織優化
- 模態框和彈出層支持
- 條件渲染和權限控制

### 使用場景
- 儀表板應用
- 社交媒體 Feed
- 電子商務平台
- 管理後台
- 多模塊應用

## 文檔結構

完整的平行路由文檔體系，從基礎概念到進階應用

### 核心概念
- **路徑:** `core-concepts/parallel-routes-core-concepts.md`
- **標題:** 核心概念
- **描述:** 平行路由的基本概念、語法和架構
- **複雜度:** Beginner
- **內容:**
  - 平行路由概述
  - 基本語法
  - 槽位管理
  - 路由行為

### 實例與範例
- **路徑:** `examples/parallel-routes-examples.md`
- **標題:** 實例與範例
- **描述:** 實用的代碼示例和常見使用場景
- **複雜度:** Intermediate
- **內容:**
  - 基礎範例
  - 模態框範例
  - 標籤導航範例
  - 預設處理範例
  - 導航 Hook 範例

### 進階模式
- **路徑:** `advanced-patterns/parallel-routes-advanced-patterns.md`
- **標題:** 進階模式
- **描述:** 複雜場景和進階使用模式
- **複雜度:** Advanced
- **內容:**
  - 攔截路由模式
  - 條件渲染模式
  - 狀態管理模式
  - 性能優化模式
  - 錯誤邊界模式
  - 無障礙訪問模式
  - 測試模式

### 實作指南
- **路徑:** `implementation-guides/parallel-routes-implementation-guide.md`
- **標題:** 實作指南
- **描述:** 完整的實作指南和最佳實踐
- **複雜度:** Intermediate
- **內容:**
  - 設置指南
  - 文件結構指南
  - 組件實作
  - 路由行為
  - 狀態管理
  - 錯誤處理
  - 性能優化
  - 測試策略
  - 常見陷阱

### 最佳實踐
- **路徑:** `best-practices/parallel-routes-best-practices.md`
- **標題:** 最佳實踐
- **描述:** 開發最佳實踐和設計原則
- **複雜度:** Intermediate
- **內容:**
  - 設計原則
  - 命名約定
  - 文件組織
  - 性能優化
  - 狀態管理
  - 錯誤處理
  - 無障礙訪問
  - 測試最佳實踐
  - 安全考慮

### 故障排除
- **路徑:** `troubleshooting/parallel-routes-troubleshooting.md`
- **標題:** 故障排除
- **描述:** 常見問題和解決方案
- **複雜度:** Intermediate
- **內容:**
  - 常見錯誤
  - 路由問題
  - 性能問題
  - 狀態管理問題
  - 調試技術
  - 測試問題
  - 部署問題

### API 參考
- **路徑:** `api-reference/parallel-routes-api-reference.md`
- **標題:** API 參考
- **描述:** 完整的 API 參考文檔
- **複雜度:** Advanced
- **內容:**
  - 文件約定
  - 佈局組件 Props
  - 導航 Hooks
  - Link 組件
  - 特殊文件
  - 路由處理器
  - 中間件
  - 配置選項
  - TypeScript 類型定義

## 學習路徑

根據不同需求推薦的學習路徑

### 初學者路徑
- **名稱:** 初學者路徑
- **描述:** 從零開始學習平行路由
- **受眾:** React 和 Next.js 初學者
- **順序:**
  1. `core-concepts/parallel-routes-core-concepts.md`
  2. `examples/parallel-routes-examples.md`
  3. `implementation-guides/parallel-routes-implementation-guide.md`
- **預計時間:** 2-4 小時
- **重點:** 理解基本概念和實現簡單的平行路由

### 開發者路徑
- **名稱:** 開發者路徑
- **描述:** 實用開發和最佳實踐
- **受眾:** 有 Next.js 經驗的開發者
- **順序:**
  1. `examples/parallel-routes-examples.md`
  2. `implementation-guides/parallel-routes-implementation-guide.md`
  3. `best-practices/parallel-routes-best-practices.md`
- **預計時間:** 3-5 小時
- **重點:** 掌握實用技巧和最佳實踐

### 進階路徑
- **名稱:** 進階路徑
- **描述:** 複雜場景和進階模式
- **受眾:** 經驗豐富的開發者
- **順序:**
  1. `advanced-patterns/parallel-routes-advanced-patterns.md`
  2. `api-reference/parallel-routes-api-reference.md`
  3. `troubleshooting/parallel-routes-troubleshooting.md`
- **預計時間:** 4-6 小時
- **重點:** 掌握進階模式和解決複雜問題

### 參考路徑
- **名稱:** 參考路徑
- **描述:** 快速查找和參考
- **受眾:** 所有開發者
- **順序:**
  1. `api-reference/parallel-routes-api-reference.md`
  2. `troubleshooting/parallel-routes-troubleshooting.md`
- **預計時間:** 1-2 小時
- **重點:** 快速查找 API 和解決問題

## 快速參考

常用的語法、模式和配置的快速參考

### 文件約定
- `@analytics` - 創建分析槽位
- `(.)photo` - 攔截同級路由
- `(..)photo` - 攔截上一級路由
- `(dashboard)` - 分組路由

### 佈局組件
- 接受所有槽位作為 props
- 使用 `React.ReactNode` 類型
- 條件渲染槽位
- 處理錯誤情況

### 導航 Hooks
- `useSelectedLayoutSegment()` - 讀取活動段
- `useSelectedLayoutSegments()` - 讀取活動段數組
- `useRouter()` - 編程式導航

### 特殊文件
- `default.tsx` - 默認內容
- `loading.tsx` - 載入狀態
- `error.tsx` - 錯誤處理
- `not-found.tsx` - 404 頁面

## 常見模式

平行路由中常用的設計模式和實現方式

### 模態框模式
- **描述:** 使用攔截路由實現模態框
- **實現:** 創建 `@modal` 槽位和攔截路由
- **使用場景:** 登錄表單、圖片預覽、確認對話框

### 儀表板模式
- **描述:** 多個獨立模塊的儀表板
- **實現:** 創建多個槽位，如 `@analytics`、`@team`、`@documents`
- **使用場景:** 管理後台、數據分析、項目管理

### 條件渲染模式
- **描述:** 根據條件渲染不同的槽位
- **實現:** 在佈局組件中檢查條件並返回對應槽位
- **使用場景:** 用戶權限控制、功能標誌、設備適配

### 標籤導航模式
- **描述:** 槽位內的獨立標籤導航
- **實現:** 在槽位內創建獨立的導航組件
- **使用場景:** 數據視圖切換、功能模塊切換、內容分類

## 遷移指南

從其他路由方案遷移到平行路由的指南

### 從傳統多頁面應用遷移
- **描述:** 將多個獨立頁面整合到平行路由架構
- **步驟:**
  1. 識別可以並行顯示的內容
  2. 創建槽位目錄結構
  3. 重構佈局組件
  4. 實現槽位間通信

### 從模態框庫遷移
- **描述:** 使用平行路由替換第三方模態框庫
- **步驟:**
  1. 創建 `@modal` 槽位
  2. 實現攔截路由
  3. 替換模態框組件
  4. 更新導航邏輯

### 從條件渲染遷移
- **描述:** 將複雜的條件渲染邏輯轉換為平行路由
- **步驟:**
  1. 分析條件渲染邏輯
  2. 設計槽位結構
  3. 實現槽位組件
  4. 優化渲染性能

## 相關資源

學習平行路由的額外資源和參考

### 官方文檔
- **類型:** 官方文檔
- **URL:** https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
- **描述:** Next.js 官方平行路由文檔

### GitHub 倉庫
- **類型:** GitHub 倉庫
- **URL:** https://github.com/vercel/next.js
- **描述:** Next.js 源代碼和示例

### 社區討論
- **類型:** 社區討論
- **URL:** https://github.com/vercel/next.js/discussions
- **描述:** Next.js 社區討論和問題解答

### 示例項目
- **類型:** 示例項目
- **URL:** https://github.com/vercel/next.js/tree/canary/examples
- **描述:** 官方示例項目集合

## 版本兼容性

平行路由功能在不同 Next.js 版本中的支持情況

### Next.js 13.4+
- **支持:** 基礎平行路由功能
- **特性:**
  - 基本槽位支持
  - 簡單的佈局組件
  - 基本導航

### Next.js 14+
- **支持:** 完整平行路由功能
- **特性:**
  - 攔截路由
  - 進階導航 Hooks
  - 完整的文件約定

### Next.js 15+
- **支持:** 最新功能和優化
- **特性:**
  - 性能優化
  - 改進的類型支持
  - 新的配置選項
