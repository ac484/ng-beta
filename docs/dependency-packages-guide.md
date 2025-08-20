# Next.js 現代依賴包清單指南

## 概述

本指南提供 Next.js 15+ 專案的完整依賴包清單，涵蓋核心功能、UI 組件、工具庫等各個方面，為四專案整合提供依賴管理參考。

## 核心依賴包

### 1. Next.js 核心
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. 樣式與 UI 框架
```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "tailwindcss-animate": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^3.0.0"
  },
  "devDependencies": {
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
```

### 3. UI 組件庫
```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0"
  }
}
```

### 4. 表單處理
```json
{
  "dependencies": {
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^4.1.0",
    "zod": "^3.24.0"
  }
}
```

### 5. 狀態管理
```json
{
  "dependencies": {
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-query-devtools": "^5.0.0"
  }
}
```

### 6. 圖表與視覺化
```json
{
  "dependencies": {
    "recharts": "^2.15.0",
    "lucide-react": "^0.476.0",
    "@tabler/icons-react": "^3.31.0"
  }
}
```

### 7. 資料表格
```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.21.0",
    "cmdk": "^1.1.0"
  }
}
```

### 8. 拖拽功能
```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/modifiers": "^7.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.0"
  }
}
```

### 9. 認證與授權
```json
{
  "dependencies": {
    "@clerk/nextjs": "^6.12.0",
    "@clerk/themes": "^2.2.0",
    "next-auth": "^5.0.0",
    "@auth/prisma-adapter": "^1.0.0"
  }
}
```

