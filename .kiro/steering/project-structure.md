# Project Structure

> **Auto-generated on:** 2025-08-20T18:34:26.196Z  
> **Purpose:** AI code generation reference - shows relevant project structure for development

## Directory Tree

```
├── assets/
├── public/
│   ├── assets/
│   │   └── sentry.svg
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── [[...sign-up]]/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── @analytics/
│   │   │   │   ├── default.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── @contracts/
│   │   │   ├── @documents/
│   │   │   │   ├── library/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── default.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── @partners/
│   │   │   │   ├── directory/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── default.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── @portfolio/
│   │   │   │   ├── projects/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── default.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── actions/
│   │   │   ├── contracts-actions.ts
│   │   │   ├── documents-actions.ts
│   │   │   ├── partners-actions.ts
│   │   │   └── projects-actions.ts
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── analytics/
│   │   ├── contracts/
│   │   ├── documents/
│   │   ├── kbar/
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── page-container.tsx
│   │   │   └── providers.tsx
│   │   ├── modal/
│   │   ├── partners/
│   │   ├── projects/
│   │   ├── shared/
│   │   │   ├── error-boundary.tsx
│   │   │   └── module-error-fallback.tsx
│   │   ├── ui/
│   │   │   ├── table/
│   │   │   │   ├── data-table-column-header.tsx
│   │   │   │   ├── data-table-date-filter.tsx
│   │   │   │   ├── data-table-faceted-filter.tsx
│   │   │   │   ├── data-table-pagination.tsx
│   │   │   │   ├── data-table-skeleton.tsx
│   │   │   │   ├── data-table-slider-filter.tsx
│   │   │   │   ├── data-table-toolbar.tsx
│   │   │   │   ├── data-table-view-options.tsx
│   │   │   │   └── data-table.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── heading.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   ├── icons.tsx
│   │   └── providers.tsx
│   ├── config/
│   │   └── data-table.ts
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── analytics-service.ts
│   │   │   ├── contract-service.ts
│   │   │   ├── data-sync-service.ts
│   │   │   ├── document-service.ts
│   │   │   ├── firebase-service.ts
│   │   │   ├── partner-service.ts
│   │   │   ├── project-service.ts
│   │   │   ├── relationship-service.ts
│   │   │   └── supabase-service.ts
│   │   ├── ai/
│   │   │   ├── services/
│   │   │   │   ├── contracts-ai.ts
│   │   │   │   ├── document-ai.ts
│   │   │   │   ├── partner-ai.ts
│   │   │   │   ├── projects-ai.ts
│   │   │   │   └── unified-ai-service.ts
│   │   │   ├── types/
│   │   │   │   └── ai.types.ts
│   │   │   ├── flows/
│   │   │   │   ├── document-analysis.ts
│   │   │   │   ├── generate-subtasks-flow.ts
│   │   │   │   ├── partner-suggestions.ts
│   │   │   │   └── summarize-contract.ts
│   │   │   └── genkit.ts
│   │   ├── firebase/
│   │   │   ├── app-check.ts
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── queries/
│   │   │   ├── contracts-queries.ts
│   │   │   ├── documents-queries.ts
│   │   │   ├── partners-queries.ts
│   │   │   └── projects-queries.ts
│   │   ├── supabase/
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── validations/
│   │   │   ├── contracts.schemas.ts
│   │   │   ├── document.schemas.ts
│   │   │   ├── partner.schemas.ts
│   │   │   └── projects.schemas.ts
│   │   ├── data-table.ts
│   │   ├── design-tokens.ts
│   │   ├── error-reporting.ts
│   │   ├── format.ts
│   │   ├── parsers.ts
│   │   ├── theme.ts
│   │   └── utils.ts
│   ├── styles/
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── contracts.types.ts
│   │   ├── data-table.ts
│   │   ├── document.types.ts
│   │   ├── index.ts
│   │   ├── partner.types.ts
│   │   └── projects.types.ts
│   ├── features/
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   │   ├── use-auth.ts
│   │   │   │   └── use-permissions.ts
│   │   │   ├── services/
│   │   │   │   └── auth-service.ts
│   │   │   └── types/
│   │   │       └── auth.types.ts
│   │   ├── contracts/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── documents/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── partners/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   └── shared/
│   ├── store/
│   ├── instrumentation-client.ts
│   ├── instrumentation.ts
│   └── middleware.ts
├── custom_modes/
│   ├── creative_instructions.md
│   ├── implement_instructions.md
│   ├── mode_switching_analysis.md
│   ├── plan_instructions.md
│   ├── reflect_archive_instructions.md
│   └── van_instructions.md
├── docs/
│   ├── Parallel Routes/
│   │   ├── parallel-routes-advanced-patterns.json
│   │   ├── parallel-routes-api-reference.json
│   │   ├── parallel-routes-best-practices.json
│   │   ├── parallel-routes-core-concepts.json
│   │   ├── parallel-routes-examples.json
│   │   ├── parallel-routes-implementation-guide.json
│   │   ├── parallel-routes-index.json
│   │   ├── parallel-routes-troubleshooting.json
│   │   └── README.md
│   ├── Partial Prerendering/
│   │   ├── advanced-patterns-and-use-cases.md
│   │   ├── api-reference-and-configuration.md
│   │   ├── configuration-and-setup.md
│   │   ├── documentation-index.md
│   │   ├── dynamic-apis-and-data-fetching.md
│   │   ├── implementation-examples.md
│   │   ├── nextjs-partial-prerendering-overview.md
│   │   ├── performance-and-optimization.md
│   │   ├── react-suspense-integration.md
│   │   ├── README.md
│   │   └── troubleshooting-and-debugging.md
│   ├── scripts/
│   │   ├── auto-structure-generation.md
│   │   └── commit-structure-solution.md
│   ├── Server Actions/
│   │   ├── 01-basics.json
│   │   ├── 02-advanced-patterns.json
│   │   ├── 03-form-handling.json
│   │   ├── 04-database-operations.json
│   │   ├── 05-authentication-security.json
│   │   ├── 06-performance-optimization.json
│   │   ├── 07-testing-debugging.json
│   │   ├── 08-real-world-examples.json
│   │   ├── 09-migration-guide.json
│   │   ├── 10-index.json
│   │   └── README.md
│   ├── architecture-update-summary.md
│   ├── bank.md
│   ├── integrated-file-structure.md
│   ├── integration-summary.md
│   ├── modern-architecture-guide.md
│   ├── modern-integration-plan.md
│   ├── project-structure.md
│   └── README.md
├── memory-bank/
│   ├── accessibility-guide.md
│   ├── ai-integration-patterns.md
│   ├── clerk-authentication-patterns.md
│   ├── deployment-strategies.md
│   ├── firebase-integration-patterns.md
│   ├── implementation-checklist.md
│   ├── internationalization-guide.md
│   ├── nextjs15-implementation-guide.md
│   ├── parallel-routes-patterns.md
│   ├── performance-monitoring-guide.md
│   ├── security-scanning-guide.md
│   ├── server-actions-patterns.md
│   ├── tanstack-query-integration-patterns.md
│   └── testing-strategies.md
├── run/
│   └── _/
│       ├── .gitignore
│       ├── applypatch-msg
│       ├── commit-msg
│       ├── h
│       ├── husky.sh
│       ├── post-applypatch
│       ├── post-checkout
│       ├── post-commit
│       ├── post-merge
│       ├── post-rewrite
│       ├── pre-applypatch
│       ├── pre-auto-gc
│       ├── pre-commit
│       ├── pre-merge-commit
│       ├── pre-push
│       ├── pre-rebase
│       └── prepare-commit-msg
├── scripts/
│   └── generate-project-structure.js
├── .env
├── .gitignore
├── .prettierrc
├── components.json
├── creative_mode_think_tool.md
├── env.example.txt
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── Implementation.md
├── MEMORY_BANK_OPTIMIZATIONS.md
├── memory_bank_upgrade_guide.md
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── RELEASE_NOTES.md
├── storage.rules
├── tsconfig.json
└── tsconfig.tsbuildinfo

```

