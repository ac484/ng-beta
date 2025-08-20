# Next.js 四專案整合實施計畫書

## 專案概述

本計畫將整合以下四個 Next.js 專案為一個統一的 pnpm workspaces monorepo：

1. **DocuParse** - 文件解析與數據提取工具（AI 驅動）
2. **Dashboard Starter** - 完整的管理儀表板模板（認證、分析、產品管理、看板）
3. **PartnerVerse** - 合作夥伴管理系統（工作流程優化、AI 建議）
4. **Portfolio** - 專案與合約管理系統（Firebase 整合、任務管理）

## 技術棧分析

### 共同技術棧
- **框架**: Next.js 15.x (App Router)
- **語言**: TypeScript
- **UI 組件**: Radix UI + shadcn/ui
- **樣式**: Tailwind CSS
- **表單**: React Hook Form + Zod
- **圖表**: Recharts
- **AI 整合**: Genkit + Google AI

### 專案特色功能
- **DocuParse**: 文件上傳、AI 數據提取、表格預覽、數據導出
- **Dashboard**: Clerk 認證、多頁面儀表板、拖拽看板、數據表格
- **PartnerVerse**: 合作夥伴管理、工作流程優化、AI 建議
- **Portfolio**: 專案管理、任務樹、合約管理、Firebase 整合

## 整合後目標檔案樹

