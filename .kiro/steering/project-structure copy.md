# Project Structure

> **Auto-generated on:** 2025-08-20T10:21:22.294Z  
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
│   │   │   └── sign-up/
│   │   ├── (dashboard)/
│   │   │   ├── @analytics/
│   │   │   ├── @documents/
│   │   │   ├── @partners/
│   │   │   └── @portfolio/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── documents/
│   │   ├── layout/
│   │   ├── partners/
│   │   ├── shared/
│   │   └── ui/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   │   ├── services/
│   │   │   ├── analytics-service.ts
│   │   │   ├── contract-service.ts
│   │   │   ├── document-service.ts
│   │   │   ├── firebase-service.ts
│   │   │   ├── partner-service.ts
│   │   │   ├── project-service.ts
│   │   │   └── supabase-service.ts
│   │   ├── ai/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── flows/
│   │   │   └── genkit.ts
│   │   ├── auth/
│   │   │   ├── clerk.ts
│   │   │   ├── middleware.ts
│   │   │   └── permissions.ts
│   │   ├── firebase/
│   │   │   ├── app-check.ts
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── supabase/
│   │   │   ├── auth.ts
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   └── validations/
│   ├── types/
│   └── features/
│       ├── documents/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── types/
│       ├── partners/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── types/
│       └── shared/
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
│   │   ├── advanced-patterns-and-use-cases.json
│   │   ├── api-reference-and-configuration.json
│   │   ├── configuration-and-setup.json
│   │   ├── documentation-index.json
│   │   ├── dynamic-apis-and-data-fetching.json
│   │   ├── implementation-examples.json
│   │   ├── nextjs-partial-prerendering-overview.json
│   │   ├── performance-and-optimization.json
│   │   ├── react-suspense-integration.json
│   │   ├── README.md
│   │   └── troubleshooting-and-debugging.json
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
├── Implementation.md
├── MEMORY_BANK_OPTIMIZATIONS.md
├── memory_bank_upgrade_guide.md
├── next.config.ts
├── package copy.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── RELEASE_NOTES.md
└── tsconfig.json

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
