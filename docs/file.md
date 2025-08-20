# Next.js 15 專案架構檔案功能詳解

## 專案根目錄配置文件

### 開發工具配置
```
.cursor/                          # Cursor IDE 配置目錄
├── .cursorrules                  # Cursor AI 輔助開發規則設定
├── context7.mdc                  # 專案上下文描述文件
└── mcp.json                      # Model Context Protocol 配置

.vscode/                          # Visual Studio Code 配置
└── launch.json                   # 偵錯啟動配置 (支援 Next.js 開發模式)
```

### CI/CD 與版本控制
```
.github/                          # GitHub Actions 工作流程
├── workflows/
│   ├── ci.yml                    # 持續整合：程式碼檢查、測試執行
│   ├── deploy.yml                # 自動部署到 Vercel/Firebase Hosting
│   └── test.yml                  # 自動化測試流程 (Jest + Cypress)
└── FUNDING.yml                   # 開源專案贊助資訊

.husky/                           # Git 鉤子管理 (程式碼提交前檢查)
├── pre-commit                    # 提交前：執行 lint、格式化、型別檢查
└── pre-push                      # 推送前：執行完整測試套件
```

### 專案文件與靜態資源
```
docs/                             # 專案技術文件
├── modern-integration-plan.md    # 現代化整合實施計畫
├── integrated-file-structure.md # 完整檔案結構說明
├── api-documentation.md         # API 端點文件與使用範例
├── deployment-guide.md          # 部署指南與環境設定
└── user-guide.md                # 終端使用者操作手冊

public/                           # Next.js 靜態資源目錄
├── assets/                       # 多媒體資源分類管理
│   ├── images/                   # 圖片資源 (支援 Next.js Image 優化)
│   ├── icons/                    # 圖示檔案 (SVG/PNG 格式)
│   └── logos/                    # 品牌標誌資源
├── favicon.ico                   # 網站圖標 (支援多尺寸)
├── next.svg                      # Next.js 官方標誌
└── vercel.svg                    # Vercel 部署平台標誌
```

### 環境配置與建置設定
```
.env.example                      # 環境變數範本 (供開發者參考)
.env.local                        # 本地開發環境變數 (Git 忽略)
.eslintrc.json                    # ESLint 程式碼規範配置
.gitignore                        # Git 版本控制忽略規則
.npmrc                            # NPM 套件管理器配置
.prettierignore                   # Prettier 程式碼格式化忽略清單
.prettierrc                       # Prettier 程式碼格式化規則
components.json                   # shadcn/ui 元件庫配置文件
firebase.json                     # Firebase 專案配置與部署規則
firestore.rules                   # Firestore 資料庫安全規則
next.config.ts                    # Next.js 應用程式配置 (TypeScript)
package.json                      # Node.js 專案依賴與腳本定義
pnpm-lock.yaml                    # pnpm 套件管理器鎖定檔案
postcss.config.js                 # PostCSS 樣式處理器配置
tailwind.config.ts                # Tailwind CSS 工具類配置
tsconfig.json                     # TypeScript 編譯器配置
```

## src/app/ - Next.js 15 App Router

### 根層級路由配置
```
app/
├── globals.css                   # 全域 CSS 樣式 (包含 Tailwind 基礎樣式)
├── layout.tsx                    # 根佈局組件 (所有頁面的共同結構)
├── page.tsx                      # 首頁組件 (根路徑 "/" 對應頁面)
├── loading.tsx                   # 全域載入狀態 UI 組件
├── error.tsx                     # 全域錯誤處理 UI 組件
├── not-found.tsx                 # 404 找不到頁面組件
├── global-error.tsx              # 全域錯誤邊界組件 (處理嚴重錯誤)
├── favicon.ico                   # 動態生成的網站圖標
└── theme.css                     # 主題相關樣式定義
```

