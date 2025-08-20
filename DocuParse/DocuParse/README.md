# DocuParse - 智能文檔解析系統

一個基於 Next.js、TypeScript 和 AI 技術的智能文檔解析系統，能夠自動從合同、報價單和估價單中提取工作項目、數量、價格等關鍵信息。

## 系統架構

本系統採用現代化的全棧架構：
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **AI 引擎**: Google Genkit + Gemini 2.0 Flash
- **UI 組件**: shadcn/ui
- **狀態管理**: React Hooks + Server Actions

## 完整函數文檔

本文檔詳細記錄了系統中每一個函數的完整信息，包括參數、返回值、實現細節和使用場景。

---

## src/ai/flows/extract-work-items.ts

### AI 工作流程核心模組

#### `extractWorkItems(input: ExtractWorkItemsInput): Promise<ExtractWorkItemsOutput>`
- **功能**: 主要的工作項目提取函數，處理文檔並返回結構化數據
- **參數**: 
  - `input: ExtractWorkItemsInput` - 包含文檔數據 URI 的輸入對象
    - `documentDataUri: string` - Base64 編碼的文檔數據 URI，格式為 `data:<mimetype>;base64,<encoded_data>`
- **返回值**: `Promise<ExtractWorkItemsOutput>` - 提取結果的 Promise
  - `workItems: WorkItem[]` - 提取的工作項目數組
  - `totalTokens: number` - AI 處理使用的總 token 數
- **實現**: 調用內部的 `extractWorkItemsFlow` 函數
- **用途**: 作為外部 API 的入口點，供 Server Actions 調用

#### `extractWorkItemsFlow` (AI Flow 定義)
- **功能**: 定義 AI 處理流程的核心邏輯
- **名稱**: 'extractWorkItemsFlow'
- **輸入模式**: `ExtractWorkItemsInputSchema`
- **輸出模式**: `ExtractWorkItemsOutputSchema`
- **實現**: 
  - 調用 `extractWorkItemsPrompt` 進行 AI 分析
  - 驗證 AI 輸出的有效性
  - 返回格式化的結果，包含工作項目和 token 使用量
- **錯誤處理**: 當 AI 無輸出時拋出 'No output from AI' 錯誤

#### `extractWorkItemsPrompt` (AI Prompt 定義)
- **功能**: 定義 AI 提示模板，指導 AI 如何解析文檔
- **名稱**: 'extractWorkItemsPrompt'
- **輸入模式**: `ExtractWorkItemsInputSchema`
- **輸出模式**: `ExtractWorkItemsOutputSchema`
- **提示內容**: 
  - 專家級 AI 助手角色設定
  - 文檔類型識別（合同、報價單、估價單）
  - 工作項目提取指令
  - 數量和價格計算邏輯
  - 默認值處理規則（數量默認為 1，單價通過總價/數量計算）

### 類型定義

#### `ExtractWorkItemsInput`
```typescript
interface ExtractWorkItemsInput {
  documentDataUri: string; // 必須包含 MIME 類型和 Base64 編碼
}
```

#### `ExtractWorkItemsOutput`
```typescript
interface ExtractWorkItemsOutput {
  workItems: Array<{
    item: string;        // 工作項目描述
    quantity: number;    // 數量
    price: number;       // 總價
    unitPrice: number;   // 單價
  }>;
  totalTokens: number;   // AI 處理使用的 token 數
}
```

---

## src/app/actions.ts

### Server Actions 模組

#### `extractDataFromDocument(prevState: ActionState, formData: FormData): Promise<ActionState>`
- **功能**: 處理文檔上傳和數據提取的 Server Action
- **參數**: 
  - `prevState: ActionState` - 前一個狀態（React useActionState 要求，實際未使用）
  - `formData: FormData` - 包含上傳文件的表單數據
- **返回值**: `Promise<ActionState>` - 處理結果狀態
  - 成功: `{ data: ExtractWorkItemsOutput, fileName: string }`
  - 失敗: `{ error: string }`