### 10. 資料庫與 ORM
```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "firebase": "^11.9.0",
    "firebase-admin": "^12.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

### 11. API 與資料獲取
```json
{
  "dependencies": {
    "@trpc/server": "^11.0.0",
    "@trpc/client": "^11.0.0",
    "@trpc/react-query": "^11.0.0",
    "@trpc/next": "^11.0.0",
    "axios": "^1.6.0",
    "swr": "^2.2.0"
  }
}
```

### 12. 工具函數
```json
{
  "dependencies": {
    "date-fns": "^4.1.0",
    "uuid": "^11.0.0",
    "nanoid": "^5.0.0",
    "lodash-es": "^4.17.0",
    "ramda": "^0.29.0"
  },
  "devDependencies": {
    "@types/uuid": "^10.0.0",
    "@types/lodash-es": "^4.17.0"
  }
}
```

### 13. 動畫與交互
```json
{
  "dependencies": {
    "framer-motion": "^11.17.0",
    "motion": "^11.17.0",
    "react-spring": "^9.7.0",
    "react-transition-group": "^4.4.0"
  }
}
```

### 14. 通知與反饋
```json
{
  "dependencies": {
    "sonner": "^1.7.0",
    "react-hot-toast": "^2.4.0",
    "react-toastify": "^10.0.0"
  }
}
```

### 15. 路由與導航
```json
{
  "dependencies": {
    "next-navigation": "^0.0.1",
    "nuqs": "^2.4.0"
  }
}
```

### 16. 搜尋與過濾
```json
{
  "dependencies": {
    "match-sorter": "^8.0.0",
    "sort-by": "^1.2.0"
  },
  "devDependencies": {
    "@types/sort-by": "^1.2.0"
  }
}
```

### 17. 檔案處理
```json
{
  "dependencies": {
    "react-dropzone": "^14.3.0",
    "multer": "^1.4.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/multer": "^1.4.0"
  }
}
```

### 18. 國際化
```json
{
  "dependencies": {
    "next-intl": "^3.0.0",
    "react-i18next": "^14.0.0",
    "i18next": "^23.0.0"
  }
}
```

### 19. 測試框架
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### 20. 開發工具
```json
{
  "devDependencies": {
    "eslint": "^8.48.0",
    "eslint-config-next": "^15.1.0",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "husky": "^9.1.0",
    "lint-staged": "^15.2.0"
  }
}
```

### 21. 監控與分析
```json
{
  "dependencies": {
    "@sentry/nextjs": "^9.19.0",
    "@vercel/analytics": "^1.0.0",
    "@vercel/speed-insights": "^1.0.0"
  }
}
```

### 22. AI 與機器學習
```json
{
  "dependencies": {
    "genkit": "^1.14.0",
    "@genkit-ai/googleai": "^1.14.0",
    "@genkit-ai/next": "^1.14.0",
    "openai": "^4.0.0",
    "langchain": "^0.1.0"
  }
}
```

## 專案特定依賴

### DocuParse 專案
```json
{
  "dependencies": {
    "pdf-parse": "^1.1.0",
    "mammoth": "^1.6.0",
    "xlsx": "^0.18.0",
    "csv-parser": "^3.0.0"
  }
}
```

### Dashboard Starter 專案
```json
{
  "dependencies": {
    "kbar": "^0.1.0-beta.45",
    "nextjs-toploader": "^3.7.0",
    "react-responsive": "^10.0.0",
    "react-resizable-panels": "^2.1.0"
  }
}
```

### PartnerVerse 專案
```json
{
  "dependencies": {
    "react-flow-renderer": "^10.3.0",
    "@xyflow/react": "^11.0.0",
    "dagre": "^0.8.5"
  }
}
```

### Portfolio 專案
```json
{
  "dependencies": {
    "firebase": "^11.9.0",
    "firebase-admin": "^12.0.0",
    "react-beautiful-dnd": "^13.1.0"
  }
}
```

## 依賴版本管理策略

### 1. 版本鎖定策略
```json
{
  "overrides": {
    "@types/react": "19.0.1",
    "@types/react-dom": "19.0.2",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

### 2. 開發依賴分離
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.48.0",
    "prettier": "^3.4.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### 3. 工作區依賴管理
```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

# 根目錄 package.json
{
  "pnpm": {
    "overrides": {
      "react": "19.0.0",
      "react-dom": "19.0.0"
    }
  }
}
```

## 安裝與更新腳本

### 1. 批量安裝腳本
```bash
#!/bin/bash
# scripts/install-deps.sh

echo "Installing dependencies for all packages..."

# 安裝根目錄依賴
pnpm install

# 安裝所有工作區依賴
pnpm -r install

echo "All dependencies installed successfully!"
```

### 2. 依賴更新腳本
```bash
#!/bin/bash
# scripts/update-deps.sh

echo "Updating dependencies for all packages..."

# 更新根目錄依賴
pnpm update

# 更新所有工作區依賴
pnpm -r update

# 檢查過時依賴
pnpm -r outdated

echo "Dependencies updated successfully!"
```

### 3. 依賴檢查腳本
```bash
#!/bin/bash
# scripts/check-deps.sh

echo "Checking dependencies for all packages..."

# 檢查依賴衝突
pnpm why react
pnpm why react-dom

# 檢查過時依賴
pnpm -r outdated

# 檢查安全漏洞
pnpm audit

echo "Dependency check completed!"
```

## 最佳實踐建議

### 1. 依賴選擇原則
- **穩定性優先**: 選擇維護活躍、社區支持好的套件
- **功能完整**: 避免功能重複的套件
- **性能考慮**: 選擇輕量級、高效的套件
- **類型支持**: 優先選擇有完整 TypeScript 支持的套件

### 2. 版本管理策略
- **主版本**: 謹慎升級，確保相容性
- **次版本**: 定期升級，獲得新功能和修復
- **修補版本**: 及時升級，修復安全漏洞
- **鎖定版本**: 生產環境鎖定具體版本號

### 3. 依賴審查流程
- **定期審查**: 每月檢查依賴更新
- **安全掃描**: 使用 `pnpm audit` 檢查安全漏洞
- **相容性測試**: 升級後進行完整測試
- **回滾準備**: 準備快速回滾方案

### 4. 性能優化
- **樹搖優化**: 使用 ES 模組和 tree-shaking
- **按需載入**: 實現組件和功能的按需載入
- **打包分析**: 使用 `@next/bundle-analyzer` 分析打包大小
- **代碼分割**: 合理使用動態導入和路由分割

## 結語

本依賴包清單提供了 Next.js 15+ 專案的完整依賴管理方案，涵蓋了從核心功能到專案特定需求的所有方面。通過合理的依賴選擇和版本管理，可以建立穩定、高效、可維護的現代化 Web 應用程式。

建議根據專案實際需求選擇合適的依賴包，並建立完善的依賴管理流程，確保專案的長期穩定性和可維護性。