### 認證路由群組
```
(auth)/                           # 認證相關路由群組 (括號表示路由分組)
├── layout.tsx                    # 認證頁面共用佈局 (登入/註冊頁面樣式)
├── sign-in/
│   └── page.tsx                  # 登入頁面組件 (含表單驗證與 Firebase Auth)
└── sign-up/
    └── page.tsx                  # 註冊頁面組件 (含使用者建立與驗證)
```

### 主要應用儀表板 (平行路由架構)
```
(dashboard)/                      # 主要應用功能群組
├── layout.tsx                    # 儀表板統一佈局 (側邊欄、頂部導航)
├── page.tsx                      # 儀表板首頁 (總覽面板、快速連結)
├── loading.tsx                   # 儀表板載入狀態 UI
└── error.tsx                     # 儀表板錯誤處理 UI
```

#### 專案管理平行路由
```
@projects/                        # 專案管理模組平行路由槽
├── default.tsx                   # 預設組件 (平行路由未匹配時顯示)
├── loading.tsx                   # 專案模組載入狀態
├── error.tsx                     # 專案模組錯誤處理
├── page.tsx                      # 專案總覽頁面 (專案清單、統計資訊)
├── [id]/                         # 動態路由：特定專案詳情
│   ├── page.tsx                  # 專案詳情頁面 (進度、團隊成員、任務概覽)
│   ├── edit/
│   │   └── page.tsx              # 編輯專案資訊頁面 (表單驗證、即時更新)
│   └── tasks/                    # 專案任務子路由
│       ├── page.tsx              # 任務清單頁面 (看板檢視、篩選功能)
│       └── [taskId]/
│           └── page.tsx          # 特定任務詳情頁面 (任務編輯、狀態更新)
└── new/
    └── page.tsx                  # 新建專案頁面 (AI 輔助建立、範本選擇)
```

#### 合約管理平行路由
```
@contracts/                       # 合約管理模組平行路由槽
├── default.tsx                   # 合約模組預設組件
├── loading.tsx                   # 合約載入狀態指示器
├── error.tsx                     # 合約錯誤處理組件
├── page.tsx                      # 合約清單頁面 (表格檢視、搜尋過濾)
├── [id]/                         # 動態路由：特定合約
│   ├── page.tsx                  # 合約詳情頁面 (條款檢視、AI 摘要)
│   └── edit/
│       └── page.tsx              # 合約編輯頁面 (版本控制、變更追蹤)
└── new/
    └── page.tsx                  # 新建合約頁面 (範本庫、AI 生成輔助)
```

#### PartnerVerse 夥伴管理平行路由
```
@partners/                        # 夥伴生態系統管理模組
├── default.tsx                   # 夥伴模組預設組件
├── loading.tsx                   # 夥伴資料載入狀態
├── error.tsx                     # 夥伴模組錯誤處理
├── directory/                    # 夥伴目錄功能
│   ├── page.tsx                  # 夥伴目錄首頁 (搜尋、分類瀏覽)
│   └── [id]/
│       └── page.tsx              # 夥伴詳情頁面 (基本資料、合作歷史)
├── relationships/                # 夥伴關係管理
│   ├── page.tsx                  # 關係總覽頁面 (關係圖、統計分析)
│   └── [id]/
│       └── page.tsx              # 特定關係詳情 (互動記錄、評估指標)
├── collaborations/               # 合作專案管理
│   ├── page.tsx                  # 合作專案清單 (進行中、已完成、規劃中)
│   └── [id]/
│       └── page.tsx              # 合作專案詳情 (里程碑、共享資源)
└── network/
    └── page.tsx                  # 夥伴網絡視覺化 (關係圖譜、影響力分析)
```

