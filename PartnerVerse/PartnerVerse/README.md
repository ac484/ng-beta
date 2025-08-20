# PartnerVerse - Partner Management System

A comprehensive partner management system built with Next.js, TypeScript, and Firebase, featuring AI-powered workflow optimization.

## 完整函數文檔

本文檔詳細記錄了系統中每一個函數的完整信息。

---

## src/lib/utils.ts

### `cn(...inputs: ClassValue[]): string`
- **功能**: 合併和優化 CSS 類名
- **參數**: 
  - `...inputs: ClassValue[]` - 可變數量的類名值（字符串、對象、數組）
- **返回值**: `string` - 合併後的 CSS 類名字符串
- **實現**: 使用 `clsx` 和 `twMerge` 進行類名合併和 Tailwind CSS 優化
- **用途**: 條件樣式和 Tailwind CSS 類管理的工具函數

---

## src/lib/types.ts

### TypeScript 接口定義

#### `Contact` 接口
```typescript
interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}
```

#### `Transaction` 接口
```typescript
interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}
```

#### `ComplianceDocument` 接口
```typescript
interface ComplianceDocument {
  id: string;
  name: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  expiryDate: string;
  fileUrl: string;
}
```

#### `PerformanceReview` 接口
```typescript
interface PerformanceReview {
  id: string;
  date: string;
  rating: number; // 1-5
  notes: string;
  reviewer: string;
}
```

#### `Contract` 接口
```typescript
interface Contract {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Terminated';
  fileUrl: string;
}
```

#### `Partner` 接口
```typescript
interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
  category: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  status: 'Active' | 'Inactive' | 'Pending';
  overview: string;
  website: string;
  contacts: Contact[];
  transactions: Transaction[];
  joinDate: string;
  performanceReviews: PerformanceReview[];
  complianceDocuments: ComplianceDocument[];
  contracts: Contract[];
}
```

#### `WorkflowNode` 類型
```typescript
type WorkflowNode = {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision';
  label: string;
  position: { x: number; y: number };
};
```

#### `WorkflowEdge` 類型
```typescript
type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};
```

#### `Workflow` 類型
```typescript
type Workflow = {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  partnerId?: string;
};
```

---

## src/components/workflows/workflow-builder.tsx

### `WorkflowBuilder({ partners }: WorkflowBuilderProps): JSX.Element`
- **功能**: 可視化工作流程設計和管理界面
- **參數**: 
  - `partners: Partner[]` - 合作夥伴列表
- **返回值**: `JSX.Element` - 工作流程構建器組件
- **狀態管理**: 
  - `workflows` - 工作流程列表
  - `selectedWorkflow` - 當前選中的工作流程
  - `isLoading` - 加載狀態
  - `nodeToEdit` - 正在編輯的節點
  - `isNodeFormOpen` - 節點編輯表單開啟狀態

#### `fetchWorkflows(): Promise<void>`
- **功能**: 從 Firebase 獲取工作流程數據
- **參數**: 無
- **返回值**: `Promise<void>`
- **實現**: 
  - 設置加載狀態
  - 從 Firestore 'workflows' 集合獲取數據
  - 更新本地狀態
  - 自動選擇第一個工作流程

#### `handleSelectWorkflow(workflowId: string): void`
- **功能**: 切換選中的工作流程
- **參數**: 
  - `workflowId: string` - 工作流程 ID
- **返回值**: `void`
- **實現**: 根據 ID 查找並設置選中的工作流程

#### `handleUpdateWorkflowDetails(key: 'name' | 'partnerId', value: string): void`
- **功能**: 更新工作流程詳細信息
- **參數**: 
  - `key: 'name' | 'partnerId'` - 要更新的屬性鍵
  - `value: string` - 新值
- **返回值**: `void`
- **實現**: 更新選中工作流程的指定屬性

#### `handleSaveWorkflow(): Promise<void>`
- **功能**: 保存工作流程到 Firebase
- **參數**: 無
- **返回值**: `Promise<void>`
- **實現**: 
  - 驗證工作流程存在且有 ID
  - 使用 Firestore setDoc 更新數據
  - 更新本地狀態
  - 顯示成功/錯誤提示

