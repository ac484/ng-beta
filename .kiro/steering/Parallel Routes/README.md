# Next.js Parallel Routes 技術文檔

## 概述

這是一個完整的 Next.js Parallel Routes 技術文檔系統，專為 AI 生成代碼和開發者參考而設計。所有文檔均以結構化 JSON 格式儲存，便於程序化處理和 AI 學習。

## 文檔結構

### 📚 核心文檔

| 文檔 | 路徑 | 描述 | 複雜度 |
|------|------|------|--------|
| **文檔索引** | `parallel-routes-index.json` | 完整的文檔導航和概述 | 所有級別 |
| **核心概念** | `parallel-routes-core-concepts.json` | 基本概念、語法和架構 | 初學者 |
| **實例與範例** | `parallel-routes-examples.json` | 實用代碼示例和常見場景 | 中級 |
| **進階模式** | `parallel-routes-advanced-patterns.json` | 複雜場景和進階使用模式 | 高級 |
| **實作指南** | `parallel-routes-implementation-guide.json` | 完整的實作指南和最佳實踐 | 中級 |
| **最佳實踐** | `parallel-routes-best-practices.json` | 開發最佳實踐和設計原則 | 中級 |
| **故障排除** | `parallel-routes-troubleshooting.json` | 常見問題和解決方案 | 中級 |
| **API 參考** | `parallel-routes-api-reference.json` | 完整的 API 參考文檔 | 高級 |

## 🎯 學習路徑

### 初學者路徑 (2-4 小時)
1. 核心概念 → 理解基本概念和語法
2. 實例與範例 → 學習實際應用
3. 實作指南 → 掌握實現方法

### 開發者路徑 (3-5 小時)
1. 實例與範例 → 複習實用技巧
2. 實作指南 → 深入實現細節
3. 最佳實踐 → 學習設計原則

### 進階路徑 (4-6 小時)
1. 進階模式 → 掌握複雜場景
2. API 參考 → 了解完整 API
3. 故障排除 → 學習問題解決

### 參考路徑 (1-2 小時)
1. API 參考 → 快速查找 API
2. 故障排除 → 解決具體問題

## 🚀 核心功能

### 平行路由特性
- **獨立導航和更新** - 每個槽位可以獨立更新
- **模組化架構** - 更好的代碼組織和維護
- **模態框支持** - 使用攔截路由實現模態框
- **條件渲染** - 根據權限、功能標誌等條件渲染
- **狀態保持** - 切換路由時保持其他槽位的狀態

### 文件約定
- **@folder** - 創建命名槽位
- **(.)folder** - 攔截同級路由
- **(..)folder** - 攔截上一級路由
- **(..)(..)folder** - 攔截兩級上路由
- **(...)folder** - 攔截根路由
- **(folder)** - 分組路由

### 特殊文件
- **default.tsx** - 默認內容
- **loading.tsx** - 載入狀態
- **error.tsx** - 錯誤處理
- **not-found.tsx** - 404 頁面

## 🔧 常用 Hooks

- **useSelectedLayoutSegment()** - 讀取當前活動段
- **useSelectedLayoutSegments()** - 讀取活動段數組
- **useRouter()** - 編程式導航

## 📱 使用場景

### 儀表板應用
- 多個獨立模塊並行顯示
- 實時數據更新
- 用戶權限控制

### 社交媒體 Feed
- 多個內容流並行
- 實時更新
- 用戶互動保持

### 電子商務平台
- 產品列表和詳情並行
- 購物車狀態保持
- 用戶偏好記憶

### 管理後台
- 多個功能模塊
- 權限控制
- 數據分析

## 🎨 設計模式

### 模態框模式
使用攔截路由實現模態框，支持登錄表單、圖片預覽、確認對話框等。

### 儀表板模式
創建多個槽位（如 @analytics、@team、@documents）實現模組化儀表板。

### 條件渲染模式
根據用戶權限、功能標誌、設備類型等條件渲染不同的槽位。

### 標籤導航模式
在槽位內創建獨立的標籤導航，支持數據視圖切換和功能模塊切換。

## 🔍 故障排除

文檔包含常見問題的解決方案：
- 類型錯誤和 404 問題
- 路由渲染問題
- 性能優化問題
- 狀態管理問題
- 調試技術和測試問題

## 📖 相關資源

- [Next.js 官方文檔](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [GitHub 倉庫](https://github.com/vercel/next.js)
- [社區討論](https://github.com/vercel/next.js/discussions)
- [示例項目](https://github.com/vercel/next.js/tree/canary/examples)

## 🔄 版本兼容性

- **Next.js 13.4+** - 基礎平行路由功能
- **Next.js 14+** - 完整平行路由功能
- **Next.js 15+** - 最新功能和優化

## 💡 AI 使用建議

### 代碼生成
使用 JSON 文檔作為參考，AI 可以：
- 生成符合最佳實踐的平行路由代碼
- 實現複雜的模態框和攔截路由
- 創建模組化的儀表板架構
- 處理錯誤邊界和無障礙訪問

### 問題解決
AI 可以參考故障排除文檔：
- 診斷常見問題
- 提供解決方案
- 優化性能問題
- 改進代碼質量

## 📝 文檔維護

- **最後更新**: 2025-01-17
- **格式**: 結構化 JSON
- **語言**: 中文
- **目標**: AI 代碼生成和開發者參考

---

*此文檔系統專為 AI 生成代碼和開發者學習而設計，所有內容均基於 Next.js 官方文檔和最佳實踐。*
