# Next.js Partial Prerendering 技術概覽

**版本**: Next.js 15+  
**最後更新**: 2025-01-17  
**來源**: Vercel Next.js Official Documentation  

## 📋 概述

Next.js Partial Prerendering (PPR) 是一種混合渲染策略，允許在同一路由中結合靜態和動態內容，優化初始頁面性能的同時支持個性化數據。

**分類**: Core Framework  
**複雜度**: High  
**用途**: 性能優化、混合渲染、靜態生成、動態內容流式傳輸

## 🎯 核心概念

### 定義
Partial Prerendering (PPR) 是一種渲染策略，允許開發者在同一路由中結合靜態和動態內容。

### 主要目標
改善初始頁面性能，同時支持個性化、動態數據。

### 關鍵優勢
- 快速初始頁面加載
- 靜態內容預渲染
- 動態內容流式傳輸
- 混合渲染策略

## 🏗️ 架構概覽

### 靜態外殼 (Static Shell)
頁面的靜態內容部分，在構建時預渲染並首先發送給用戶。

### 動態空洞 (Dynamic Holes)
靜態外殼中的動態內容區域，異步流式傳輸。

### 流式傳輸 (Streaming)
動態組件並行流式傳輸，減少整體頁面加載時間。

### Suspense 邊界
使用 React Suspense 定義動態邊界。

## 🔄 渲染策略

### 預渲染 (Prerendering)
靜態內容在構建時預渲染。

### 流式傳輸 (Streaming)
動態內容在請求時流式傳輸。

### 混合方法 (Hybrid Approach)
結合靜態和動態渲染的最佳實踐。

### 性能優化
通過靜態外殼提供快速初始顯示。

## ✅ 兼容性

### Next.js 版本
Next.js 15+

### React 版本
React 18+

### 實驗狀態
實驗性功能，需要明確啟用。

### 瀏覽器支持
現代瀏覽器支持流式傳輸。
