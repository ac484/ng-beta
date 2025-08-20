# 整合後完整檔案樹結構

## 專案根目錄結構

```
ng-beta-integrated/
├── .cursor/                      # Cursor IDE 配置
│   ├── .cursorrules
│   ├── context7.mdc
│   └── mcp.json
├── .github/                      # GitHub 配置
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── test.yml
│   └── FUNDING.yml
├── .husky/                       # Git hooks
│   ├── pre-commit
│   └── pre-push
├── .kiro/                        # Kiro AI 配置
│   ├── settings/
│   │   └── mcp.json
│   ├── specs/                    # 功能規格文件
│   └── steering/                 # AI 指導規則
├── .vscode/                      # VS Code 配置
│   └── launch.json
├── docs/                         # 專案文件
│   ├── modern-integration-plan.md
│   ├── integrated-file-structure.md
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   └── user-guide.md
├── public/                       # 靜態資源
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   ├── favicon.ico
│   ├── next.svg
│   └── vercel.svg
├── src/                          # 主要原始碼
├── .env.example                  # 環境變數範例
├── .env.local                    # 本地環境變數
├── .eslintrc.json               # ESLint 配置
├── .gitignore                   # Git 忽略文件
├── .npmrc                       # npm 配置
├── .prettierignore              # Prettier 忽略文件
├── .prettierrc                  # Prettier 配置
├── components.json              # shadcn/ui 配置
├── firebase.json                # Firebase 配置
├── firestore.rules              # Firestore 安全規則
├── next.config.ts               # Next.js 配置
├── package.json                 # 專案依賴
├── pnpm-lock.yaml              # 鎖定文件
├── postcss.config.js           # PostCSS 配置
├── README.md                    # 專案說明
├── tailwind.config.ts          # Tailwind CSS 配置
└── tsconfig.json               # TypeScript 配置
```