- **實現流程**: 
  1. 驗證文件存在性和大小
  2. 將文件轉換為 ArrayBuffer
  3. 編碼為 Base64 字符串
  4. 構造數據 URI
  5. 驗證數據 URI 格式
  6. 調用 AI 提取函數
  7. 驗證 AI 返回結果
  8. 返回成功或錯誤狀態
- **錯誤處理**: 
  - 文件驗證失敗
  - 數據 URI 格式無效
  - AI 處理異常
  - 結果驗證失敗

#### `actionInputSchema` (Zod 驗證)
- **功能**: 驗證輸入數據 URI 的格式
- **規則**: 
  - 必須是字符串
  - 必須以 'data:' 開頭
- **用途**: 確保傳遞給 AI 的數據格式正確

### 類型定義

#### `ActionState`
```typescript
interface ActionState {
  data?: ExtractWorkItemsOutput;  // 成功時的提取數據
  error?: string;                 // 錯誤信息
  fileName?: string;              // 上傳的文件名
}
```

---

## src/app/layout.tsx

### 根布局組件

#### `RootLayout({ children }: { children: React.ReactNode }): JSX.Element`
- **功能**: 應用程序的根布局組件，提供全局樣式和結構
- **參數**: 
  - `children: React.ReactNode` - 子組件內容
- **返回值**: `JSX.Element` - 完整的 HTML 文檔結構
- **特性**: 
  - 設置 HTML 語言為英文
  - 啟用深色主題 (`className="dark"`)
  - 預加載 Google Fonts (Inter 字體)
  - 集成 Toast 通知系統
  - 應用全局 CSS 樣式
- **字體配置**: 
  - 字體族: Inter
  - 權重: 400, 500, 600, 700
  - 顯示策略: swap
- **樣式類**: 
  - `font-body`: 應用 Inter 字體
  - `antialiased`: 字體反鋸齒

#### `metadata: Metadata` (導出常量)
- **功能**: 定義應用程序的元數據
- **屬性**: 
  - `title: 'DocuParse'` - 頁面標題
  - `description: 'Intelligently parse and extract data from your documents.'` - 頁面描述
- **用途**: SEO 優化和瀏覽器標籤顯示

---

## src/app/page.tsx

### 主頁面組件

#### `Home(): JSX.Element`
- **功能**: 應用程序的主頁面組件，管理文檔上傳和數據展示
- **參數**: 無
- **返回值**: `JSX.Element` - 完整的主頁面界面
- **狀態管理**: 
  - `state` - 通過 `useActionState` 管理的表單狀態
  - `isPending` - 通過 `useTransition` 管理的加載狀態
  - `fileInputRef` - 文件輸入元素的引用
  - `formRef` - 表單元素的引用

#### `handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void`
- **功能**: 處理文件選擇變更事件
- **參數**: 
  - `event: React.ChangeEvent<HTMLInputElement>` - 文件輸入變更事件
- **返回值**: `void`
- **實現**: 
  - 檢查是否有文件被選中
  - 創建 FormData 對象
  - 使用 `startTransition` 觸發表單提交
  - 自動開始文檔處理流程
- **特性**: 支持文件選擇後立即處理

#### `handleUploadClick(): void`
- **功能**: 處理上傳區域點擊事件
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 重置文件輸入值（允許重新上傳相同文件）
  - 觸發文件選擇對話框
- **用戶體驗**: 提供直觀的文件上傳交互

#### `useEffect` (錯誤處理)
- **功能**: 監聽狀態變化並顯示錯誤提示
- **依賴**: `[state, toast]`
- **實現**: 
  - 檢查 `state.error` 是否存在
  - 使用 Toast 顯示錯誤信息
  - 設置為破壞性變體（紅色警告）
- **用戶體驗**: 及時反饋處理錯誤

### UI 組件結構

#### 頭部區域
- **標題**: "DocuParse" - 大型響應式標題
- **副標題**: 功能描述文字
- **樣式**: 居中對齊，響應式字體大小