```text
D:\7s\ng-beta\
├── package.json                    # Root workspace 管理
├── pnpm-workspace.yaml            # pnpm 工作區定義
├── tsconfig.base.json             # 共用 TypeScript 設定
├── .editorconfig                  # 編輯器配置
├── .gitignore                     # Git 忽略文件
├── README.md                      # 專案說明
├── docs/                          # 專案文檔
│   ├── integration-guide.md      # 整合指南
│   ├── development-guide.md      # 開發指南
│   └── deployment-guide.md       # 部署指南
│
├── apps/                          # 應用程式目錄
│   ├── docuparse/                # 文件解析應用
│   │   ├── apphosting.yaml      # 部署配置
│   │   ├── components.json      # shadcn 配置
│   │   ├── next.config.ts       # Next.js 配置
│   │   ├── package.json         # 依賴管理
│   │   ├── postcss.config.mjs   # PostCSS 配置
│   │   ├── tailwind.config.ts   # Tailwind 配置
│   │   ├── tsconfig.json        # TypeScript 配置
│   │   ├── README.md            # 專案說明
│   │   ├── public/              # 靜態資源
│   │   └── src/                 # 源代碼
│   │       ├── ai/              # AI 功能
│   │       │   ├── dev.ts
│   │       │   ├── genkit.ts
│   │       │   └── flows/
│   │       │       └── extract-work-items.ts
│   │       ├── app/             # Next.js App Router
│   │       │   ├── actions.ts
│   │       │   ├── favicon.ico
│   │       │   ├── globals.css
│   │       │   ├── layout.tsx
│   │       │   └── page.tsx
│   │       ├── components/      # React 組件
│   │       │   ├── ui/          # 基礎 UI 組件
│   │       │   │   ├── accordion.tsx
│   │       │   │   ├── alert-dialog.tsx
│   │       │   │   ├── alert.tsx
│   │       │   │   ├── avatar.tsx
│   │       │   │   ├── badge.tsx
│   │       │   │   ├── button.tsx
│   │       │   │   ├── calendar.tsx
│   │       │   │   ├── card.tsx
│   │       │   │   ├── carousel.tsx
│   │       │   │   ├── chart.tsx
│   │       │   │   ├── checkbox.tsx
│   │       │   │   ├── collapsible.tsx
│   │       │   │   ├── dialog.tsx
│   │       │   │   ├── dropdown-menu.tsx
│   │       │   │   ├── form.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   ├── label.tsx
│   │       │   │   ├── menubar.tsx
│   │       │   │   ├── popover.tsx
│   │       │   │   ├── progress.tsx
│   │       │   │   ├── radio-group.tsx
│   │       │   │   ├── scroll-area.tsx
│   │       │   │   ├── select.tsx
│   │       │   │   ├── separator.tsx
│   │       │   │   ├── sheet.tsx
│   │       │   │   ├── skeleton.tsx
│   │       │   │   ├── slider.tsx
│   │       │   │   ├── switch.tsx
│   │       │   │   ├── table.tsx
│   │       │   │   ├── tabs.tsx
│   │       │   │   ├── textarea.tsx
│   │       │   │   ├── toast.tsx
│   │       │   │   ├── toaster.tsx
│   │       │   │   └── tooltip.tsx
│   │       │   └── work-items-table.tsx
│   │       ├── hooks/           # 自定義 Hooks
│   │       │   └── use-toast.ts
│   │       └── lib/             # 工具函數
│   │           └── utils.ts
│   │
│   ├── dashboard-starter/        # 管理儀表板應用
│   │   ├── components.json      # shadcn 配置
│   │   ├── next.config.ts       # Next.js 配置
│   │   ├── package.json         # 依賴管理
│   │   ├── postcss.config.js    # PostCSS 配置
│   │   ├── tailwind.config.ts   # Tailwind 配置
│   │   ├── tsconfig.json        # TypeScript 配置
│   │   ├── README.md            # 專案說明
│   │   ├── public/              # 靜態資源
│   │   │   ├── assets/
│   │   │   │   └── sentry.svg
│   │   │   ├── next.svg
│   │   │   └── vercel.svg
│   │   └── src/                 # 源代碼
│   │       ├── app/             # Next.js App Router
│   │       │   ├── auth/        # 認證路由
│   │       │   │   ├── sign-in/
│   │       │   │   │   └── [[...sign-in]]/
│   │       │   │   │       └── page.tsx
│   │       │   │   └── sign-up/
│   │       │   │       └── [[...sign-up]]/
│   │       │   │           └── page.tsx
│   │       │   ├── dashboard/   # 儀表板路由
│   │       │   │   ├── kanban/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── layout.tsx
│   │       │   │   ├── overview/
│   │       │   │   │   ├── @area_stats/
│   │       │   │   │   │   ├── error.tsx
│   │       │   │   │   │   ├── loading.tsx
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   ├── @bar_stats/
│   │       │   │   │   │   ├── error.tsx
│   │       │   │   │   │   ├── loading.tsx
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   ├── @pie_stats/
│   │       │   │   │   │   ├── error.tsx
│   │       │   │   │   │   ├── loading.tsx
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   ├── @sales/
│   │       │   │   │   │   ├── error.tsx
│   │       │   │   │   │   ├── loading.tsx
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   ├── error.tsx
│   │       │   │   │   ├── layout.tsx
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── product/
│   │       │   │   │   ├── [productId]/
│   │       │   │   │   │   └── page.tsx
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── profile/
│   │       │   │   │   └── [[...profile]]/
│   │       │   │   │       └── page.tsx
│   │       │   │   └── page.tsx
│   │       │   ├── favicon.ico
│   │       │   ├── global-error.tsx
│   │       │   ├── globals.css
│   │       │   ├── layout.tsx
│   │       │   ├── middleware.ts
│   │       │   ├── not-found.tsx
│   │       │   └── page.tsx
│   │       ├── components/      # React 組件
│   │       │   ├── active-theme.tsx
│   │       │   ├── breadcrumbs.tsx
│   │       │   ├── file-uploader.tsx
│   │       │   ├── form-card-skeleton.tsx
│   │       │   ├── icons.tsx
│   │       │   ├── kbar/        # 命令面板
│   │       │   │   ├── index.tsx
│   │       │   │   ├── render-result.tsx
│   │       │   │   ├── result-item.tsx
│   │       │   │   └── use-theme-switching.tsx
│   │       │   ├── layout/      # 布局組件
│   │       │   │   ├── app-sidebar.tsx
│   │       │   │   ├── cta-github.tsx
│   │       │   │   ├── header.tsx
│   │       │   │   ├── page-container.tsx
│   │       │   │   ├── providers.tsx
│   │       │   │   ├── ThemeToggle/
│   │       │   │   │   ├── theme-provider.tsx
│   │       │   │   │   └── theme-toggle.tsx
│   │       │   │   └── user-nav.tsx
│   │       │   ├── modal/
│   │       │   │   └── alert-modal.tsx
│   │       │   ├── nav-main.tsx
│   │       │   ├── nav-projects.tsx
│   │       │   ├── nav-user.tsx
│   │       │   ├── org-switcher.tsx
│   │       │   ├── search-input.tsx
│   │       │   ├── theme-selector.tsx
│   │       │   ├── ui/          # 基礎 UI 組件
│   │       │   │   ├── accordion.tsx
│   │       │   │   ├── alert-dialog.tsx
│   │       │   │   ├── alert.tsx
│   │       │   │   ├── aspect-ratio.tsx
│   │       │   │   ├── avatar.tsx
│   │       │   │   ├── badge.tsx
│   │       │   │   ├── breadcrumb.tsx
│   │       │   │   ├── button.tsx
│   │       │   │   ├── calendar.tsx
│   │       │   │   ├── card.tsx
│   │       │   │   ├── chart.tsx
│   │       │   │   ├── checkbox.tsx
│   │       │   │   ├── collapsible.tsx
│   │       │   │   ├── command.tsx
│   │       │   │   ├── context-menu.tsx
│   │       │   │   ├── dialog.tsx
│   │       │   │   ├── drawer.tsx
│   │       │   │   ├── dropdown-menu.tsx
│   │       │   │   ├── form.tsx
│   │       │   │   ├── heading.tsx
│   │       │   │   ├── hover-card.tsx
│   │       │   │   ├── input-otp.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   ├── label.tsx
│   │       │   │   ├── menubar.tsx
│   │       │   │   ├── modal.tsx
│   │       │   │   ├── navigation-menu.tsx
│   │       │   │   ├── pagination.tsx
│   │       │   │   ├── popover.tsx
│   │       │   │   ├── progress.tsx
│   │       │   │   ├── radio-group.tsx
│   │       │   │   ├── resizable.tsx
│   │       │   │   ├── scroll-area.tsx
│   │       │   │   ├── select.tsx
│   │       │   │   ├── separator.tsx
│   │       │   │   ├── sheet.tsx
│   │       │   │   ├── sidebar.tsx
│   │       │   │   ├── skeleton.tsx
│   │       │   │   ├── slider.tsx
│   │       │   │   ├── sonner.tsx
│   │       │   │   ├── switch.tsx
│   │       │   │   ├── table/
│   │       │   │   │   ├── data-table-column-header.tsx
│   │       │   │   │   ├── data-table-date-filter.tsx
│   │       │   │   │   ├── data-table-faceted-filter.tsx
│   │       │   │   │   ├── data-table-pagination.tsx
│   │       │   │   │   ├── data-table-row-actions.tsx
│   │       │   │   │   ├── data-table-toolbar.tsx
│   │       │   │   │   └── data-table-view-options.tsx
│   │       │   │   ├── table.tsx
│   │       │   │   ├── tabs.tsx
│   │       │   │   ├── textarea.tsx
│   │       │   │   ├── toggle-group.tsx
│   │       │   │   └── toggle.tsx
│   │       │   └── tooltip.tsx
│   │       ├── config/          # 配置
│   │       │   └── data-table.ts
│   │       ├── constants/       # 常量
│   │       │   ├── data.ts
│   │       │   └── mock-api.ts
│   │       ├── features/        # 功能模組
│   │       │   ├── auth/        # 認證功能
│   │       │   │   └── components/
│   │       │   │       ├── github-auth-button.tsx
│   │       │   │       ├── sign-in-view.tsx
│   │       │   │       └── sign-up-view.tsx
│   │       │   ├── kanban/      # 看板功能
│   │       │   │   ├── components/
│   │       │   │   │   ├── board-column.tsx
│   │       │   │   │   ├── column-action.tsx
│   │       │   │   │   ├── kanban-board.tsx
│   │       │   │   │   ├── task-card.tsx
│   │       │   │   │   ├── task-dialog.tsx
│   │       │   │   │   └── task-form.tsx
│   │       │   │   └── utils/
│   │       │   │       ├── index.ts
│   │       │   │       └── store.ts
│   │       │   ├── overview/    # 概覽功能
│   │       │   │   └── components/
│   │       │   │       ├── area-graph-skeleton.tsx
│   │       │   │       ├── area-graph.tsx
│   │       │   │       ├── bar-graph-skeleton.tsx
│   │       │   │       ├── bar-graph.tsx
│   │       │   │       ├── pie-graph-skeleton.tsx
│   │       │   │       ├── pie-graph.tsx
│   │       │   │       └── sales-graph-skeleton.tsx
│   │       │   ├── products/    # 產品功能
│   │       │   │   ├── components/
│   │       │   │   │   ├── product-form.tsx
│   │       │   │   │   ├── product-listing.tsx
│   │       │   │   │   └── product-tables/
│   │       │   │   │       ├── cell-action.tsx
│   │       │   │   │       ├── columns.tsx
│   │       │   │   │       └── index.tsx
│   │       │   │   └── product-view-page.tsx
│   │       │   └── profile/     # 個人資料功能
│   │       │       ├── components/
│   │       │       │   ├── profile-create-form.tsx
│   │       │       │   └── profile-view-page.tsx
│   │       │       └── utils/
│   │       │           └── form-schema.ts
│   │       ├── hooks/           # 自定義 Hooks
│   │       │   ├── use-breadcrumbs.tsx
│   │       │   ├── use-callback-ref.ts
│   │       │   ├── use-callback-ref.tsx
│   │       │   ├── use-controllable-state.tsx
│   │       │   ├── use-data-table.ts
│   │       │   ├── use-debounce.tsx
│   │       │   ├── use-debounced-callback.ts
│   │       │   ├── use-media-query.ts
│   │       │   ├── use-mobile.tsx
│   │       │   └── use-multistep-form.tsx
│   │       ├── instrumentation-client.ts
│   │       ├── instrumentation.ts
│   │       ├── lib/             # 工具函數
│   │       │   ├── data-table.ts
│   │       │   ├── font.ts
│   │       │   ├── format.ts
│   │       │   ├── parsers.ts
│   │       │   ├── searchparams.ts
│   │       │   └── utils.ts
│   │       ├── middleware.ts
│   │       ├── types/           # 類型定義
│   │       │   ├── data-table.ts
│   │       │   └── index.ts
│   │       └── theme.css
│   │
│   ├── partnerverse/            # 合作夥伴管理應用
│   │   ├── apphosting.yaml     # 部署配置
│   │   ├── components.json     # shadcn 配置
│   │   ├── next.config.ts      # Next.js 配置
│   │   ├── package.json        # 依賴管理
│   │   ├── postcss.config.mjs  # PostCSS 配置
│   │   ├── tailwind.config.ts  # Tailwind 配置
│   │   ├── tsconfig.json       # TypeScript 配置
│   │   ├── README.md           # 專案說明
│   │   └── src/                # 源代碼
│   │       ├── ai/             # AI 功能
│   │       │   ├── dev.ts
│   │       │   ├── genkit.ts
│   │       │   └── flows/
│   │       │       └── workflow-optimization.ts
│   │       ├── app/            # Next.js App Router
│   │       │   ├── favicon.ico
│   │       │   ├── globals.css
│   │       │   ├── layout.tsx
│   │       │   └── page.tsx
│   │       ├── components/     # React 組件
│   │       │   ├── dashboard/
│   │       │   │   └── dashboard.tsx
│   │       │   ├── icons/
│   │       │   │   └── logo.tsx
│   │       │   ├── layout/
│   │       │   │   ├── header.tsx
│   │       │   │   └── sidebar.tsx
│   │       │   ├── partners/
│   │       │   │   ├── partner-form.tsx
│   │       │   │   ├── partner-list.tsx
│   │       │   │   └── partner-profile.tsx
│   │       │   ├── workflows/
│   │       │   │   ├── optimization-assistant.tsx
│   │       │   │   └── workflow-builder.tsx
│   │       │   └── ui/         # 基礎 UI 組件
│   │       │       ├── accordion.tsx
│   │       │       ├── alert-dialog.tsx
│   │       │       ├── alert.tsx
│   │       │       ├── avatar.tsx
│   │       │       ├── badge.tsx
│   │       │       ├── button.tsx
│   │       │       ├── calendar.tsx
│   │       │       ├── card.tsx
│   │       │       ├── carousel.tsx
│   │       │       ├── chart.tsx
│   │       │       ├── checkbox.tsx
│   │       │       ├── collapsible.tsx
│   │       │       ├── command.tsx
│   │       │       ├── context-menu.tsx
│   │       │       ├── dialog.tsx
│   │       │       ├── drawer.tsx
│   │       │       ├── dropdown-menu.tsx
│   │       │       ├── form.tsx
│   │       │       ├── heading.tsx
│   │       │       ├── hover-card.tsx
│   │       │       ├── input.tsx
│   │       │       ├── label.tsx
│   │       │       ├── menubar.tsx
│   │       │       ├── navigation-menu.tsx
│   │       │       ├── popover.tsx
│   │       │       ├── progress.tsx
│   │       │       ├── radio-group.tsx
│   │       │       ├── scroll-area.tsx
│   │       │       ├── select.tsx
│   │       │       ├── separator.tsx
│   │       │       ├── sheet.tsx
│   │       │       ├── skeleton.tsx
│   │       │       ├── slider.tsx
│   │       │       ├── switch.tsx
│   │       │       ├── table.tsx
│   │       │       ├── tabs.tsx
│   │       │       ├── textarea.tsx
│   │       │       ├── toast.tsx
│   │       │       ├── toaster.tsx
│   │       │       └── tooltip.tsx
│   │       ├── hooks/          # 自定義 Hooks
│   │       │   ├── use-mobile.tsx
│   │       │   └── use-toast.ts
│   │       └── lib/            # 工具函數
│   │           ├── data.ts
│   │           ├── firebase.ts
│   │           ├── types.ts
│   │           └── utils.ts
│   │
│   └── portfolio/               # 專案合約管理應用
│       ├── apphosting.yaml     # 部署配置
│       ├── components.json     # shadcn 配置
│       ├── firebase.json      # Firebase 配置
│       ├── firestore.rules    # Firestore 規則
│       ├── next.config.ts     # Next.js 配置
│       ├── package.json       # 依賴管理
│       ├── postcss.config.mjs # PostCSS 配置
│       ├── tailwind.config.ts # Tailwind 配置
│       ├── tsconfig.json      # TypeScript 配置
│       ├── README.md          # 專案說明
│       └── src/               # 源代碼
│           ├── ai/            # AI 功能
│           │   ├── dev.ts
│           │   ├── genkit.ts
│           │   └── flows/
│           │       ├── generate-subtasks-flow.ts
│           │       └── summarize-contract.ts
│           ├── app/           # Next.js App Router
│           │   ├── (app)/     # 應用路由組
│           │   │   ├── construct/
│           │   │   │   └── page.tsx
│           │   │   ├── dashboard/
│           │   │   │   └── page.tsx
│           │   │   ├── layout.tsx
│           │   │   └── projects/
│           │   │       ├── [id]/
│           │   │       │   └── page.tsx
│           │   │       └── page.tsx
│           │   ├── favicon.ico
│           │   ├── globals.css
│           │   ├── layout.tsx
│           │   └── page.tsx
│           ├── components/    # React 組件
│           │   ├── app/       # 應用組件
│           │   │   ├── ai-subtask-suggestions.tsx
│           │   │   ├── create-project-dialog.tsx
│           │   │   ├── project-progress-chart.tsx
│           │   │   ├── sidebar.tsx
│           │   │   └── task-item.tsx
│           │   ├── contract/  # 合約組件
│           │   │   ├── ai-summarizer-dialog.tsx
│           │   │   ├── contract-details-sheet.tsx
│           │   │   ├── contracts-table.tsx
│           │   │   ├── contract-logo.tsx
│           │   │   └── contract-stats-card.tsx
│           │   └── ui/        # 基礎 UI 組件
│           │       ├── accordion.tsx
│           │       ├── alert-dialog.tsx
│           │       ├── alert.tsx
│           │       ├── avatar.tsx
│           │       ├── badge.tsx
│           │       ├── button.tsx
│           │       ├── calendar.tsx
│           │       ├── card.tsx
│           │       ├── carousel.tsx
│           │       ├── chart.tsx
│           │       ├── checkbox.tsx
│           │       ├── collapsible.tsx
│           │       ├── command.tsx
│           │       ├── context-menu.tsx
│           │       ├── dialog.tsx
│           │       ├── drawer.tsx
│           │       ├── dropdown-menu.tsx
│           │       ├── form.tsx
│           │       ├── heading.tsx
│           │       ├── hover-card.tsx
│           │       ├── input.tsx
│           │       ├── label.tsx
│           │       ├── menubar.tsx
│           │       ├── navigation-menu.tsx
│           │       ├── popover.tsx
│           │       ├── progress.tsx
│           │       ├── radio-group.tsx
│           │       ├── scroll-area.tsx
│           │       ├── select.tsx
│           │       ├── separator.tsx
│           │       ├── sheet.tsx
│           │       ├── skeleton.tsx
│           │       ├── slider.tsx
│           │       ├── switch.tsx
│           │       ├── table.tsx
│           │       ├── tabs.tsx
│           │       ├── textarea.tsx
│           │       ├── toast.tsx
│           │       ├── toaster.tsx
│           │       └── tooltip.tsx
│           ├── context/       # React Context
│           │   └── ProjectContext.tsx
│           ├── hooks/         # 自定義 Hooks
│           │   ├── use-mobile.tsx
│           │   └── use-toast.ts
│           ├── lib/           # 工具函數
│           │   ├── data.ts
│           │   ├── firebase.ts
│           │   │   ├── types.ts
│           │   └── utils.ts
│           └── types/         # 類型定義
│               └── index.ts
│
├── packages/                    # 共用套件目錄
│   ├── shared-ui/             # 共用 UI 組件
│   │   ├── package.json       # 套件配置
│   │   ├── tsconfig.json      # TypeScript 配置
│   │   └── src/               # 源代碼
│   │       ├── components/    # 共用組件
│   │       │   ├── button/    # 按鈕組件
│   │       │   │   ├── button.tsx
│   │       │   │   └── index.ts
│   │       │   ├── card/      # 卡片組件
│   │       │   │   ├── card.tsx
│   │       │   │   └── index.ts
│   │       │   └── index.ts   # 主入口
│   │       ├── hooks/         # 共用 Hooks
│   │       │   └── use-toast.ts
│   │       └── utils/         # 共用工具
│   │           └── cn.ts
│   │
│   ├── shared-lib/            # 共用工具庫
│   │   ├── package.json       # 套件配置
│   │   ├── tsconfig.json      # TypeScript 配置
│   │   └── src/               # 源代碼
│   │       ├── constants/     # 常量
│   │       │   └── index.ts
│   │       ├── types/         # 共用類型
│   │       │   └── index.ts
│   │       ├── utils/         # 工具函數
│   │       │   ├── date.ts
│   │       │   ├── format.ts
│   │       │   └── validation.ts
│   │       └── index.ts       # 主入口
│   │
│   └── config/                # 共用配置
│       ├── package.json       # 套件配置
│       ├── tsconfig.json      # TypeScript 配置
│       ├── tailwind/          # Tailwind 配置
│       │   └── tailwind.base.ts
│       ├── eslint/            # ESLint 配置
│       │   └── index.js
│       └── typescript/        # TypeScript 配置
│           └── tsconfig.base.json
│
└── scripts/                    # 腳本目錄
    ├── setup.sh               # 環境設置腳本
    ├── build.sh               # 建置腳本
    ├── dev.sh                 # 開發腳本
    └── deploy.sh              # 部署腳本
```