#### DocuParse 文件處理平行路由
```
@documents/                       # 文件智慧處理模組
├── default.tsx                   # 文件模組預設組件
├── loading.tsx                   # 文件處理載入狀態
├── error.tsx                     # 文件模組錯誤處理
├── upload/
│   └── page.tsx                  # 文件上傳頁面 (拖放上傳、批量處理)
├── library/                      # 文件庫管理
│   ├── page.tsx                  # 文件庫首頁 (分類瀏覽、搜尋功能)
│   └── [id]/
│       └── page.tsx              # 文件詳情頁面 (預覽、標籤管理)
├── parser/                       # 智慧解析功能
│   ├── page.tsx                  # 解析工具首頁 (選擇解析類型)
│   └── [id]/
│       └── page.tsx              # 文件解析結果頁面 (結構化資料輸出)
└── ai-summary/                   # AI 摘要功能
    ├── page.tsx                  # AI 摘要工具首頁
    └── [id]/
        └── page.tsx              # 特定文件 AI 摘要頁面 (摘要編輯、導出)
```

#### 分析儀表板平行路由
```
@analytics/                       # 數據分析與洞察模組
├── default.tsx                   # 分析模組預設組件
├── loading.tsx                   # 分析數據載入狀態
├── error.tsx                     # 分析模組錯誤處理
├── overview/
│   └── page.tsx                  # 分析總覽頁面 (關鍵指標、趨勢圖表)
├── reports/                      # 報告生成功能
│   ├── page.tsx                  # 報告清單頁面 (報告類型、排程管理)
│   └── [type]/
│       └── page.tsx              # 特定類型報告頁面 (動態圖表、資料篩選)
└── insights/
    └── page.tsx                  # AI 洞察頁面 (智慧建議、預測分析)
```

### Server Actions (伺服器動作)
```
actions/                          # Next.js 15 Server Actions
├── auth-actions.ts               # 認證相關伺服器動作 (登入、登出、註冊)
├── projects-actions.ts           # 專案管理伺服器動作 (CRUD 操作、狀態更新)
├── contracts-actions.ts          # 合約管理伺服器動作 (建立、編輯、狀態變更)
├── partners-actions.ts           # 夥伴管理伺服器動作 (關係建立、資料同步)
├── documents-actions.ts          # 文件處理伺服器動作 (上傳、解析、摘要生成)
└── analytics-actions.ts          # 分析功能伺服器動作 (報告生成、資料匯總)
```

## 組件架構 (src/components/)

### UI 基礎組件庫
```
ui/                               # shadcn/ui 基礎 UI 組件庫
├── accordion.tsx                 # 可摺疊面板組件 (FAQ、設定選項)
├── alert-dialog.tsx              # 警告對話框 (確認刪除、重要通知)
├── alert.tsx                     # 警告提示組件 (成功、錯誤、警告訊息)
├── avatar.tsx                    # 用戶頭像組件 (個人資料、評論系統)
├── badge.tsx                     # 標籤徽章組件 (狀態標示、分類標籤)
├── breadcrumb.tsx                # 麵包屑導航組件 (頁面路徑指示)
├── button.tsx                    # 按鈕組件 (主要、次要、危險操作)
├── calendar.tsx                  # 日曆選擇器 (日期選擇、事件排程)
├── card.tsx                      # 卡片容器組件 (資訊展示、內容分組)
├── carousel.tsx                  # 輪播圖組件 (產品展示、圖片瀏覽)
├── chart.tsx                     # 圖表組件 (數據視覺化、統計圖表)
├── checkbox.tsx                  # 核取方塊組件 (多選操作、設定開關)
├── command.tsx                   # 命令面板組件 (快捷操作、搜尋功能)
├── dialog.tsx                    # 對話框組件 (表單彈窗、詳情檢視)
├── dropdown-menu.tsx             # 下拉式選單 (操作選項、導航選單)
├── form.tsx                      # 表單組件 (資料輸入、驗證處理)
├── input.tsx                     # 輸入框組件 (文字輸入、資料收集)
├── select.tsx                    # 選擇器組件 (下拉選項、資料篩選)
├── table/                        # 表格組件系列
│   ├── index.tsx                 # 表格主要匯出文件
│   ├── table.tsx                 # 表格容器組件
│   ├── table-body.tsx            # 表格主體組件
│   ├── table-cell.tsx            # 表格儲存格組件
│   ├── table-head.tsx            # 表格標題組件
│   ├── table-header.tsx          # 表格標題列組件
│   └── table-row.tsx             # 表格列組件
├── tabs.tsx                      # 標籤頁組件 (內容切換、功能分組)
├── textarea.tsx                  # 多行文字輸入組件 (長文輸入、備註)
├── toast.tsx                     # 彈出通知組件 (操作回饋、狀態通知)
└── tooltip.tsx                   # 工具提示組件 (說明文字、功能提示)
```