#### 上傳區域
- **拖放區**: 虛線邊框的上傳區域
- **圖標**: UploadCloud 圖標
- **提示文字**: 點擊上傳或拖放說明
- **文件類型**: 支持 PDF、DOC、DOCX 格式
- **交互**: 
  - 鼠標懸停效果
  - 鍵盤訪問支持
  - 無障礙標籤

#### 加載狀態
- **加載動畫**: 旋轉的 Loader2 圖標
- **提示文字**: "正在提取數據，請稍候..."
- **用戶體驗**: 清晰的處理狀態反饋

#### 結果展示
- **文件信息**: 顯示處理的文件名
- **Token 統計**: 顯示 AI 處理使用的 token 數
- **輸入字段**: 
  - 編號 (Document ID)
  - 名稱 (Document Name)  
  - 客戶 (Client Name)
  - 客戶代表 (Client Representative)
- **數據表格**: 使用 `WorkItemsTable` 組件展示提取結果

---

## src/components/work-items-table.tsx

### 工作項目表格組件

#### `WorkItemsTable({ initialData }: WorkItemsTableProps): JSX.Element`
- **功能**: 可編輯的工作項目數據表格，支持增刪改查和導出
- **參數**: 
  - `initialData: WorkItem[]` - 初始工作項目數據數組
- **返回值**: `JSX.Element` - 完整的數據表格組件
- **狀態管理**: 
  - `data` - 當前工作項目數據
- **特性**: 
  - 實時編輯
  - 自動計算
  - 行操作
  - 數據導出

#### `handleInputChange(index: number, field: keyof WorkItem, value: string | number): void`
- **功能**: 處理表格單元格輸入變更
- **參數**: 
  - `index: number` - 行索引
  - `field: keyof WorkItem` - 字段名稱
  - `value: string | number` - 新值
- **返回值**: `void`
- **實現邏輯**: 
  - 創建數據副本避免直接修改
  - 處理字符串和數字類型轉換
  - 自動計算相關字段：
    - 修改數量或單價時，自動計算總價
    - 修改總價時，自動計算單價
  - 防止除零錯誤
  - 保留兩位小數精度
- **計算規則**: 
  - `總價 = 數量 × 單價`
  - `單價 = 總價 ÷ 數量`

#### `handleRemoveRow(index: number): void`
- **功能**: 刪除指定行的工作項目
- **參數**: 
  - `index: number` - 要刪除的行索引
- **返回值**: `void`
- **實現**: 使用 `filter` 方法移除指定索引的項目
- **用戶體驗**: 即時更新表格顯示

#### `handleAddRow(): void`
- **功能**: 添加新的工作項目行
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 創建默認工作項目對象
  - 添加到數據數組末尾
- **默認值**: 
  - `item: 'New Item'`
  - `quantity: 1`
  - `price: 0`
  - `unitPrice: 0`

#### `exportToCSV(): void`
- **功能**: 將工作項目數據導出為 CSV 文件
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 定義 CSV 標題行
  - 轉換數據為 CSV 格式
  - 處理字符串中的引號轉義
  - 創建 Blob 對象
  - 觸發文件下載
- **文件名**: 'work-items.csv'
- **編碼**: UTF-8

#### `exportToJSON(): void`
- **功能**: 將工作項目數據導出為 JSON 文件
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 使用 `JSON.stringify` 格式化數據
  - 設置縮進為 2 空格
  - 創建 Blob 對象
  - 觸發文件下載
- **文件名**: 'work-items.json'
- **格式**: 美化的 JSON

#### `useEffect` (數據同步)
- **功能**: 同步外部數據變更到內部狀態
- **依賴**: `[initialData]`
- **實現**: 當 `initialData` 變更時更新內部 `data` 狀態
- **用途**: 支持外部數據更新

### 表格結構

#### 表頭
- **#**: 行號
- **Item Description**: 項目描述（50% 寬度）
- **Quantity**: 數量（右對齊，120px 寬度）
- **Unit Price**: 單價（右對齊，150px 寬度）
- **Total Price**: 總價（右對齊，150px 寬度）
- **操作**: 刪除按鈕（12px 寬度）

