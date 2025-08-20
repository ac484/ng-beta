## Project & Contract Demo NextJS 專案解析

本文件對 `Project & Contract Demo NextJS/` 的架構、頁面路由、資料流、狀態管理、AI 功能、合約模組、視覺化與 UI 元件，以及執行與擴充建議進行完整說明，便於快速理解與後續維護擴展。

### 技術棧與關鍵依賴
- **框架**: Next.js App Router（`app/` 目錄）
- **型別**: TypeScript（全專案）
- **UI 元件**: 自建 `components/ui/*`（風格類似 shadcn/ui）
- **圖表**: `recharts`（餅圖展示進度）
- **日期處理**: `date-fns`（格式化/差異計算）
- **狀態管理**: React Context（`ProjectContext`）
- **資料來源**: Firebase Firestore（即時訂閱 `onSnapshot`）
- **AI 能力**: Genkit + GoogleAI（`@genkit-ai/googleai`，模型 `googleai/gemini-2.0-flash`）

### 目錄結構（重點）
- `app/`
  - `layout.tsx`: 全域 RootLayout（字體、`<Toaster/>`）
  - `page.tsx`: 首頁導向 `/dashboard`
  - `(app)/layout.tsx`: 應用層 Layout，掛載 `ProjectProvider` 與 `AppSidebar`
  - `(app)/dashboard/page.tsx`: 儀表板
  - `(app)/projects/page.tsx`: 專案清單
  - `(app)/projects/[id]/page.tsx`: 專案詳情（任務樹編輯）
  - `(app)/construct/page.tsx`: 合約總覽頁
- `components/`
  - `app/*`: 應用相關複合元件（側邊欄、專案圖表、AI 子任務建議、建立專案對話框、任務項）
  - `contract/*`: 合約儀表元件（列表、明細 Sheet、AI 摘要對話框、Logo、統計卡）
  - `ui/*`: 基礎 UI 原子元件（Button、Card、Dialog、Select、Table、Tabs、Tooltip、Sheet、Progress 等）
- `context/ProjectContext.tsx`: 全域專案資料/操作（Firestore 訂閱、CRUD API）
- `lib/`
  - `firebase.ts`: Firebase 初始化與 Firestore 客戶端
  - `types.ts`: 專案/任務型別定義
  - `data.ts`: 合約假資料（`construct` 模組使用）
- `ai/`
  - `genkit.ts`: Genkit 啟用與模型設定
  - `flows/generate-subtasks-flow.ts`: 生成子任務（Server Action / Flow）
  - `flows/summarize-contract.ts`: 合約摘要（Server Action / Flow）
  - `dev.ts`: 匯入 flows 供開發環境載入
- `types/index.ts`: 合約領域型別（Contract、Payment、ChangeOrder 等）