### 佈局組件
```
layout/                           # 應用程式佈局相關組件
├── app-sidebar.tsx               # 應用側邊欄 (主要導航、模組切換)
├── header.tsx                    # 頂部標題欄 (品牌標誌、用戶資訊、通知)
├── page-container.tsx            # 頁面容器 (內容區域佈局、響應式設計)
├── providers.tsx                 # 全域提供者組件 (主題、認證、狀態管理)
├── user-nav.tsx                  # 用戶導航組件 (個人選單、帳號設定)
└── ThemeToggle/                  # 主題切換功能
    ├── index.tsx                 # 主題切換主要組件
    └── theme-toggle.tsx          # 主題切換按鈕組件
```

### 功能特定組件

#### 專案管理組件
```
projects/                         # 專案管理專用 UI 組件
├── project-card.tsx              # 專案卡片 (專案總覽、快速資訊)
├── project-form.tsx              # 專案表單 (建立/編輯專案資訊)
├── task-list.tsx                 # 任務清單 (任務展示、狀態管理)
├── task-item.tsx                 # 任務項目 (單一任務資訊、操作按鈕)
├── progress-chart.tsx            # 進度圖表 (專案進度視覺化)
├── ai-subtask-suggestions.tsx    # AI 子任務建議 (智慧任務分解)
└── create-project-dialog.tsx     # 建立專案對話框 (快速建立、範本選擇)
```

#### 合約管理組件
```
contracts/                        # 合約管理專用 UI 組件
├── contract-card.tsx             # 合約卡片 (合約摘要、狀態顯示)
├── contract-form.tsx             # 合約表單 (合約資訊編輯)
├── contract-table.tsx            # 合約表格 (合約清單、排序篩選)
├── ai-contract-summary.tsx       # AI 合約摘要 (智慧摘要生成)
└── contract-status-tracker.tsx   # 合約狀態追蹤 (進度條、里程碑)
```

#### 夥伴管理組件
```
partners/                         # PartnerVerse 專用 UI 組件
├── partner-card.tsx              # 夥伴卡片 (夥伴資訊展示)
├── partner-form.tsx              # 夥伴表單 (夥伴資料編輯)
├── relationship-graph.tsx        # 關係圖表 (夥伴關係視覺化)
├── collaboration-board.tsx       # 合作看板 (合作項目管理)
├── network-visualization.tsx     # 網絡視覺化 (夥伴網絡圖)
└── partner-directory.tsx         # 夥伴目錄 (夥伴搜尋瀏覽)
```

#### 文件處理組件
```
documents/                        # DocuParse 專用 UI 組件
├── document-uploader.tsx         # 文件上傳器 (拖放上傳、進度顯示)
├── document-viewer.tsx           # 文件檢視器 (文件預覽、註解功能)
├── parse-results.tsx             # 解析結果 (結構化資料展示)
├── ai-summary-card.tsx           # AI 摘要卡片 (摘要內容顯示)
├── document-library.tsx          # 文件庫 (文件分類管理)
└── extraction-tools.tsx          # 資料提取工具 (特定欄位提取)
```

#### 分析組件
```
analytics/                        # 數據分析專用 UI 組件
├── dashboard-stats.tsx           # 儀表板統計 (關鍵指標展示)
├── chart-components.tsx          # 圖表組件 (各種圖表類型)
├── metrics-card.tsx              # 指標卡片 (單一指標展示)
├── report-generator.tsx          # 報告生成器 (報告配置、生成)
└── insights-panel.tsx            # 洞察面板 (AI 分析結果)
```