#### 表格行
- **懸停效果**: `hover:bg-muted/50`
- **輸入框樣式**: 
  - 透明背景
  - 無邊框
  - 聚焦時顯示環形邊框
  - 數字字段右對齊
  - 價格字段支持小數點後兩位

#### 空狀態處理
- **顯示條件**: 當 `data.length === 0` 時
- **內容**: 
  - 提示信息："未從文檔中提取到工作項目"
  - 建議："您可以手動添加項目"
  - 添加按鈕：允許手動創建項目

#### 操作按鈕區域
- **左側**: "添加行" 按鈕
- **右側**: 導出按鈕組
  - "導出 CSV" 按鈕（FileText 圖標）
  - "導出 JSON" 按鈕（FileJson 圖標）

### 類型定義

#### `WorkItem`
```typescript
interface WorkItem {
  item: string;        // 項目描述
  quantity: number;    // 數量
  price: number;       // 總價
  unitPrice: number;   // 單價
}
```

#### `WorkItemsTableProps`
```typescript
interface WorkItemsTableProps {
  initialData: WorkItem[];  // 初始數據
}
```

---

## src/hooks/use-toast.ts

### Toast 通知系統 Hook

#### `useToast(): ToastHookReturn`
- **功能**: 提供 Toast 通知功能的自定義 Hook
- **參數**: 無
- **返回值**: `ToastHookReturn` - 包含 Toast 狀態和操作函數
  - `toasts: ToasterToast[]` - 當前顯示的 Toast 列表
  - `toast: (props: Toast) => ToastReturn` - 創建 Toast 的函數
  - `dismiss: (toastId?: string) => void` - 關閉 Toast 的函數
- **實現**: 
  - 使用 `useState` 管理本地狀態
  - 使用 `useEffect` 註冊狀態監聽器
  - 返回時自動清理監聽器
- **特性**: 
  - 全局狀態管理
  - 自動清理機制
  - 支持多個 Toast 實例

#### `toast({ ...props }: Toast): ToastReturn`
- **功能**: 創建並顯示新的 Toast 通知
- **參數**: 
  - `props: Toast` - Toast 配置對象（除 id 外的所有屬性）
- **返回值**: `ToastReturn` - Toast 控制對象
  - `id: string` - Toast 唯一標識符
  - `dismiss: () => void` - 關閉此 Toast 的函數
  - `update: (props: ToasterToast) => void` - 更新此 Toast 的函數
- **實現**: 
  - 生成唯一 ID
  - 創建更新和關閉函數
  - 分發 ADD_TOAST 動作
  - 設置自動關閉回調

#### `reducer(state: State, action: Action): State`
- **功能**: Toast 狀態管理的 Reducer 函數
- **參數**: 
  - `state: State` - 當前狀態
  - `action: Action` - 要執行的動作
- **返回值**: `State` - 新的狀態
- **支持的動作**: 
  - `ADD_TOAST`: 添加新 Toast
  - `UPDATE_TOAST`: 更新現有 Toast
  - `DISMISS_TOAST`: 關閉 Toast（設置為不可見）
  - `REMOVE_TOAST`: 完全移除 Toast
- **特性**: 
  - 限制最大 Toast 數量（TOAST_LIMIT = 1）
  - 自動排隊移除機制
  - 支持批量關閉

#### `dispatch(action: Action): void`
- **功能**: 分發動作到全局狀態管理器
- **參數**: 
  - `action: Action` - 要執行的動作
- **返回值**: `void`
- **實現**: 
  - 使用 reducer 計算新狀態
  - 通知所有註冊的監聽器
  - 更新全局內存狀態

#### `genId(): string`
- **功能**: 生成唯一的 Toast ID
- **參數**: 無
- **返回值**: `string` - 唯一標識符
- **實現**: 
  - 使用遞增計數器
  - 防止數字溢出（模 MAX_SAFE_INTEGER）
  - 轉換為字符串格式

#### `addToRemoveQueue(toastId: string): void`
- **功能**: 將 Toast 添加到自動移除隊列
- **參數**: 
  - `toastId: string` - Toast ID
