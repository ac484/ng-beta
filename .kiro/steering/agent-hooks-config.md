---
inclusion: manual
contextKey: hooks
---

# Agent Hooks 配置指南

## 專案整合 Agent Hooks

本文件定義了專案整合過程中可用的 Agent Hooks，用於自動化開發流程和提高開發效率。

## 可用的 Agent Hooks

### 1. 程式碼品質檢查 Hook

**觸發條件**: 當儲存 TypeScript/JavaScript 檔案時
**功能**: 自動執行 ESLint 檢查和 Prettier 格式化

```json
{
  "name": "code-quality-check",
  "description": "自動檢查程式碼品質並修復格式問題",
  "trigger": {
    "type": "file-save",
    "patterns": ["**/*.{ts,tsx,js,jsx}"]
  },
  "actions": [
    {
      "type": "run-command",
      "command": "npm run lint:fix"
    },
    {
      "type": "run-command", 
      "command": "npm run format"
    }
  ]
}
```

### 2. 測試自動執行 Hook

**觸發條件**: 當修改元件或測試檔案時
**功能**: 自動執行相關的單元測試

```json
{
  "name": "auto-test-runner",
  "description": "當修改程式碼時自動執行相關測試",
  "trigger": {
    "type": "file-change",
    "patterns": [
      "src/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}"
    ]
  },
  "actions": [
    {
      "type": "run-command",
      "command": "npm test -- --watchAll=false --passWithNoTests"
    }
  ]
}
```

### 3. API 文件自動生成 Hook

**觸發條件**: 當修改 Route Handlers 時
**功能**: 自動更新 API 文件

```json
{
  "name": "api-docs-generator",
  "description": "當 API 路由變更時自動更新文件",
  "trigger": {
    "type": "file-save",
    "patterns": ["src/app/api/**/route.ts"]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "分析修改的 API 路由檔案，更新 docs/api-documentation.md 中的相關 API 文件。確保包含端點描述、參數、回應格式和範例。"
    }
  ]
}
```

### 4. 元件文件同步 Hook

**觸發條件**: 當建立或修改 UI 元件時
**功能**: 自動生成或更新元件文件

```json
{
  "name": "component-docs-sync",
  "description": "當元件變更時自動更新元件文件",
  "trigger": {
    "type": "file-save",
    "patterns": ["src/components/**/*.{ts,tsx}"]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "檢查修改的元件檔案，如果是新元件或有重大變更，請更新或建立對應的文件。包含元件用途、props 說明、使用範例和最佳實踐。"
    }
  ]
}
```

### 5. 型別定義同步 Hook

**觸發條件**: 當修改資料模型時
**功能**: 自動同步相關的型別定義

```json
{
  "name": "type-sync",
  "description": "當資料模型變更時同步相關型別定義",
  "trigger": {
    "type": "file-save",
    "patterns": ["src/types/**/*.ts", "src/lib/validations/**/*.ts"]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "檢查修改的型別定義檔案，確保所有相關的檔案都已更新對應的型別。檢查 API 路由、元件 props、store 狀態等是否需要同步更新。"
    }
  ]
}
```

### 6. 平行路由檢查 Hook

**觸發條件**: 當修改平行路由相關檔案時
**功能**: 檢查平行路由配置的一致性

```json
{
  "name": "parallel-routes-check",
  "description": "檢查平行路由配置的一致性",
  "trigger": {
    "type": "file-save",
    "patterns": [
      "src/app/(dashboard)/@*/**/*",
      "src/app/(dashboard)/layout.tsx"
    ]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "檢查平行路由的配置是否正確。確保所有槽都有對應的 default.tsx、loading.tsx、error.tsx 檔案，並且 layout.tsx 中正確處理所有槽的 props。"
    }
  ]
}
```

### 7. 依賴更新檢查 Hook

**觸發條件**: 當修改 package.json 時
**功能**: 檢查依賴衝突和安全性

```json
{
  "name": "dependency-check",
  "description": "檢查依賴更新和安全性問題",
  "trigger": {
    "type": "file-save",
    "patterns": ["package.json", "pnpm-lock.yaml"]
  },
  "actions": [
    {
      "type": "run-command",
      "command": "npm audit"
    },
    {
      "type": "agent-execution",
      "prompt": "檢查 package.json 的變更，確認新增或更新的依賴是否與現有依賴相容，是否有安全漏洞，並建議最佳實踐。"
    }
  ]
}
```