### 共用組件
```
shared/                           # 跨模組共用 UI 組件
├── data-table.tsx                # 資料表格 (通用表格、排序分頁)
├── search-input.tsx              # 搜尋輸入框 (即時搜尋、自動完成)
├── file-uploader.tsx             # 檔案上傳器 (通用上傳功能)
├── breadcrumbs.tsx               # 麵包屑導航 (動態路徑生成)
├── loading-spinner.tsx           # 載入動畫 (各種載入狀態)
├── error-boundary.tsx            # 錯誤邊界 (錯誤捕獲、友善提示)
└── confirmation-dialog.tsx       # 確認對話框 (刪除確認、重要操作)
```

## 功能模組 (src/features/)

### 認證模組
```
auth/                             # 使用者認證功能模組
├── components/                   # 認證相關 UI 組件
│   ├── sign-in-form.tsx          # 登入表單 (帳號密碼、第三方登入)
│   ├── sign-up-form.tsx          # 註冊表單 (使用者建立、驗證)
│   └── auth-layout.tsx           # 認證頁面佈局 (共用樣式、品牌展示)
├── hooks/                        # 認證相關自定義 Hooks
│   ├── use-auth.ts               # 認證狀態管理 (登入狀態、使用者資訊)
│   └── use-permissions.ts        # 權限檢查 (角色驗證、功能存取控制)
├── services/                     # 認證業務邏輯服務
│   └── auth-service.ts           # 認證服務 (Firebase Auth 整合)
└── types/                        # 認證相關型別定義
    └── auth.types.ts             # 使用者、認證狀態型別
```

### 專案管理模組
```
projects/                         # 專案管理功能模組
├── components/                   # 專案管理 UI 組件
│   ├── project-management/       # 專案管理核心組件
│   │   ├── project-list.tsx      # 專案清單 (分頁、篩選、排序)
│   │   ├── project-detail.tsx    # 專案詳情 (資訊展示、成員管理)
│   │   └── project-form.tsx      # 專案表單 (建立/編輯、驗證)
│   ├── task-management/          # 任務管理組件
│   │   ├── task-board.tsx        # 任務看板 (拖放操作、狀態變更)
│   │   ├── task-detail.tsx       # 任務詳情 (描述、附件、評論)
│   │   └── task-form.tsx         # 任務表單 (任務建立/編輯)
│   └── analytics/                # 專案分析組件
│       ├── progress-charts.tsx   # 進度圖表 (甘特圖、燃盡圖)
│       └── performance-metrics.tsx # 績效指標 (完成率、效率分析)
├── hooks/                        # 專案管理自定義 Hooks
│   ├── use-projects.ts           # 專案資料管理 (CRUD 操作)
│   ├── use-tasks.ts              # 任務資料管理 (任務狀態、分配)
│   └── use-project-analytics.ts  # 專案分析資料 (統計、趨勢)
├── services/                     # 專案管理業務服務
│   ├── project-service.ts        # 專案服務 (資料庫操作、API 呼叫)
│   ├── task-service.ts           # 任務服務 (任務 CRUD、狀態管理)
│   └── ai-service.ts             # AI 輔助服務 (任務分解、建議)
└── types/                        # 專案管理型別定義
    ├── project.types.ts          # 專案相關資料型別
    └── task.types.ts             # 任務相關資料型別
```

### 其他功能模組 (contracts/, partners/, documents/, analytics/)
*[類似結構，每個模組都包含 components/, hooks/, services/, types/ 子目錄]*

## 工具函數與配置 (src/lib/)