#### `handleNewWorkflow(): Promise<void>`
- **功能**: 創建新的工作流程
- **參數**: 無
- **返回值**: `Promise<void>`
- **實現**: 
  - 創建包含默認開始和結束節點的新工作流程
  - 添加到 Firestore
  - 更新本地狀態並選中新工作流程

#### `handleSelectNodeToEdit(node: WorkflowNode): void`
- **功能**: 選擇要編輯的節點
- **參數**: 
  - `node: WorkflowNode` - 要編輯的節點
- **返回值**: `void`
- **實現**: 設置編輯節點並打開編輯表單

#### `handleUpdateNodeAndEdges(newLabel: string, newEdgeTarget: string, newEdgeLabel: string): void`
- **功能**: 更新節點標籤和邊連接
- **參數**: 
  - `newLabel: string` - 新的節點標籤
  - `newEdgeTarget: string` - 新邊的目標節點 ID
  - `newEdgeLabel: string` - 新邊的標籤
- **返回值**: `void`
- **實現**: 
  - 更新節點標籤
  - 如果指定了目標，創建新的邊連接
  - 更新工作流程狀態

#### `handleDragStart(e: React.MouseEvent, nodeId: string): void`
- **功能**: 開始拖拽節點
- **參數**: 
  - `e: React.MouseEvent` - 鼠標事件
  - `nodeId: string` - 被拖拽的節點 ID
- **返回值**: `void`
- **實現**: 
  - 計算鼠標相對於節點的偏移量
  - 存儲拖拽信息到 ref

#### `handleMouseMove(e: React.MouseEvent): void`
- **功能**: 處理拖拽過程中的鼠標移動
- **參數**: 
  - `e: React.MouseEvent` - 鼠標事件
- **返回值**: `void`
- **實現**: 
  - 計算新的節點位置
  - 更新節點在工作流程中的位置

#### `handleMouseUp(): void`
- **功能**: 結束節點拖拽
- **參數**: 無
- **返回值**: `void`
- **實現**: 清除拖拽信息

#### `handleAddNode(type: 'task' | 'decision'): void`
- **功能**: 添加新節點到工作流程
- **參數**: 
  - `type: 'task' | 'decision'` - 節點類型
- **返回值**: `void`
- **實現**: 
  - 創建新節點對象
  - 添加到當前工作流程的節點列表

#### `handleDeleteNode(): void`
- **功能**: 刪除選中的節點
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 從節點列表中移除節點
  - 移除所有相關的邊連接
  - 更新工作流程狀態

### `Node({ node, onDoubleClick, onDragStart }: NodeProps): JSX.Element`
- **功能**: 渲染單個工作流程節點
- **參數**: 
  - `node: WorkflowNode` - 節點數據
  - `onDoubleClick: (node: WorkflowNode) => void` - 雙擊回調
  - `onDragStart: (e: React.MouseEvent, nodeId: string) => void` - 拖拽開始回調
- **返回值**: `JSX.Element` - 節點組件
- **特性**: 
  - 根據節點類型顯示不同圖標
  - 支持拖拽操作
  - 懸停時顯示編輯指示器

### `Edge({ edge, nodes }: EdgeProps): JSX.Element | null`
- **功能**: 渲染節點之間的連接線
- **參數**: 
  - `edge: WorkflowEdge` - 邊數據
  - `nodes: WorkflowNode[]` - 所有節點列表
- **返回值**: `JSX.Element | null` - 邊組件或 null
- **實現**: 
  - 查找源節點和目標節點
  - 計算連接線路徑
  - 渲染 SVG 路徑和箭頭
  - 在中點顯示邊標籤

---

## src/components/workflows/optimization-assistant.tsx

### `OptimizationAssistant(): JSX.Element`
- **功能**: AI 驅動的工作流程優化助手界面
- **參數**: 無
- **返回值**: `JSX.Element` - 優化助手組件
- **狀態管理**: 
  - `formData` - 表單輸入數據
  - `loading` - AI 處理狀態
  - `result` - AI 分析結果
  - `error` - 錯誤信息

#### `handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>`
- **功能**: 處理優化請求表單提交
- **參數**: 
  - `e: React.FormEvent<HTMLFormElement>` - 表單事件