### 8. 環境配置驗證 Hook

**觸發條件**: 當修改環境配置檔案時
**功能**: 驗證環境變數配置

```json
{
  "name": "env-config-validation",
  "description": "驗證環境變數配置的正確性",
  "trigger": {
    "type": "file-save",
    "patterns": [".env*", "next.config.ts", "src/config/**/*.ts"]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "檢查環境配置檔案的變更，確保所有必要的環境變數都已定義，格式正確，並且沒有洩露敏感資訊。檢查 .env.example 是否需要更新。"
    }
  ]
}
```

### 9. 資料庫 Schema 同步 Hook

**觸發條件**: 當修改 Firestore 規則或資料模型時
**功能**: 同步資料庫 schema 和安全規則

```json
{
  "name": "database-schema-sync",
  "description": "同步資料庫 schema 和安全規則",
  "trigger": {
    "type": "file-save",
    "patterns": [
      "firestore.rules",
      "src/lib/database/**/*.ts",
      "src/types/**/*.ts"
    ]
  },
  "actions": [
    {
      "type": "agent-execution",
      "prompt": "檢查資料庫相關檔案的變更，確保 Firestore 安全規則與資料模型一致，並檢查是否需要更新相關的 API 端點和型別定義。"
    }
  ]
}
```

### 10. 效能監控 Hook

**觸發條件**: 手動觸發或定期執行
**功能**: 分析應用程式效能並提供最佳化建議

```json
{
  "name": "performance-analysis",
  "description": "分析應用程式效能並提供最佳化建議",
  "trigger": {
    "type": "manual"
  },
  "actions": [
    {
      "type": "run-command",
      "command": "npm run build"
    },
    {
      "type": "agent-execution",
      "prompt": "分析建置輸出，檢查 bundle 大小、程式碼分割效果、未使用的依賴等。提供效能最佳化建議，包括程式碼分割、懶載入、快取策略等。"
    }
  ]
}
```

## Hook 使用指南

### 啟用 Hooks

1. 開啟 Kiro 的 Agent Hooks 面板
2. 選擇要啟用的 hooks
3. 配置觸發條件和參數
4. 儲存配置

### 自定義 Hooks

您可以根據專案需求建立自定義 hooks：

```json
{
  "name": "custom-hook-name",
  "description": "Hook 描述",
  "trigger": {
    "type": "file-save|file-change|manual|schedule",
    "patterns": ["檔案模式"],
    "schedule": "cron 表達式 (僅用於 schedule 類型)"
  },
  "conditions": [
    {
      "type": "file-exists|git-branch|env-var",
      "value": "條件值"
    }
  ],
  "actions": [
    {
      "type": "run-command|agent-execution|file-operation",
      "command": "要執行的命令",
      "prompt": "Agent 執行提示",
      "operation": "檔案操作類型"
    }
  ]
}
```

### Hook 最佳實踐

1. **效能考量**: 避免在頻繁變更的檔案上設定過於複雜的 hooks
2. **錯誤處理**: 確保 hooks 有適當的錯誤處理機制
3. **條件檢查**: 使用條件檢查避免不必要的執行
4. **日誌記錄**: 啟用日誌記錄以便除錯和監控
5. **測試驗證**: 在開發環境中充分測試 hooks 的行為

### 故障排除

#### Hook 未觸發
- 檢查檔案模式是否正確
- 確認觸發條件是否滿足
- 查看 Kiro 日誌中的錯誤訊息

#### Hook 執行失敗
- 檢查命令是否正確
- 確認必要的依賴是否已安裝
- 查看詳細的錯誤日誌

#### 效能問題
- 減少 hook 的執行頻率
- 最佳化 hook 中的命令和操作
- 使用條件檢查避免不必要的執行

這些 Agent Hooks 將大大提高開發效率，確保程式碼品質，並自動化許多重複性任務。根據專案進展，您可以調整和擴展這些 hooks 以滿足特定需求。