- **返回值**: `void`
- **實現**: 
  - 檢查是否已在隊列中
  - 設置延遲移除定時器
  - 存儲定時器引用以便取消
- **延遲時間**: TOAST_REMOVE_DELAY = 1000000ms

### 常量配置

#### `TOAST_LIMIT: number`
- **值**: 1
- **用途**: 限制同時顯示的 Toast 數量

#### `TOAST_REMOVE_DELAY: number`
- **值**: 1000000 (毫秒)
- **用途**: Toast 關閉後完全移除的延遲時間

#### `actionTypes`
- **功能**: 定義所有支持的動作類型
- **值**: 
  - `ADD_TOAST: "ADD_TOAST"`
  - `UPDATE_TOAST: "UPDATE_TOAST"`
  - `DISMISS_TOAST: "DISMISS_TOAST"`
  - `REMOVE_TOAST: "REMOVE_TOAST"`

### 類型定義

#### `ToasterToast`
```typescript
interface ToasterToast extends ToastProps {
  id: string;                           // 唯一標識符
  title?: React.ReactNode;              // 標題
  description?: React.ReactNode;        // 描述
  action?: ToastActionElement;          // 動作按鈕
}
```

#### `State`
```typescript
interface State {
  toasts: ToasterToast[];  // Toast 列表
}
```

#### `Action` (聯合類型)
```typescript
type Action = 
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }
```

---

## src/lib/utils.ts

### 工具函數模組

#### `cn(...inputs: ClassValue[]): string`
- **功能**: 合併和優化 CSS 類名的工具函數
- **參數**: 
  - `...inputs: ClassValue[]` - 可變數量的類名值
    - 支持字符串、對象、數組、條件表達式等多種格式
- **返回值**: `string` - 合併後的 CSS 類名字符串
- **實現**: 
  - 使用 `clsx` 進行條件類名合併
  - 使用 `twMerge` 進行 Tailwind CSS 類名優化和去重
- **用途**: 
  - 條件樣式應用
  - Tailwind CSS 類名衝突解決
  - 組件樣式組合
- **示例用法**: 
  ```typescript
  cn("base-class", condition && "conditional-class", {
    "active": isActive,
    "disabled": isDisabled
  })
  ```

### 依賴說明

#### `clsx`
- **功能**: 條件類名構建工具
- **特性**: 
  - 支持多種輸入格式
  - 自動過濾假值
  - 輕量級實現

#### `twMerge`
- **功能**: Tailwind CSS 類名合併工具
- **特性**: 
  - 智能去重
  - 衝突解決
  - 保持最後的類名優先級

### 類型定義

#### `ClassValue` (來自 clsx)
```typescript
type ClassValue = 
  | string 
  | number 
  | ClassDictionary 
  | ClassArray 
  | undefined 
  | null 
  | boolean
```

---

## 系統特性總結

### 核心功能
1. **智能文檔解析**: 使用 Google Gemini AI 自動提取工作項目
2. **實時數據編輯**: 可編輯表格支持實時計算和驗證
3. **多格式導出**: 支持 CSV 和 JSON 格式數據導出
4. **響應式設計**: 移動優先的自適應布局
5. **無障礙支持**: 完整的鍵盤導航和屏幕閱讀器支持

### 技術亮點
1. **Server Actions**: 使用 Next.js 14 的 Server Actions 進行服務端處理
2. **類型安全**: 完整的 TypeScript 類型定義和 Zod 驗證
3. **狀態管理**: 使用 React 18 的 useActionState 和 useTransition
4. **AI 集成**: 基於 Google Genkit 的 AI 工作流程
5. **組件化設計**: 高度可重用的 UI 組件

### 用戶體驗
1. **直觀操作**: 拖放上傳和點擊上傳雙重支持
2. **即時反饋**: 實時加載狀態和錯誤提示
3. **數據完整性**: 自動計算和驗證確保數據準確性
4. **導出便利**: 一鍵導出多種格式
5. **視覺設計**: 現代化的深色主題界面

本文檔提供了系統中每個函數的完整技術規格，為開發者提供詳盡的代碼參考和實現指南。