- **返回值**: `Promise<void>`
- **實現**: 
  - 阻止默認表單提交
  - 設置加載狀態
  - 調用 AI 優化函數
  - 處理結果或錯誤

#### `LoadingSkeleton(): JSX.Element`
- **功能**: 顯示 AI 處理期間的加載骨架
- **參數**: 無
- **返回值**: `JSX.Element` - 骨架加載組件
- **實現**: 渲染多個骨架卡片模擬結果布局

---

## src/components/partners/partner-profile.tsx

### `PartnerProfile({ partner, onBack, userRole, onEdit }: PartnerProfileProps): JSX.Element`
- **功能**: 顯示合作夥伴詳細信息
- **參數**: 
  - `partner: Partner` - 合作夥伴數據
  - `onBack: () => void` - 返回回調
  - `userRole: Role` - 用戶角色
  - `onEdit: (partner: Partner) => void` - 編輯回調
- **返回值**: `JSX.Element` - 合作夥伴檔案組件
- **特性**: 
  - 標籤式界面顯示不同數據部分
  - 基於角色的編輯權限控制

#### `statusBadgeVariant(status: Partner['status']): string`
- **功能**: 根據合作夥伴狀態返回徽章樣式
- **參數**: 
  - `status: Partner['status']` - 合作夥伴狀態
- **返回值**: `string` - 徽章變體名稱
- **實現**: 
  - 'Active' → 'default'
  - 'Inactive' → 'secondary'
  - 'Pending' → 'outline'

#### `transactionStatusColor(status: 'Completed' | 'Pending' | 'Failed'): string`
- **功能**: 根據交易狀態返回顏色類名
- **參數**: 
  - `status: 'Completed' | 'Pending' | 'Failed'` - 交易狀態
- **返回值**: `string` - CSS 顏色類名
- **實現**: 
  - 'Completed' → 'text-green-600'
  - 'Pending' → 'text-yellow-600'
  - 'Failed' → 'text-red-600'

### `RatingStars({ rating }: { rating: number }): JSX.Element`
- **功能**: 顯示星級評分可視化
- **參數**: 
  - `rating: number` - 評分（1-5）
- **返回值**: `JSX.Element` - 星級評分組件
- **實現**: 
  - 渲染 5 個星形圖標
  - 根據評分填充相應數量的星星

### `ComplianceStatusIcon({ status }: { status: 'Valid' | 'Expiring Soon' | 'Expired' }): JSX.Element`
- **功能**: 顯示合規文件狀態圖標
- **參數**: 
  - `status: 'Valid' | 'Expiring Soon' | 'Expired'` - 合規狀態
- **返回值**: `JSX.Element` - 狀態圖標組件
- **實現**: 
  - 'Valid' → 綠色盾牌圖標
  - 'Expiring Soon' → 黃色警告圖標
  - 'Expired' → 紅色錯誤圖標

---

## src/components/partners/partner-list.tsx

### `PartnerList({ partners, onSelectPartner, userRole, onAddPartner }: PartnerListProps): JSX.Element`
- **功能**: 顯示合作夥伴卡片網格和過濾功能
- **參數**: 
  - `partners: Partner[]` - 合作夥伴列表
  - `onSelectPartner: (partner: Partner) => void` - 選擇合作夥伴回調
  - `userRole: Role` - 用戶角色
  - `onAddPartner: () => void` - 添加合作夥伴回調
- **返回值**: `JSX.Element` - 合作夥伴列表組件
- **狀態管理**: 
  - `searchTerm` - 搜索關鍵詞
  - `statusFilter` - 狀態過濾器
  - `categoryFilter` - 類別過濾器

#### `filteredPartners: Partner[]` (useMemo)
- **功能**: 根據搜索和過濾條件計算過濾後的合作夥伴列表
- **依賴**: `[partners, searchTerm, statusFilter, categoryFilter]`
- **返回值**: `Partner[]` - 過濾後的合作夥伴數組
- **實現**: 
  - 按名稱和概述搜索
  - 按狀態過濾
  - 按類別過濾

#### `statusBadgeVariant(status: Partner['status']): string`
- **功能**: 返回狀態徽章的樣式變體
- **參數**: 
  - `status: Partner['status']` - 合作夥伴狀態