## 詳細函數與功能說明

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\(app)\construct\page.tsx
**函數**: `Home()`
**功能**: 合約總覽頁面。基於靜態 contracts 數據計算統計指標；顯示 DashboardStats、ContractsTable；提供 AI 合約摘要對話框與"New Contract"按鈕。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\(app)\dashboard\page.tsx
**函數**: `DashboardPage()`
**功能**: 儀表板頁面。依 ProjectContext 的 projects 計算：總專案數、總任務數、已完成任務數、30天內到期專案清單；使用 ProjectProgressChart 以專案為單位繪製餅圖與完成度；含載入 skeleton 狀態。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\(app)\projects\[id]\page.tsx
**函數**: `ProjectDetailPage()`
**功能**: 專案詳情頁面。顯示專案基本資訊與「剩餘可分配價值」；任務樹可展開/收合，支援變更狀態、加入子任務與 AI 子任務建議；新增任務時檢查不可超出剩餘可分配價值；含 calculateRemainingValue 輔助函數。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\(app)\projects\page.tsx
**函數**: `ProjectsPage()`
**功能**: 專案清單頁面。清單卡片式呈現每個專案，顯示專案描述、日期、整體進度（以「已完成葉節點任務 value / 專案 value」計算）；右上提供 CreateProjectDialog 建立專案；含 calculateProgress 輔助函數與載入/空態處理。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\(app)\layout.tsx
**函數**: `AppLayout({ children })`
**功能**: 應用內布局組件。掛載 ProjectProvider、SidebarProvider、AppSidebar，統一內容區邊距；為 dashboard/projects/construct 提供共用 Layout。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\layout.tsx
**函數**: `RootLayout({ children })`
**功能**: 全域根布局組件。引入 Inter 字體、全域樣式、Toaster 通知組件；設定 HTML 語言與 metadata。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\app\page.tsx
**函數**: `RootPage()`
**功能**: 根頁面組件。直接重定向到 `/dashboard` 路由。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\app\ai-subtask-suggestions.tsx
**函數**: `AISubtaskSuggestions({ projectTitle, taskTitle, onAddSubtask, onClose })`
**功能**: AI 子任務建議組件。調用 generateSubtasks Flow 取得 3-5 個子任務建議；支援一鍵加入建議（onAddSubtask）、關閉面板；內建載入/錯誤狀態與 toast 提示。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\app\create-project-dialog.tsx
**函數**: `CreateProjectDialog()`
**功能**: 新建專案對話框組件。zod 表單校驗（標題/描述/總價值/起止日期），提交時調用 useProjects.addProject 並 toast 提示；含表單重置與驗證邏輯。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\app\project-progress-chart.tsx
**函數**: `ProjectProgressChart({ project })`
**功能**: 專案進度圖表組件。以 recharts 餅圖展示項目價值完成度；內部 calculateValueProgress 只統計葉節點任務的 value，計算 Completed/In Progress/Pending 與完成百分比；含客戶端渲染檢查。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\app\sidebar.tsx
**函數**: `AppSidebar()`
**功能**: 左側導航欄組件。與 pathname 同步高亮，提供 Dashboard/Projects/Contracts 路由入口；集成自定義 Sidebar 組件體系；含路由狀態管理。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\app\task-item.tsx
**函數**: `TaskItem({ task, projectId })`
**功能**: 單個任務行組件（可展開顯示子任務）。可切換任務狀態、添加子任務（數量/單價→value 計算）、AI 子任務建議；限制子任務 value 不得超過父任務剩餘可分配 value；遞歸渲染子任務 TaskItem；含 calculateRemainingValue 輔助函數。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\contract\ai-summarizer-dialog.tsx
**函數**: `AiSummarizerDialog()`
**功能**: 合約 AI 摘要對話框組件。上傳文件→FileReader 轉 data URI→調用 summarizeContract Flow→顯示 summary；內建載入/錯誤/重置流程與 toast；支援多種文件格式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\contract\contract-details-sheet.tsx
**函數**: `ContractDetailsSheet({ contract, isOpen, onOpenChange })`
**功能**: 合約詳情抽屜組件，含 Tabs：Details（基本信息/範圍）、Payments（進度條+表格）、Changes（變更單）、History（版本時間軸）。根據狀態顯示不同 Badge 樣式；含 getStatusVariant 輔助函數。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\contract\contracts-table.tsx
**函數**: `ContractsTable({ contracts })`
**功能**: 合約總覽表格組件。點擊行打開詳情抽屜；支持導出 CSV；根據合約狀態顯示 Badge；保留所選合約狀態；含 handleExport、handleViewDetails 等事件處理函數。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\contract\dashboard-stats.tsx
**函數**: `DashboardStats({ stats })`
**功能**: 合約統計卡組件。顯示總數/進行中/已完成/總價值，含緊湊數值顯示；基於傳入的 stats 對象渲染四個統計卡片。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\contract\logo.tsx
**函數**: `Logo()`
**功能**: 頂部品牌鏈接組件（帶圖標）返回首頁；SVG 圖標與品牌名稱組合。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\context\ProjectContext.tsx
**函數**: `ProjectProvider({ children })`, `useProjects()`
**功能**: 全局專案數據源與操作 Context。onSnapshot 訂閱 Firestore `projects`；提供 findProject、addProject、updateTaskStatus（遞歸更新 + lastUpdated）、addTask（遞歸新增，限制 value 分配）等；含 processFirestoreProjects、processFirestoreTasks 數據轉換函數。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\types\index.ts
**函數**: 型別定義
**功能**: 合約領域型別定義。包含 ContractStatus、Payment、ChangeOrder、ContractVersion、Contract 等接口；為合約模組提供完整的型別支持。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\lib\utils.ts
**函數**: `cn(...inputs: ClassValue[])`, `formatDate(date: Date | string): string`
**功能**: 工具函數庫。cn 函數合併 Tailwind 類名；formatDate 函數格式化日期為 YYYY-MM-DD 格式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\lib\types.ts
**函數**: 型別定義
**功能**: 專案/任務領域型別定義。包含 TaskStatus、Task、Project 接口；任務含數量、單價與 value（quantity*unitPrice）計算邏輯。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\lib\firebase.ts
**函數**: 初始化與導出
**功能**: Firebase 初始化與 Firestore 客戶端配置。初始化 Firebase 應用與 Firestore 數據庫連接；導出 app 與 db 實例供其他模組使用。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\lib\data.ts
**函數**: 數據導出
**功能**: 演示用靜態合約數據。導出 contracts: Contract[] 數組，包含完整的合約信息、付款記錄、變更單、版本歷史等測試數據。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\hooks\use-toast.ts
**函數**: `useToast()`, `toast()`, `reducer`, action types
**功能**: 輕量 toast 通知系統。基於內存狀態與訂閱機制；支持新增、更新、關閉、移除 toast；限制並發顯示數量；含完整的狀態管理邏輯。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\hooks\use-mobile.tsx
**函數**: `useIsMobile()`
**功能**: 移動端斷點檢測 Hook。偵測視窗寬度 < 768px 的移動端狀態；使用 matchMedia API 與 React 狀態管理；支持視窗大小變化監聽。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\ai\flows\generate-subtasks-flow.ts
**函數**: `generateSubtasks(input: GenerateSubtasksInput): Promise<GenerateSubtasksOutput>`, `generateSubtasksFlow(input)`, `prompt(input)`
**功能**: AI 子任務生成 Flow。Zod 定義輸入/輸出結構，Prompt 要求輸出 3-5 個可執行子任務標題；使用 Genkit 的 definePrompt 和 defineFlow 建立 AI 流程。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\ai\flows\summarize-contract.ts
**函數**: `summarizeContract(input: SummarizeContractInput): Promise<SummarizeContractOutput>`, `summarizeContractFlow(input)`, `summarizeContractPrompt(input)`
**功能**: AI 合約摘要 Flow。輸入資料為 Data URI 的檔案，Prompt 使用 `{{media url=...}}` 形式注入；回傳 summary 字串；使用 Genkit 的 definePrompt 和 defineFlow。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\ai\genkit.ts
**函數**: 配置導出
**功能**: Genkit AI 配置。使用 genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.0-flash' }) 初始化；導出 ai 實例供 flows 使用。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\ai\dev.ts
**函數**: 側效應導入
**功能**: 開發環境 Flow 載入。導入所有 AI flows 供開發環境使用；確保 Server Actions 正確註冊。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\button.tsx
**函數**: `Button`, `buttonVariants`
**功能**: 按鈕組件。支持多種 variant（default, destructive, outline, secondary, ghost, link）和 size（default, sm, lg, icon）；使用 class-variance-authority 管理樣式變體；支持 asChild 模式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\sidebar.tsx
**函數**: `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarFooter`, `SidebarInput`, `SidebarSeparator`, `SidebarRail`, `SidebarTrigger`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarGroupAction`, `useSidebar`
**功能**: 完整的側邊欄組件系統。支持響應式、可折疊、鍵盤快捷鍵（Cmd/Ctrl+B）、移動端適配、狀態持久化（cookie）、工具提示等；使用 Context 管理狀態。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\toast.tsx
**函數**: `ToastProvider`, `ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastAction`, `toastVariants`
**功能**: Toast 通知組件系統。基於 Radix UI 的 Toast 原語；支持多種 variant（default, destructive）；支持滑動手勢、動畫、響應式佈局；導出 ToastProps 和 ToastActionElement 型別。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\toaster.tsx
**函數**: `Toaster`
**功能**: Toast 容器組件。整合 ToastProvider 和 ToastViewport；提供統一的 toast 顯示容器；自動渲染所有活躍的 toast 通知。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\card.tsx
**函數**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
**功能**: 卡片組件系統。提供結構化的內容容器；支持標題、描述、內容、頁腳等區域。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\input.tsx
**函數**: `Input`
**功能**: 輸入框組件。基於 HTML input 元素；支持所有標準 input 屬性；使用 cn 工具函數合併樣式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\label.tsx
**函數**: `Label`
**功能**: 標籤組件。基於 Radix UI 的 Label 原語；支持 for 屬性關聯表單控件。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\select.tsx
**函數**: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`
**功能**: 選擇器組件系統。基於 Radix UI 的 Select 原語；支持分組、標籤、分隔符等；支持鍵盤導航。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\form.tsx
**函數**: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`
**功能**: 表單組件系統。基於 React Hook Form；支持字段驗證、錯誤顯示、描述文本等；使用 useFormField hook 管理表單狀態。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\popover.tsx
**函數**: `Popover`, `PopoverTrigger`, `PopoverContent`
**功能**: 彈出層組件。基於 Radix UI 的 Popover 原語；支持觸發器、內容區域；自動定位和箭頭顯示。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\accordion.tsx
**函數**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
**功能**: 手風琴組件系統。基於 Radix UI 的 Accordion 原語；支持展開/收合狀態；動畫過渡效果；支持自定義樣式和內容。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\calendar.tsx
**函數**: `Calendar`
**功能**: 日曆組件。基於 react-day-picker；支持日期選擇、範圍選擇、禁用日期等；與表單系統集成；支持自定義樣式和導航按鈕。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\chart.tsx
**函數**: `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`, `useChart`
**功能**: 圖表組件系統。基於 Recharts；支持多種圖表類型；響應式設計；可自定義樣式；支持主題切換；提供 ChartContext 和 useChart hook。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\textarea.tsx
**函數**: `Textarea`
**功能**: 多行文本輸入組件。基於 HTML textarea 元素；支持調整大小、自動增長等。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\badge.tsx
**函數**: `Badge`, `badgeVariants`
**功能**: 徽章組件。支持多種 variant（default, secondary, destructive, outline）；使用 class-variance-authority 管理樣式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\progress.tsx
**函數**: `Progress`
**功能**: 進度條組件。基於 Radix UI 的 Progress 原語；支持數值進度顯示；可自定義樣式和動畫。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\table.tsx
**函數**: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`
**功能**: 表格組件系統。基於 HTML table 元素；支持標題、頁腳、說明等；響應式設計。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\tabs.tsx
**函數**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
**功能**: 標籤頁組件系統。基於 Radix UI 的 Tabs 原語；支持鍵盤導航、自動激活等。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\sheet.tsx
**函數**: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`
**功能**: 側邊抽屜組件系統。基於 Radix UI 的 Dialog 原語；支持多個方向（top, right, bottom, left）；響應式設計。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\dialog.tsx
**函數**: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
**功能**: 對話框組件系統。基於 Radix UI 的 Dialog 原語；支持標題、描述、頁腳等；可訪問性支持。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\collapsible.tsx
**函數**: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
**功能**: 可折疊組件系統。基於 Radix UI 的 Collapsible 原語；支持展開/收合狀態；動畫過渡。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\dropdown-menu.tsx
**函數**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuRadioGroup`
**功能**: 下拉菜單組件系統。基於 Radix UI 的 DropdownMenu 原語；支持複選框、單選框、子菜單、快捷鍵等。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\checkbox.tsx
**函數**: `Checkbox`
**功能**: 複選框組件。基於 Radix UI 的 Checkbox 原語；支持受控和非受控狀態；可訪問性支持。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\radio-group.tsx
**函數**: `RadioGroup`, `RadioGroupItem`
**功能**: 單選框組件系統。基於 Radix UI 的 RadioGroup 原語；支持分組和單個選項；鍵盤導航支持。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\switch.tsx
**函數**: `Switch`
**功能**: 開關組件。基於 Radix UI 的 Switch 原語；支持受控和非受控狀態；動畫過渡。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\slider.tsx
**函數**: `Slider`
**功能**: 滑塊組件。基於 Radix UI 的 Slider 原語；支持單值和範圍選擇；鍵盤和滑鼠操作。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\separator.tsx
**函數**: `Separator`
**功能**: 分隔線組件。基於 Radix UI 的 Separator 原語；支持水平和垂直方向；可自定義樣式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\scroll-area.tsx
**函數**: `ScrollArea`, `ScrollBar`
**功能**: 滾動區域組件系統。基於 Radix UI 的 ScrollArea 原語；自定義滾動條樣式；支持水平和垂直滾動。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\skeleton.tsx
**函數**: `Skeleton`
**功能**: 骨架屏組件。用於載入狀態的佔位符；可自定義寬度和高度。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\alert.tsx
**函數**: `Alert`, `AlertTitle`, `AlertDescription`
**功能**: 警告組件系統。支持標題和描述；可自定義樣式和圖標。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\alert-dialog.tsx
**函數**: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`
**功能**: 警告對話框組件系統。基於 Radix UI 的 AlertDialog 原語；用於確認操作；支持多個操作按鈕。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\avatar.tsx
**函數**: `Avatar`, `AvatarImage`, `AvatarFallback`
**功能**: 頭像組件系統。支持圖片和後備內容；圓形設計；響應式圖片載入。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\carousel.tsx
**函數**: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`
**功能**: 輪播組件系統。基於 Embla Carousel；支持自動播放、導航按鈕、觸摸手勢等。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\chart.tsx
**函數**: `Chart`, `ChartContainer`, `ChartTooltip`, `ChartLegend`, `ChartAxis`, `ChartGrid`, `ChartBar`, `ChartLine`, `ChartArea`, `ChartPie`
**功能**: 圖表組件系統。基於 Recharts；支持多種圖表類型；響應式設計；可自定義樣式。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\menubar.tsx
**函數**: `Menubar`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`, `MenubarGroup`, `MenubarPortal`, `MenubarSub`, `MenubarSubContent`, `MenubarSubTrigger`, `MenubarRadioGroup`
**功能**: 菜單欄組件系統。基於 Radix UI 的 Menubar 原語；支持複選框、單選框、子菜單、快捷鍵等；類似桌面應用菜單。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\popover.tsx
**函數**: `Popover`, `PopoverTrigger`, `PopoverContent`
**功能**: 彈出層組件。基於 Radix UI 的 Popover 原語；支持觸發器、內容區域；自動定位和箭頭顯示。

### D:\GitHub\ng-ac\Project & Contract Demo NextJS\components\ui\tooltip.tsx
**函數**: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
**功能**: 工具提示組件系統。基於 Radix UI 的 Tooltip 原語；支持延遲顯示、位置控制等；支持動畫和樣式自定義。

## 路由與頁面
- **`app/page.tsx`**: 直接 `redirect('/dashboard')`。
- **`app/(app)/layout.tsx`**: 為 `dashboard`/`projects`/`construct` 提供共用 Layout：
  - 外層 `ProjectProvider` 提供專案資料與操作 API。
  - `SidebarProvider` + `AppSidebar` 建立側邊導覽。
  - 主要內容區包裹 `SidebarInset`，內層統一 padding。
- **Dashboard（`/dashboard`）**
  - 依 `ProjectContext` 的 `projects` 計算：總專案數、總任務數、已完成任務數、30 天內到期專案清單。
  - 使用 `ProjectProgressChart` 以專案為單位繪製餅圖與完成度。
- **Projects（`/projects`）**
  - 清單卡片式呈現每個專案，顯示專案描述、日期、整體進度（以「已完成葉節點任務 value / 專案 value」計算）
  - 右上提供 `CreateProjectDialog` 建立專案（zod 表單校驗）。
- **Project Detail（`/projects/[id]`）**
  - 顯示專案基本資訊與「剩餘可分配價值」。
  - 任務樹可展開/收合，支援變更狀態、加入子任務與 AI 子任務建議。
  - 新增任務時檢查不可超出剩餘可分配價值。
- **Construct（`/construct`）**
  - 展示合約統計卡（總數、進行中、已完成、總價值）。
  - `ContractsTable` 顯示合約列表，支援 CSV 匯出與明細 Sheet。
  - `AiSummarizerDialog` 上傳檔案（pdf/doc/docx）→ 以 Data URI 丟給 AI 進行條款摘要。

## 狀態管理與資料流（ProjectContext）
- **即時訂閱**: `onSnapshot(collection(db, 'projects'))` → 將 Firestore 文件轉換為 `Project` 物件（日期欄轉為 `Date`、遞迴處理 `tasks`）。
- **API**:
  - `findProject(id)`: 由記憶體陣列查找。
  - `addProject(project)`: 建立新文件，初始 `tasks = []`。
  - `updateTaskStatus(projectId, taskId, status)`: 遞迴找到目標任務更新 `status` 與 `lastUpdated`，以 `writeBatch` 更新 `tasks` 陣列。
  - `addTask(projectId, parentTaskId, title, quantity, unitPrice)`: 依 parent 決定加入專案 root 或子任務陣列；`value = quantity * unitPrice`。

### 資料模型（`lib/types.ts`）
- **Task**: `{ id, title, status, lastUpdated, subTasks[], value, quantity, unitPrice }`
- **Project**: `{ id, title, description, startDate, endDate, tasks[], value }`
  - 專案層的 `value` 為「可分配的總價值」，用於控制任務的價值分配上限。

## 業務邏輯重點
- **價值分配機制**
  - 新增專案任務（或子任務）時，會先計算「剩餘可分配價值」，禁止超額。
  - 專案剩餘值：`project.value - sum(project.tasks[].value)`（遞迴加總）。
  - 子任務剩餘值：`parentTask.value - sum(parentTask.subTasks[].value)`。
- **進度計算（僅計葉節點）**
  - 為避免重複計算，進度統計只累計沒有子任務的任務（葉節點）的 `value`：
    - Completed / In Progress / Pending 依 `status` 累加。
    - 儀表板合計的完成百分比與圖表皆以葉節點 `value` 佔專案 `total value` 計算。
- **Dashboard 指標**
  - 總專案數、總任務數（遞迴計數）、已完成任務數（遞迴過濾）、30 天內到期專案清單（`differenceInDays`）。
- **Projects 清單進度條**
  - 計算所有葉節點中 `status === 'Completed'` 的 `value` 之和，除以專案 `value` 得到百分比。
- **Project Detail 操作**
  - 新增任務表單（標題、數量、單價）即時計算 `value` 顯示。
  - 任務列提供狀態切換、AI 建議、新增子任務、最後更新時間提示。
  - 子任務表單具體到量與單價，並顯示「剩餘值」。

## 合約模組（Construct）
- **資料來源**: `lib/data.ts` 提供靜態 `Contract[]` 測試資料（含 Payments、ChangeOrders、Versions）。
- **ContractsTable**
  - 表格清單支援點擊列開啟明細；功能選單提供「View Details」。
  - 一鍵匯出 CSV（客戶端建立 Blob 下載）。
  - `Badge` 顏色依合約狀態變化。
- **ContractDetailsSheet**（Sheet + Tabs）
  - Details：基本資訊、總價值、狀態、工作範圍。
  - Payments：付款進度條（已付/總額）、付款紀錄表格，`Badge` 顯示狀態。
  - Changes：變更單列表，顯示日期、狀態、成本影響。
  - History：版本時間軸（版本號、日期、摘要）。
- **AI 合約摘要**
  - `AiSummarizerDialog` 上傳檔案 → FileReader 轉 Data URI → 呼叫 `summarizeContract` Flow → 回填摘要文字。

## AI 功能（Genkit + GoogleAI）
- **配置**: `ai/genkit.ts` 使用 `genkit({ plugins: [googleAI()], model: 'googleai/gemini-2.0-flash' })`。
- **子任務生成 Flow**: `ai/flows/generate-subtasks-flow.ts`
  - Zod 定義輸入/輸出結構，Prompt 要求輸出 3~5 個可執行子任務標題。
  - `AISubtaskSuggestions` 客戶端元件在任務行中呼叫，回傳建議清單，支援一鍵加入子任務並 Toast 提示。
- **合約摘要 Flow**: `ai/flows/summarize-contract.ts`
  - 輸入資料為 Data URI 的檔案，Prompt 使用 `{{media url=...}}` 形式注入。
  - 回傳 `summary` 字串，於對話框中展示。

## UI 與視覺化
- `AppSidebar` 負責側邊導覽與路由高亮；`SidebarProvider/SidebarInset` 管理 Layout 與切換。
- `ProjectProgressChart` 以 `recharts` PieChart 呈現完成度，中心顯示百分比，側邊列出圖例與金額。

## 執行與環境（Windows 11 + pnpm）
> 下列指令需在 `Project & Contract Demo NextJS/` 目錄中執行。

- **安裝**: `pnpm install`
- **開發**: `pnpm dev`（預設 `next dev`）
- **注意事項**:
  - Firebase 設定寫於 `lib/firebase.ts`，目前為硬編碼 demo 專案設定；若切換專案，請更新對應 `firebaseConfig`。
  - Genkit/GoogleAI 需設定 Google 生成式 AI API Key 的環境變數（依套件要求，常見為 `GOOGLE_GENAI_API_KEY` 或相容名稱）。
  - 若使用 AI 流程於本機，請確認 Node 版本與網路權限、以及 Next.js Server Action 可用。

## 安全、效能與擴展建議
- **安全**
  - Firebase client config 屬公開資訊，但請避免把管理金鑰等敏感內容放入前端。
  - 若導入真正的合約檔案上傳與儲存，務必加入驗證/授權與檔案掃描。
- **資料一致性**
  - 目前以整個 `tasks` 陣列覆寫方式更新，長期建議演進為更顆粒度的資料結構（如以文件/子集合儲存任務），降低併發衝突與 payload。
- **商業規則**
  - 葉節點統計可避免重複計算，但在多層級匯總時需一致性校驗（例如父任務 `value` 應等於子任務加總，不可手動偏離）。
  - 可加入「自動調整父任務 value」或「禁止修改父任務 value」等策略。
- **效能**
  - 專案/任務多時，建議虛擬清單或分頁；AI 建議可做快取。
- **可觀測性**
  - 加入日誌與使用者操作追蹤，便於審計與問題排查。

## 可落地的後續工作項
- **任務資料庫結構升級**：以單獨集合儲存任務與父子關係（避免大欄位覆寫）。
- **權限與多使用者**：加入 Auth 與 Role-Based Access（專案層/合約層權限）。
- **更完整的合約 CRUD**：目前合約為假資料，可串接後端或 Firestore 集合，補齊建立/編輯/版本控管流程。
- **AI 提示工程**：加入系統/範例/限制輸出格式，提升子任務建議與合約摘要品質與穩定性。
- **測試**：針對 `ProjectContext` 的遞迴邏輯、金額限制、進度計算撰寫單元測試；端到端測試覆蓋主要流程。

---
以上為 `Project & Contract Demo NextJS/` 的完整邏輯與功能說明，覆蓋關鍵檔案與核心流程，供開發維護與後續擴展參考。