## src/ 目錄詳細結構

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # 認證路由群組
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── (dashboard)/              # 主要應用路由群組
│   │   ├── @projects/            # 專案管理平行路由
│   │   ├── @projects/            # 專案管理平行路由
│   │   │   ├── default.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── page.tsx          # 專案總覽
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # 專案詳情
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx  # 編輯專案
│   │   │   │   └── tasks/
│   │   │   │       ├── page.tsx  # 專案任務
│   │   │   │       └── [taskId]/
│   │   │   │           └── page.tsx # 任務詳情
│   │   │   └── new/
│   │   │       └── page.tsx      # 新建專案
│   │   ├── @contracts/           # 合約管理平行路由
│   │   │   ├── default.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── page.tsx          # 合約列表
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # 合約詳情
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx  # 編輯合約
│   │   │   └── new/
│   │   │       └── page.tsx      # 新建合約
│   │   ├── @partners/            # PartnerVerse 平行路由
│   │   │   ├── default.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── directory/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── relationships/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── collaborations/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── network/
│   │   │       └── page.tsx
│   │   ├── @documents/           # DocuParse 平行路由
│   │   │   ├── default.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── upload/
│   │   │   │   └── page.tsx
│   │   │   ├── library/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── parser/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── ai-summary/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── @analytics/           # 分析儀表板平行路由
│   │   │   ├── default.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── overview/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [type]/
│   │   │   │       └── page.tsx
│   │   │   └── insights/
│   │   │       └── page.tsx
│   │   ├── layout.tsx            # 儀表板統一佈局
│   │   ├── page.tsx              # 儀表板首頁
│   │   ├── loading.tsx           # 載入狀態
│   │   └── error.tsx             # 錯誤處理
│   ├── actions/                  # Server Actions
│   │   ├── auth-actions.ts
│   │   ├── projects-actions.ts
│   │   ├── contracts-actions.ts
│   │   ├── partners-actions.ts
│   │   ├── documents-actions.ts
│   │   └── analytics-actions.ts
│   ├── globals.css               # 全域樣式
│   ├── layout.tsx                # 根佈局
│   ├── page.tsx                  # 首頁
│   ├── loading.tsx               # 全域載入
│   ├── error.tsx                 # 全域錯誤
│   ├── not-found.tsx            # 404 頁面
│   ├── global-error.tsx         # 全域錯誤邊界
│   ├── favicon.ico              # 網站圖標
│   └── theme.css                # 主題樣式
├── components/                   # 共用元件
│   ├── ui/                       # shadcn/ui 基礎元件
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── aspect-ratio.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── chart.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── context-menu.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── heading.tsx
│   │   ├── hover-card.tsx
│   │   ├── input-otp.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── menubar.tsx
│   │   ├── modal.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── resizable.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table/
│   │   │   ├── index.tsx
│   │   │   ├── table.tsx
│   │   │   ├── table-body.tsx
│   │   │   ├── table-cell.tsx
│   │   │   ├── table-head.tsx
│   │   │   ├── table-header.tsx
│   │   │   └── table-row.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   └── tooltip.tsx
│   ├── layout/                   # 佈局元件
│   │   ├── app-sidebar.tsx
│   │   ├── header.tsx
│   │   ├── page-container.tsx
│   │   ├── providers.tsx
│   │   ├── user-nav.tsx
│   │   └── ThemeToggle/
│   │       ├── index.tsx
│   │       └── theme-toggle.tsx
│   ├── projects/                 # 專案管理專用元件
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   ├── task-list.tsx
│   │   ├── task-item.tsx
│   │   ├── progress-chart.tsx
│   │   ├── ai-subtask-suggestions.tsx
│   │   └── create-project-dialog.tsx
│   ├── contracts/                # 合約管理專用元件
│   │   ├── contract-card.tsx
│   │   ├── contract-form.tsx
│   │   ├── contract-table.tsx
│   │   ├── ai-contract-summary.tsx
│   │   └── contract-status-tracker.tsx
│   ├── partners/                 # PartnerVerse 專用元件
│   │   ├── partner-card.tsx
│   │   ├── partner-form.tsx
│   │   ├── relationship-graph.tsx
│   │   ├── collaboration-board.tsx
│   │   ├── network-visualization.tsx
│   │   └── partner-directory.tsx
│   ├── documents/                # DocuParse 專用元件
│   │   ├── document-uploader.tsx
│   │   ├── document-viewer.tsx
│   │   ├── parse-results.tsx
│   │   ├── ai-summary-card.tsx
│   │   ├── document-library.tsx
│   │   └── extraction-tools.tsx
│   ├── analytics/                # 分析元件
│   │   ├── dashboard-stats.tsx
│   │   ├── chart-components.tsx
│   │   ├── metrics-card.tsx
│   │   ├── report-generator.tsx
│   │   └── insights-panel.tsx
│   ├── shared/                   # 跨模組共用元件
│   │   ├── data-table.tsx
│   │   ├── search-input.tsx
│   │   ├── file-uploader.tsx
│   │   ├── breadcrumbs.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── error-boundary.tsx
│   │   └── confirmation-dialog.tsx
│   ├── kbar/                     # 命令面板
│   │   ├── index.tsx
│   │   ├── render-result.tsx
│   │   ├── result-item.tsx
│   │   └── use-theme-switching.tsx
│   ├── modal/                    # 模態框元件
│   │   └── alert-modal.tsx
│   ├── active-theme.tsx
│   ├── breadcrumbs.tsx
│   ├── file-uploader.tsx
│   ├── form-card-skeleton.tsx
│   ├── icons.tsx
│   ├── nav-main.tsx
│   ├── nav-projects.tsx
│   ├── nav-user.tsx
│   ├── org-switcher.tsx
│   ├── search-input.tsx
│   ├── theme-selector.tsx
│   └── user-avatar-profile.tsx
├── features/                     # 功能模組
│   ├── auth/                     # 認證功能
│   │   ├── components/
│   │   │   ├── sign-in-form.tsx
│   │   │   ├── sign-up-form.tsx
│   │   │   └── auth-layout.tsx
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── use-permissions.ts
│   │   ├── services/
│   │   │   └── auth-service.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── projects/                 # 專案管理功能模組
│   │   ├── components/
│   │   │   ├── project-management/
│   │   │   │   ├── project-list.tsx
│   │   │   │   ├── project-detail.tsx
│   │   │   │   └── project-form.tsx
│   │   │   ├── task-management/
│   │   │   │   ├── task-board.tsx
│   │   │   │   ├── task-detail.tsx
│   │   │   │   └── task-form.tsx
│   │   │   └── analytics/
│   │   │       ├── progress-charts.tsx
│   │   │       └── performance-metrics.tsx
│   │   ├── hooks/
│   │   │   ├── use-projects.ts
│   │   │   ├── use-tasks.ts
│   │   │   └── use-project-analytics.ts
│   │   ├── services/
│   │   │   ├── project-service.ts
│   │   │   ├── task-service.ts
│   │   │   └── ai-service.ts
│   │   └── types/
│   │       ├── project.types.ts
│   │       └── task.types.ts
│   ├── contracts/                # 合約管理功能模組
│   │   ├── components/
│   │   │   ├── contract-list.tsx
│   │   │   ├── contract-detail.tsx
│   │   │   └── ai-summarizer.tsx
│   │   ├── hooks/
│   │   │   └── use-contracts.ts
│   │   ├── services/
│   │   │   └── contract-service.ts
│   │   └── types/
│   │       └── contract.types.ts
│   ├── partners/                 # PartnerVerse 功能模組
│   │   ├── components/
│   │   │   ├── directory/
│   │   │   │   ├── partner-list.tsx
│   │   │   │   ├── partner-detail.tsx
│   │   │   │   └── partner-form.tsx
│   │   │   ├── relationships/
│   │   │   │   ├── relationship-map.tsx
│   │   │   │   ├── relationship-detail.tsx
│   │   │   │   └── relationship-form.tsx
│   │   │   ├── collaborations/
│   │   │   │   ├── collaboration-board.tsx
│   │   │   │   ├── collaboration-detail.tsx
│   │   │   │   └── collaboration-form.tsx
│   │   │   └── network/
│   │   │       ├── network-graph.tsx
│   │   │       └── network-analytics.tsx
│   │   ├── hooks/
│   │   │   ├── use-partners.ts
│   │   │   ├── use-relationships.ts
│   │   │   ├── use-collaborations.ts
│   │   │   └── use-network.ts
│   │   ├── services/
│   │   │   ├── partner-service.ts
│   │   │   ├── relationship-service.ts
│   │   │   └── collaboration-service.ts
│   │   └── types/
│   │       ├── partner.types.ts
│   │       ├── relationship.types.ts
│   │       └── collaboration.types.ts
│   ├── documents/                # DocuParse 功能模組
│   │   ├── components/
│   │   │   ├── upload/
│   │   │   │   ├── file-uploader.tsx
│   │   │   │   ├── upload-progress.tsx
│   │   │   │   └── upload-history.tsx
│   │   │   ├── library/
│   │   │   │   ├── document-grid.tsx
│   │   │   │   ├── document-detail.tsx
│   │   │   │   └── document-search.tsx
│   │   │   ├── parser/
│   │   │   │   ├── parse-interface.tsx
│   │   │   │   ├── parse-results.tsx
│   │   │   │   └── extraction-tools.tsx
│   │   │   └── ai-summary/
│   │   │       ├── summary-generator.tsx
│   │   │       ├── summary-viewer.tsx
│   │   │       └── summary-editor.tsx
│   │   ├── hooks/
│   │   │   ├── use-documents.ts
│   │   │   ├── use-parser.ts
│   │   │   ├── use-ai-summary.ts
│   │   │   └── use-file-upload.ts
│   │   ├── services/
│   │   │   ├── document-service.ts
│   │   │   ├── parser-service.ts
│   │   │   ├── ai-summary-service.ts
│   │   │   └── file-service.ts
│   │   └── types/
│   │       ├── document.types.ts
│   │       ├── parser.types.ts
│   │       └── ai-summary.types.ts
│   ├── analytics/                # 分析功能模組
│   │   ├── components/
│   │   │   ├── overview/
│   │   │   │   ├── dashboard-overview.tsx
│   │   │   │   ├── key-metrics.tsx
│   │   │   │   └── quick-stats.tsx
│   │   │   ├── reports/
│   │   │   │   ├── report-builder.tsx
│   │   │   │   ├── report-viewer.tsx
│   │   │   │   └── report-export.tsx
│   │   │   └── insights/
│   │   │       ├── ai-insights.tsx
│   │   │       ├── trend-analysis.tsx
│   │   │       └── recommendations.tsx
│   │   ├── hooks/
│   │   │   ├── use-analytics.ts
│   │   │   ├── use-reports.ts
│   │   │   └── use-insights.ts
│   │   ├── services/
│   │   │   ├── analytics-service.ts
│   │   │   ├── report-service.ts
│   │   │   └── insights-service.ts
│   │   └── types/
│   │       ├── analytics.types.ts
│   │       ├── report.types.ts
│   │       └── insights.types.ts
│   └── shared/                   # 共用功能模組
│       ├── components/
│       │   ├── data-visualization/
│       │   ├── form-components/
│       │   └── navigation/
│       ├── hooks/
│       │   ├── use-api.ts
│       │   ├── use-local-storage.ts
│       │   └── use-debounce.ts
│       ├── services/
│       │   ├── api-service.ts
│       │   ├── cache-service.ts
│       │   └── notification-service.ts
│       └── types/
│           ├── api.types.ts
│           └── common.types.ts
├── hooks/                        # 全域 hooks
│   ├── use-breadcrumbs.tsx
│   ├── use-callback-ref.ts
│   ├── use-controllable-state.tsx
│   ├── use-data-table.ts
│   ├── use-debounce.tsx
│   ├── use-debounced-callback.ts
│   ├── use-media-query.ts
│   ├── use-mobile.tsx
│   ├── use-multistep-form.tsx
│   ├── use-toast.ts
│   └── use-theme.ts
├── lib/                          # 工具函數和配置
│   ├── ai/                       # AI 相關功能
│   │   ├── genkit.ts
│   │   ├── flows/
│   │   │   ├── generate-subtasks-flow.ts
│   │   │   ├── summarize-contract.ts
│   │   │   ├── partner-suggestions.ts
│   │   │   └── document-analysis.ts
│   │   ├── services/
│   │   │   ├── unified-ai-service.ts
│   │   │   ├── projects-ai.ts
│   │   │   ├── contracts-ai.ts
│   │   │   ├── partner-ai.ts
│   │   │   └── document-ai.ts
│   │   └── types/
│   │       └── ai.types.ts
│   ├── firebase/                 # Firebase 配置
│   │   ├── config.ts             # Firebase 基礎配置
│   │   ├── client.ts             # 客戶端 Firebase 配置
│   │   ├── server.ts             # 服務端 Firebase 配置
│   │   ├── auth.ts               # 認證相關配置
│   │   ├── app-check.ts          # App Check 配置 (reCAPTCHA v3)
│   │   └── types.ts              # Firebase 類型定義
│   ├── supabase/                 # Supabase 配置
│   │   ├── client.ts             # Supabase 客戶端配置
│   │   ├── server.ts             # 服務端 Supabase 配置
│   │   ├── auth.ts               # 認證相關配置
│   │   └── types.ts              # Supabase 生成的類型定義
│   ├── services/
│   │   ├── firebase-service.ts
│   │   ├── supabase-service.ts   # Supabase 統一服務
│   │   ├── project-service.ts
│   │   ├── partner-service.ts
│   │   ├── document-service.ts
│   │   └── analytics-service.ts
│   ├── queries/
│   │   ├── projects-queries.ts
│   │   ├── contracts-queries.ts
│   │   ├── partners-queries.ts
│   │   ├── documents-queries.ts
│   │   └── analytics-queries.ts
│   ├── validations/
│   │   ├── auth.schemas.ts
│   │   ├── projects.schemas.ts
│   │   ├── contracts.schemas.ts
│   │   ├── partner.schemas.ts
│   │   ├── document.schemas.ts
│   │   └── common.schemas.ts
│   ├── data-table.ts
│   ├── font.ts
│   ├── format.ts
│   ├── parsers.ts
│   ├── searchparams.ts
│   ├── utils.ts
│   └── constants.ts
├── store/                        # 狀態管理
│   ├── auth-store.ts
│   ├── projects-store.ts
│   ├── contracts-store.ts
│   ├── partner-store.ts
│   ├── document-store.ts
│   ├── analytics-store.ts
│   ├── ui-store.ts
│   └── index.ts
├── types/                        # 全域類型定義
│   ├── auth.types.ts
│   ├── projects.types.ts
│   ├── contracts.types.ts
│   ├── partner.types.ts
│   ├── document.types.ts
│   ├── analytics.types.ts
│   ├── api.types.ts
│   ├── data-table.ts
│   └── index.ts
├── config/                       # 配置文件
│   ├── auth.config.ts
│   ├── database.config.ts
│   ├── ai.config.ts
│   ├── app.config.ts
│   └── data-table.ts
├── constants/                    # 常數定義
│   ├── auth.constants.ts
│   ├── projects.constants.ts
│   ├── contracts.constants.ts
│   ├── partner.constants.ts
│   ├── document.constants.ts
│   ├── ui.constants.ts
│   ├── data.ts
│   └── mock-api.ts
├── styles/                       # 額外樣式文件
│   ├── components.css
│   ├── utilities.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── instrumentation.ts            # Next.js 監控
├── instrumentation-client.ts     # 客戶端監控
└── middleware.ts                 # Next.js 中間件
```

## 關鍵檔案說明

### 1. 平行路由結構
- `@projects/`, `@contracts/`, `@partners/`, `@documents/`, `@analytics/` 為平行路由槽
- 每個槽都有 `default.tsx`, `loading.tsx`, `error.tsx` 用於狀態管理
- 支援獨立的錯誤處理和載入狀態

### 2. Route Handlers (API)
- 完全取代傳統的 `pages/api` 結構
- 使用 Next.js 15 的 Route Handlers
- 支援所有 HTTP 方法 (GET, POST, PUT, DELETE, PATCH)
- 內建 TypeScript 支援

### 3. 功能模組化
- 每個功能模組包含 `components/`, `hooks/`, `services/`, `types/`
- 清晰的關注點分離
- 便於維護和測試

### 4. 共用資源
- `components/ui/` 包含所有 shadcn/ui 元件
- `components/shared/` 包含跨模組共用元件
- `lib/` 包含工具函數和配置
- `hooks/` 包含全域可重用的 hooks

### 5. 狀態管理
- 使用 Zustand 進行全域狀態管理
- 每個模組有獨立的 store
- 支援持久化和中間件

### 6. 類型安全
- 完整的 TypeScript 支援
- 分層的類型定義
- 嚴格的類型檢查

這個檔案結構確保了：
- **可維護性**: 清晰的模組分離
- **可擴展性**: 易於添加新功能
- **效能**: 最佳化的程式碼分割
- **開發體驗**: 良好的開發工具支援
- **類型安全**: 完整的 TypeScript 覆蓋