- **返回值**: `string` - 徽章變體名稱
- **實現**: 與 partner-profile 中的同名函數相同

---

## src/components/partners/partner-form.tsx

### `PartnerForm({ isOpen, onOpenChange, onSave, partner }: PartnerFormProps): JSX.Element`
- **功能**: 合作夥伴創建和編輯表單
- **參數**: 
  - `isOpen: boolean` - 對話框開啟狀態
  - `onOpenChange: (isOpen: boolean) => void` - 狀態變更回調
  - `onSave: (partner: Partner) => void` - 保存回調
  - `partner: Partner | null` - 要編輯的合作夥伴（null 表示新建）
- **返回值**: `JSX.Element` - 表單組件
- **表單驗證**: 使用 Zod schema 進行驗證

#### `partnerSchema` (Zod Schema)
- **功能**: 定義合作夥伴表單驗證規則
- **字段**: 
  - `name`: 最少 2 個字符
  - `website`: 有效 URL
  - `category`: 枚舉值
  - `status`: 枚舉值
  - `overview`: 最少 10 個字符
  - `joinDate`: 可選字符串

#### `onSubmit(data: PartnerFormValues): void`
- **功能**: 處理表單提交
- **參數**: 
  - `data: PartnerFormValues` - 表單數據
- **返回值**: `void`
- **實現**: 
  - 合併現有合作夥伴數據（編輯模式）
  - 設置默認值（新建模式）
  - 調用保存回調

---

## src/components/layout/sidebar.tsx

### `AppSidebar({ currentView, onNavigate }: AppSidebarProps): JSX.Element`
- **功能**: 應用程序導航側邊欄
- **參數**: 
  - `currentView: View` - 當前視圖
  - `onNavigate: (view: View) => void` - 導航回調
- **返回值**: `JSX.Element` - 側邊欄組件
- **特性**: 
  - 圖標式導航
  - 工具提示
  - 響應式設計

#### `navItems` (常量)
- **功能**: 定義導航項目配置
- **類型**: `readonly { view: View; icon: LucideIcon; label: string }[]`
- **項目**: 
  - Dashboard (LayoutDashboard 圖標)
  - Partners (User 圖標)
  - Workflows (Workflow 圖標)

---

## src/components/layout/header.tsx

### `Header({ userRole, onRoleChange, onAddPartner }: HeaderProps): JSX.Element`
- **功能**: 應用程序頭部，包含用戶控制項
- **參數**: 
  - `userRole: Role` - 當前用戶角色
  - `onRoleChange: (role: Role) => void` - 角色變更回調
  - `onAddPartner: () => void` - 添加合作夥伴回調
- **返回值**: `JSX.Element` - 頭部組件
- **特性**: 
  - 移動端菜單
  - 角色切換下拉菜單
  - 用戶頭像顯示

---

## src/components/icons/logo.tsx

### `Logo(props: SVGProps<SVGSVGElement>): JSX.Element`
- **功能**: 應用程序 Logo SVG 組件
- **參數**: 
  - `props: SVGProps<SVGSVGElement>` - SVG 屬性
- **返回值**: `JSX.Element` - Logo 組件
- **特性**: 
  - 可縮放矢量圖形
  - 可自定義屬性
  - 品牌標識元素

---

## src/components/dashboard/dashboard.tsx

### `Dashboard({ partners, onViewPartners }: DashboardProps): JSX.Element`
- **功能**: 主儀表板，顯示合作夥伴分析和概覽
- **參數**: 
  - `partners: Partner[]` - 合作夥伴列表
  - `onViewPartners: () => void` - 查看合作夥伴回調
- **返回值**: `JSX.Element` - 儀表板組件
- **特性**: 
  - 統計卡片
  - 合作夥伴分佈圖表
  - 最近活動列表

#### 計算的指標:
- `totalPartners: number` - 總合作夥伴數
- `activePartners: number` - 活躍合作夥伴數
- `inactivePartners: number` - 非活躍合作夥伴數
- `pendingPartners: number` - 待審核合作夥伴數
- `categoryData: { name: string; total: number }[]` - 按類別分組的數據
- `totalTransactions: number` - 總交易數

---

## src/app/page.tsx