## Key Directories

- **`src/`** - Main source code directory
- **`components/`** - Reusable UI components
- **`pages/`** - Page components and routing
- **`app/`** - App router components (Next.js 13+)
- **`lib/`** - Utility libraries and helpers
- **`utils/`** - Utility functions
- **`hooks/`** - Custom React hooks
- **`types/`** - TypeScript type definitions
- **`interfaces/`** - TypeScript interfaces
- **`services/`** - API and external service integrations
- **`api/`** - API routes and handlers
- **`config/`** - Configuration files
- **`constants/`** - Application constants
- **`helpers/`** - Helper functions
- **`middleware/`** - Request/response middleware
- **`public/`** - Static assets served directly
- **`assets/`** - Project assets (images, icons, etc.)
- **`images/`** - Image files
- **`icons/`** - Icon files
- **`fonts/`** - Font files
- **`styles/`** - Global styles and CSS modules
- **`themes/`** - Theme configurations
- **`layouts/`** - Layout components
- **`templates/`** - Template components

## Excluded Directories

The following directories are excluded as they are not relevant for AI code generation:

- `DocuParse/` - External tool, not part of main codebase
- `next-shadcn-dashboard-starter-main/` - Template/starter code, not relevant for current development
- `PartnerVerse/` - External project, not part of main codebase
- `Portfolio/` - External project, not part of main codebase
- `.git/` - Git version control metadata
- `.next/` - Next.js build output
- `node_modules/` - Dependencies (can be reinstalled)
- `.cursor/` - Editor-specific files
- `.vscode/` - Editor-specific configuration
- `dist/` - Build output directory
- `build/` - Build output directory
- `coverage/` - Test coverage reports
- `.nyc_output/` - Test coverage output
- `temp/` - Temporary files
- `tmp/` - Temporary files
- `logs/` - Log files
- `*.log/` - Log files
- `*.tmp/` - Temporary files
- `*.cache/` - Cache files

## File Types Included

- **Source Code:** .js, .jsx, .ts, .tsx, .vue, .svelte, .py, .java, .cpp, .c, .cs, .go, .rs, .php, .rb, .swift, .kt, .scala
- **Styles:** .css, .scss, .sass, .less
- **Configuration:** .json, .yaml, .yml, .toml, .ini, .env
- **Documentation:** .md, .txt
- **Build Tools:** .dockerfile, .gitignore, package.json, tsconfig.json, webpack.config.js, vite.config.js, tailwind.config.js

---

*This file is automatically generated before each commit to provide AI tools with current project structure information.*