## 實施步驟

### 第一階段：基礎架構設置

#### 1.1 創建工作區結構
```bash
# 在 D:\7s\ng-beta 根目錄執行
mkdir apps packages scripts docs
mkdir packages\shared-ui packages\shared-lib packages\config
mkdir packages\config\tailwind packages\config\eslint packages\config\typescript
```

#### 1.2 設置根目錄配置
**pnpm-workspace.yaml**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**package.json (根目錄)**
```json
{
  "name": "ng-beta",
  "version": "1.0.0",
  "description": "Next.js 四專案整合 Monorepo",
  "private": true,
  "packageManager": "pnpm@10.14.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r --parallel build",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format",
    "typecheck": "pnpm -r typecheck",
    "clean": "pnpm -r clean",
    "setup": "pnpm install && pnpm build",
    "dev:docuparse": "pnpm --filter @apps/docuparse dev",
    "dev:dashboard": "pnpm --filter @apps/dashboard-starter dev",
    "dev:partnerverse": "pnpm --filter @apps/partnerverse dev",
    "dev:portfolio": "pnpm --filter @apps/portfolio dev"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

**tsconfig.base.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@shared-ui/*": ["packages/shared-ui/src/*"],
      "@shared-lib/*": ["packages/shared-lib/src/*"],
      "@config/*": ["packages/config/*"]
    }
  },
  "exclude": ["node_modules", "dist", ".next", "out"]
}
```