### `HomePage(): JSX.Element`
- **功能**: 主應用程序組件，管理所有視圖和狀態
- **參數**: 無
- **返回值**: `JSX.Element` - 主頁組件
- **狀態管理**: 
  - `view: View` - 當前視圖
  - `partners: Partner[]` - 合作夥伴列表
  - `selectedPartner: Partner | null` - 選中的合作夥伴
  - `isFormOpen: boolean` - 表單開啟狀態
  - `partnerToEdit: Partner | null` - 要編輯的合作夥伴
  - `userRole: Role` - 用戶角色
  - `isLoading: boolean` - 加載狀態

#### `fetchPartners(): Promise<void>` (useEffect)
- **功能**: 從 Firebase 加載合作夥伴數據
- **參數**: 無
- **返回值**: `Promise<void>`
- **實現**: 
  - 設置加載狀態
  - 從 Firestore 'partners' 集合獲取數據
  - 更新本地狀態

#### `handleSelectPartner(partner: Partner): void`
- **功能**: 設置選中的合作夥伴進行詳細查看
- **參數**: 
  - `partner: Partner` - 要選中的合作夥伴
- **返回值**: `void`
- **實現**: 更新 selectedPartner 狀態

#### `handleBackToList(): void`
- **功能**: 從詳細視圖返回到合作夥伴列表
- **參數**: 無
- **返回值**: `void`
- **實現**: 將 selectedPartner 設為 null

#### `handleAddPartner(): void`
- **功能**: 打開合作夥伴創建表單
- **參數**: 無
- **返回值**: `void`
- **實現**: 
  - 清除 partnerToEdit
  - 打開表單

#### `handleEditPartner(partner: Partner): void`
- **功能**: 打開合作夥伴編輯表單
- **參數**: 
  - `partner: Partner` - 要編輯的合作夥伴
- **返回值**: `void`
- **實現**: 
  - 設置 partnerToEdit
  - 打開表單

#### `handleSavePartner(partnerToSave: Omit<Partner, 'id'>): Promise<void>`
- **功能**: 保存合作夥伴數據到 Firebase
- **參數**: 
  - `partnerToSave: Omit<Partner, 'id'>` - 要保存的合作夥伴數據
- **返回值**: `Promise<void>`
- **實現**: 
  - 判斷是更新還是創建
  - 使用 Firestore API 保存數據
  - 更新本地狀態
  - 顯示成功/錯誤提示

#### `handleNavigate(newView: View): void`
- **功能**: 在主應用程序視圖之間切換
- **參數**: 
  - `newView: View` - 要切換到的視圖
- **返回值**: `void`
- **實現**: 
  - 更新視圖狀態
  - 清除選中的合作夥伴

#### `renderView(): JSX.Element`
- **功能**: 根據當前視圖和狀態進行條件渲染
- **參數**: 無
- **返回值**: `JSX.Element` - 當前視圖組件
- **實現**: 
  - 處理加載狀態
  - 處理選中合作夥伴的詳細視圖
  - 根據視圖類型渲染相應組件

---

## src/app/layout.tsx

### `RootLayout({ children }: { children: React.ReactNode }): JSX.Element`
- **功能**: 根應用程序布局，包含全局樣式和元數據
- **參數**: 
  - `children: React.ReactNode` - 子組件
- **返回值**: `JSX.Element` - 根布局組件
- **特性**: 
  - 字體加載
  - 全局 CSS
  - Toast 通知

#### `metadata: Metadata` (導出常量)
- **功能**: 應用程序元數據配置
- **屬性**: 
  - `title: 'Firebase Studio App'`
  - `description: 'Generated by Firebase Studio'`

---

## src/ai/genkit.ts

### `ai` (導出常量)
- **功能**: 配置並導出 Genkit AI 實例
- **類型**: Genkit 實例
- **配置**: 
  - 插件: Google AI
  - 模型: 'googleai/gemini-2.0-flash'
- **用途**: 所有 AI 驅動功能的基礎配置

---

## src/ai/dev.ts

### 開發配置文件
- **功能**: 開發環境配置
- **操作**: 
  - 使用 dotenv 加載環境變量
  - 導入工作流程優化流程

---