### AI 功能整合
```
ai/                               # AI 相關功能與服務
├── genkit.ts                     # Firebase Genkit 初始化配置
├── flows/                        # AI 工作流程定義
│   ├── generate-subtasks-flow.ts # 子任務自動生成流程
│   ├── summarize-contract.ts     # 合約智慧摘要流程
│   ├── partner-suggestions.ts   # 夥伴推薦流程
│   └── document-analysis.ts     # 文件分析流程
├── services/                     # AI 服務實作
│   ├── unified-ai-service.ts     # 統一 AI 服務介面
│   ├── projects-ai.ts            # 專案相關 AI 功能
│   ├── contracts-ai.ts           # 合約相關 AI 功能
│   ├── partner-ai.ts             # 夥伴相關 AI 功能
│   └── document-ai.ts            # 文件相關 AI 功能
└── types/                        # AI 相關型別定義
    └── ai.types.ts               # AI 服務回應、請求型別
```

### 資料庫配置
```
firebase/                         # Firebase 整合配置
├── config.ts                     # Firebase 專案基礎配置
├── client.ts                     # 客戶端 Firebase 初始化
├── server.ts                     # 伺服器端 Firebase 初始化
├── auth.ts                       # Firebase Authentication 配置
├── app-check.ts                  # App Check 安全驗證 (reCAPTCHA v3)
└── types.ts                      # Firebase 相關型別定義

supabase/                         # Supabase 整合配置 (備選方案)
├── client.ts                     # Supabase 客戶端配置
├── server.ts                     # 伺服器端 Supabase 配置
├── auth.ts                       # Supabase Auth 配置
└── types.ts                      # Supabase 自動生成型別
```

### 資料服務與驗證
```
services/                         # 業務邏輯服務層
├── firebase-service.ts           # Firebase 統一服務介面
├── supabase-service.ts           # Supabase 統一服務介面
├── project-service.ts            # 專案資料服務
├── partner-service.ts            # 夥伴資料服務
├── document-service.ts           # 文件資料服務
└── analytics-service.ts          # 分析資料服務

queries/                          # 資料查詢邏輯
├── projects-queries.ts           # 專案查詢 (TanStack Query)
├── contracts-queries.ts          # 合約查詢
├── partners-queries.ts           # 夥伴查詢
├── documents-queries.ts          # 文件查詢
└── analytics-queries.ts          # 分析查詢

validations/                      # 資料驗證 Schema
├── auth.schemas.ts               # 認證資料驗證 (Zod Schema)
├── projects.schemas.ts           # 專案資料驗證
├── contracts.schemas.ts          # 合約資料驗證
├── partner.schemas.ts            # 夥伴資料驗證
├── document.schemas.ts           # 文件資料驗證
└── common.schemas.ts             # 共用驗證規則
```

### 工具函數
```
lib/
├── data-table.ts                 # 資料表格工具 (排序、分頁、篩選)
├── font.ts                       # 字型載入配置 (Google Fonts)
├── format.ts                     # 資料格式化工具 (日期、數字、文字)
├── parsers.ts                     # 資料解析工具 (JSON、CSV、XML 處理)
├── searchparams.ts               # URL 搜尋參數處理工具
├── utils.ts                      # 通用工具函數 (cn、clsx 等)
└── constants.ts                  # 應用程式常數定義
```

## 全域 Hooks (src/hooks/)

```
hooks/                            # 全域可重用的自定義 Hooks
├── use-breadcrumbs.tsx           # 麵包屑導航資料管理
├── use-callback-ref.ts           # 回調函數參考管理
├── use-controllable-state.tsx    # 可控制的狀態管理 (受控/非受控組件)
├── use-data-table.ts             # 資料表格狀態管理 (排序、分頁、篩選)
├── use-debounce.tsx              # 防抖功能 (搜尋輸入優化)
├── use-debounced-callback.ts     # 防抖回調函數
├── use-media-query.ts            # 媒體查詢檢測 (響應式設計)
├── use-mobile.tsx                # 行動裝置檢測
├── use-multistep-form.tsx        # 多步驟表單管理
├── use-toast.ts                  # 通知訊息管理
└── use-theme.ts                  # 主題切換管理 (深色/淺色模式)
```