### 第二階段：專案搬移與重構

#### 2.1 搬移專案目錄
```bash
# 使用 git mv 保留歷史記錄
git mv DocuParse\DocuParse apps\docuparse
git mv next-shadcn-dashboard-starter-main apps\dashboard-starter
git mv PartnerVerse\PartnerVerse apps\partnerverse
git mv Portfolio\Portfolio apps\portfolio
```

#### 2.2 更新各專案配置
**各專案的 tsconfig.json 更新**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**各專案的 package.json 更新**
```json
{
  "name": "@apps/[app-name]",
  "private": true,
  "scripts": {
    "dev": "next dev --port [PORT]",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 第三階段：共用套件開發

#### 3.1 shared-ui 套件
**packages/shared-ui/package.json**
```json
{
  "name": "@shared-ui",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

#### 3.2 shared-lib 套件
**packages/shared-lib/package.json**
```json
{
  "name": "@shared-lib",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "zod": "^3.0.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### 第四階段：依賴管理與版本統一

#### 4.1 依賴版本統一策略
- **React**: 統一使用 18.x 版本
- **Next.js**: 統一使用 15.x 版本
- **TypeScript**: 統一使用 5.x 版本
- **Tailwind CSS**: 統一使用 4.x 版本

#### 4.2 安裝與測試
```bash
# 安裝所有依賴
pnpm install

# 測試建置
pnpm build

# 啟動開發環境
pnpm dev
```

## 開發工作流程

### 單一專案開發
```bash
# 開發特定專案
pnpm --filter @apps/docuparse dev
pnpm --filter @apps/dashboard-starter dev
pnpm --filter @apps/partnerverse dev
pnpm --filter @apps/portfolio dev
```

### 全專案並行開發
```bash
# 同時啟動所有專案
pnpm dev
```

### 共用套件開發
```bash
# 開發共用套件
pnpm --filter @shared-ui dev
pnpm --filter @shared-lib dev
```

## 部署策略

### 獨立部署
每個專案保持獨立的部署配置：
- **DocuParse**: `apphosting.yaml`
- **PartnerVerse**: `apphosting.yaml`
- **Portfolio**: `firebase.json`, `firestore.rules`

### 統一部署腳本
```bash
# 建置所有專案
pnpm build

# 部署特定專案
pnpm --filter @apps/docuparse deploy
```

## 風險管理與對策

### 技術風險
1. **依賴衝突**: 使用 `pnpm why` 分析依賴關係，必要時使用 `pnpm.overrides`
2. **版本不一致**: 建立版本管理策略，定期同步更新
3. **建置失敗**: 建立 CI/CD 流程，自動化測試與建置

### 業務風險
1. **開發效率**: 保持各專案獨立性，避免過度耦合
2. **維護成本**: 建立文檔體系，規範開發流程
3. **團隊協作**: 建立代碼審查機制，確保代碼品質

## 驗收標準

### 功能驗收
- [ ] 所有專案可獨立啟動
- [ ] 所有專案可獨立建置
- [ ] 共用套件可正常引用
- [ ] 開發環境無衝突

### 性能驗收
- [ ] 建置時間不超過原專案總和的 120%
- [ ] 開發環境啟動時間不超過 30 秒
- [ ] 記憶體使用量合理

### 品質驗收
- [ ] 代碼通過 ESLint 檢查
- [ ] TypeScript 類型檢查通過
- [ ] 無重大安全漏洞

## 後續優化方向

### 短期優化 (1-2 個月)
1. 抽取更多共用組件
2. 優化建置流程
3. 建立開發文檔

### 中期優化 (3-6 個月)
1. 引入自動化測試
2. 建立設計系統
3. 優化開發體驗

### 長期優化 (6 個月以上)
1. 考慮引入 Nx 或 Turbo
2. 建立微前端架構
3. 引入更多現代化工具

## 總結

本整合計畫將四個 Next.js 專案統一為一個 pnpm workspaces monorepo，既保持了各專案的獨立性，又提供了共用資源的便利性。通過分階段實施，可以最大程度降低風險，確保專案穩定運行。

整合完成後，開發團隊將能夠：
- 統一管理依賴版本
- 共用 UI 組件和工具函數
- 提高開發效率
- 降低維護成本
- 為後續擴展奠定基礎