## src/ai/flows/workflow-optimization.ts

### `suggestWorkflowOptimizations(input: SuggestWorkflowOptimizationsInput): Promise<SuggestWorkflowOptimizationsOutput>`
- **功能**: AI 驅動的工作流程優化建議
- **參數**: 
  - `input: SuggestWorkflowOptimizationsInput` - 輸入數據
    - `historicalTransactionData: string` - 歷史交易數據
    - `currentWorkflowDefinition: string` - 當前工作流程定義
- **返回值**: `Promise<SuggestWorkflowOptimizationsOutput>` - 優化建議結果
  - `suggestedOptimizations: string` - 建議的優化措施
  - `predictedEfficiencyIncrease: string` - 預測的效率提升百分比
  - `rationale: string` - 每個建議優化的詳細理由
- **實現**: 調用 suggestWorkflowOptimizationsFlow

#### `SuggestWorkflowOptimizationsInputSchema` (Zod Schema)
- **功能**: 定義輸入數據驗證規則
- **字段**: 
  - `historicalTransactionData`: 歷史交易數據描述
  - `currentWorkflowDefinition`: 當前工作流程定義描述

#### `SuggestWorkflowOptimizationsOutputSchema` (Zod Schema)
- **功能**: 定義輸出數據結構
- **字段**: 
  - `suggestedOptimizations`: 建議的優化措施
  - `predictedEfficiencyIncrease`: 預測效率提升
  - `rationale`: 優化理由

#### `prompt` (AI Prompt 定義)
- **功能**: 定義 AI 提示模板
- **名稱**: 'suggestWorkflowOptimizationsPrompt'
- **輸入模式**: SuggestWorkflowOptimizationsInputSchema
- **輸出模式**: SuggestWorkflowOptimizationsOutputSchema
- **提示內容**: 分析歷史數據和當前工作流程，提供優化建議

#### `suggestWorkflowOptimizationsFlow` (AI Flow 定義)
- **功能**: 定義 AI 處理流程
- **名稱**: 'suggestWorkflowOptimizationsFlow'
- **輸入模式**: SuggestWorkflowOptimizationsInputSchema
- **輸出模式**: SuggestWorkflowOptimizationsOutputSchema
- **實現**: 調用 prompt 並返回結果

---

## 類型定義

### `View` 類型
```typescript
type View = 'dashboard' | 'partners' | 'workflows';
```

### `Role` 類型
```typescript
type Role = 'Admin' | 'Manager' | 'Viewer';
```

### 組件 Props 接口

#### `WorkflowBuilderProps`
```typescript
interface WorkflowBuilderProps {
  partners: Partner[];
}
```

#### `PartnerProfileProps`
```typescript
interface PartnerProfileProps {
  partner: Partner;
  onBack: () => void;
  userRole: Role;
  onEdit: (partner: Partner) => void;
}
```

#### `PartnerListProps`
```typescript
interface PartnerListProps {
  partners: Partner[];
  onSelectPartner: (partner: Partner) => void;
  userRole: Role;
  onAddPartner: () => void;
}
```

#### `PartnerFormProps`
```typescript
interface PartnerFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (partner: Partner) => void;
  partner: Partner | null;
}
```

#### `AppSidebarProps`
```typescript
interface AppSidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}
```

#### `HeaderProps`
```typescript
interface HeaderProps {
  userRole: Role;
  onRoleChange: (role: Role) => void;
  onAddPartner: () => void;
}
```

#### `DashboardProps`
```typescript
interface DashboardProps {
  partners: Partner[];
  onViewPartners: () => void;
}
```

---

## 總結

本文檔詳細記錄了 PartnerVerse 系統中的每一個函數、組件和類型定義。系統提供了完整的合作夥伴管理解決方案，包括：

- **數據管理**: Firebase 集成的實時數據同步
- **工作流程管理**: 可視化工作流程設計器
- **AI 優化**: 基於歷史數據的智能優化建議
- **角色權限**: 基於角色的訪問控制
- **響應式設計**: 移動優先的自適應布局
- **數據可視化**: 合作夥伴分佈圖表和性能指標

每個函數都經過詳細文檔化，包括其目的、參數、返回值和實現細節，為開發者提供完整的代碼參考。