## 狀態管理 (src/store/)

```
store/                            # Zustand 全域狀態管理
├── auth-store.ts                 # 認證狀態 (使用者資訊、登入狀態)
├── projects-store.ts             # 專案狀態 (專案清單、當前專案、篩選條件)
├── contracts-store.ts            # 合約狀態 (合約清單、狀態篩選)
├── partner-store.ts              # 夥伴狀態 (夥伴清單、關係資料)
├── document-store.ts             # 文件狀態 (文件庫、上傳進度、解析結果)
├── analytics-store.ts            # 分析狀態 (圖表資料、報告設定)
├── ui-store.ts                   # UI 狀態 (側邊欄、主題、通知)
└── index.ts                      # Store 統一匯出與組合
```

## 型別定義 (src/types/)

```
types/                            # 全域 TypeScript 型別定義
├── auth.types.ts                 # 認證相關型別 (User, AuthState, Permissions)
├── projects.types.ts             # 專案管理型別 (Project, Task, Status 等)
├── contracts.types.ts            # 合約管理型別 (Contract, Terms, Status 等)
├── partner.types.ts              # 夥伴管理型別 (Partner, Relationship 等)
├── document.types.ts             # 文件處理型別 (Document, ParseResult 等)
├── analytics.types.ts            # 分析功能型別 (Metrics, Report, Chart 等)
├── api.types.ts                  # API 回應型別 (Response, Error, Pagination)
├── data-table.ts                 # 資料表格型別 (Column, Sort, Filter)
└── index.ts                      # 型別統一匯出
```

## 配置文件 (src/config/)

```
config/                           # 應用程式配置文件
├── auth.config.ts                # 認證配置 (Firebase Auth、權限設定)
├── database.config.ts            # 資料庫配置 (連線設定、集合名稱)
├── ai.config.ts                  # AI 服務配置 (API 金鑰、模型參數)
├── app.config.ts                 # 應用程式配置 (功能開關、環境設定)
└── data-table.ts                 # 資料表格預設配置 (分頁大小、排序)
```

## 常數定義 (src/constants/)

```
constants/                        # 應用程式常數定義
├── auth.constants.ts             # 認證常數 (角色、權限、錯誤訊息)
├── projects.constants.ts         # 專案常數 (狀態選項、優先級)
├── contracts.constants.ts        # 合約常數 (類型、狀態、期限選項)
├── partner.constants.ts          # 夥伴常數 (關係類型、合作狀態)
├── document.constants.ts         # 文件常數 (支援格式、解析類型)
├── ui.constants.ts               # UI 常數 (顏色、尺寸、動畫持續時間)
├── data.ts                       # 靜態資料 (選項清單、預設值)
└── mock-api.ts                   # 模擬 API 資料 (開發階段使用)
```

## 樣式文件 (src/styles/)

```
styles/                           # 額外樣式定義
├── components.css                # 組件特定樣式 (覆蓋 shadcn/ui 樣式)
├── utilities.css                 # 工具類樣式 (自定義 Tailwind 類)
└── themes/                       # 主題樣式定義
    ├── light.css                 # 淺色主題變數與樣式
    └── dark.css                  # 深色主題變數與樣式
```

## 監控與中間件 (src/)

```
src/
├── instrumentation.ts            # Next.js 監控配置 (效能監控、錯誤追蹤)
├── instrumentation-client.ts     # 客戶端監控配置 (使用者行為追蹤)
└── middleware.ts                 # Next.js 中間件 (認證檢查、路由保護、地區化)
```

## 特殊功能組件

### 命令面板 (KBar)
```
components/kbar/                  # 命令面板功能 (快捷鍵操作)
├── index.tsx                     # KBar 主要組件與提供者
├── render-result.tsx             # 搜尋結果渲染組件
├── result-item.tsx               # 單一結果項目組件
└── use-theme-switching.tsx       # 主題切換命令集成
```

### 其他共用組件
```
components/
├── active-theme.tsx              