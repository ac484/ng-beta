# Git Commit 前自動生成專案結構樹 - 完整解決方案

## 問題描述

根據您的需求，需要實現：
1. 在 Git commit 前自動將專案結構樹保存到 `docs/.md` 文件中
2. 排除對 AI 生成代碼毫無參考價值的目錄
3. 使用最現代的方式實現
4. 已經安裝了 husky

## 解決方案概述

我們創建了一個完整的自動化系統，在每次 Git commit 前自動生成專案結構樹，並保存到 `docs/project-structure.md` 文件中。

## 核心組件

### 1. 專案結構生成腳本
**文件位置**: `scripts/generate-project-structure.js`

**功能特點**:
- 自動生成 4 層深度的專案結構樹
- 智能過濾無關目錄
- 專注於 AI 相關的文件類型
- 自動時間戳和元數據

### 2. Git Pre-commit Hook
**文件位置**: `.husky/pre-commit`

**觸發時機**: 每次 `git commit` 前自動執行

**執行順序**:
1. 生成專案結構樹
2. 運行 lint-staged 進行代碼格式化

### 3. NPM 腳本
**package.json 配置**:
```json
{
  "scripts": {
    "generate-structure": "node scripts/generate-project-structure.js"
  }
}
```

## 排除目錄配置

### 已排除的目錄
根據您的要求，以下目錄已被排除：

```javascript
const EXCLUDED_DIRS = [
  'DocuParse',                    // 外部工具，不屬於主要代碼庫
  'next-shadcn-dashboard-starter-main', // 模板/起始代碼
  'PartnerVerse',                 // 外部項目
  'Portfolio',                    // 外部項目
  '.git',                         // Git 版本控制元數據
  '.next',                        // Next.js 構建輸出
  'node_modules',                 // 依賴項（可重新安裝）
  '.cursor',                      // 編輯器特定文件
  '.vscode',                      // 編輯器配置
  '.kiro',                        // 工具特定配置
  'dist',                         // 構建輸出目錄
  'build',                        // 構建輸出目錄
  'coverage',                     // 測試覆蓋率報告
  '.nyc_output',                  // 測試覆蓋率輸出
  'temp',                         // 臨時文件
  'tmp',                          // 臨時文件
  'logs',                         // 日誌文件
  '*.log',                        // 日誌文件
  '*.tmp',                        // 臨時文件
  '*.cache'                       // 緩存文件
];
```

### 始終相關的目錄
以下目錄被優先考慮並始終包含：

```javascript
const ALWAYS_RELEVANT_DIRS = [
  'src', 'components', 'pages', 'app', 'lib', 'utils',
  'hooks', 'types', 'interfaces', 'services', 'api',
  'config', 'constants', 'helpers', 'middleware',
  'public', 'assets', 'images', 'icons', 'fonts',
  'styles', 'themes', 'layouts', 'templates'
];
```

## 包含的文件類型

### 源代碼
- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **其他語言**: `.py`, `.java`, `.cpp`, `.c`, `.cs`, `.go`, `.rs`, `.php`, `.rb`, `.swift`, `.kt`, `.scala`
- **前端框架**: `.vue`, `.svelte`

### 樣式和資源
- **CSS**: `.css`, `.scss`, `.sass`, `.less`
- **圖像**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`
- **字體**: `.woff`, `.woff2`, `.ttf`, `.otf`

### 配置文件
- **包管理器**: `package.json`, `pnpm-lock.yaml`, `yarn.lock`
- **構建工具**: `tsconfig.json`, `webpack.config.js`, `vite.config.js`
- **代碼質量**: `.eslintrc`, `.prettierrc`
- **環境配置**: `.env`, `.env.example`

### 文檔
- **Markdown**: `.md`
- **文本**: `.txt`
- **數據庫**: `.sql`, `.graphql`

## 使用方法

### 自動執行
每次 `git commit` 時會自動執行，無需手動操作。

### 手動執行
```bash
# 生成專案結構
npm run generate-structure

# 或直接使用 node
node scripts/generate-project-structure.js
```

### 測試 pre-commit hook
```bash
npx husky run .husky/pre-commit
```

## 輸出文件格式

生成的 `docs/project-structure.md` 文件包含：

1. **標題**: 時間戳和目的說明
2. **目錄樹**: 視覺化樹狀結構（4 層深度）
3. **關鍵目錄**: 重要目錄的描述
4. **排除目錄**: 排除目錄列表及原因
5. **文件類型**: 分類的文件擴展名
6. **頁腳**: 自動生成說明

## 自定義配置

### 添加新的排除目錄
編輯 `scripts/generate-project-structure.js`:

```javascript
const EXCLUDED_DIRS = [
  // 在此添加您的排除目錄
  'your-excluded-dir',
  '*.your-pattern'
];
```

### 添加新的文件類型
```javascript
const RELEVANT_EXTENSIONS = [
  // 在此添加您的文件擴展名
  '.your-extension',
  'your-important-file'
];
```

### 修改樹深度
```javascript
function generateTree(dir, prefix = '', maxDepth = 5, currentDepth = 0) {
  // 將 maxDepth 從 4 改為您偏好的深度
}
```

## 故障排除

### 常見問題

1. **腳本權限被拒絕**
   - Windows: 無需操作
   - Linux/Mac: `chmod +x scripts/generate-project-structure.js`

2. **Husky 不工作**
   - 確保 husky 已安裝: `npm install husky --save-dev`
   - 重新安裝 hooks: `npm run prepare`

3. **腳本錯誤**
   - 檢查 Node.js 版本: `node --version`
   - 驗證文件路徑是否存在
   - 檢查控制台輸出中的具體錯誤

## 對 AI 開發的益處

1. **上下文感知**: AI 工具獲得當前專案結構
2. **相關性聚焦**: 過濾掉噪音（node_modules、構建文件）
3. **最新信息**: 始終反映當前狀態
4. **結構化數據**: 乾淨、可解析的格式供 AI 使用
5. **自動維護**: 無需手動更新

## 與 AI 工具的集成

生成的結構文件專為以下工具設計：

- **GitHub Copilot**
- **Cursor AI**
- **Claude/GPT**
- **自定義 AI 助手**
- **代碼生成工具**

## 最佳實踐

1. **定期提交**: 每次提交都更新結構
2. **檢查輸出**: 偶爾檢查生成的文件
3. **自定義過濾器**: 根據專案需求調整排除項
4. **版本控制**: 將腳本包含在您的存儲庫中
5. **團隊共享**: 所有團隊成員都受益於一致的結構信息

## 技術特點

- **現代 Node.js**: 使用最新的 ES6+ 語法
- **跨平台兼容**: 支持 Windows、Linux、macOS
- **性能優化**: 智能過濾，只處理相關文件
- **錯誤處理**: 優雅的錯誤處理和日誌記錄
- **可擴展性**: 易於自定義和擴展

---

*此系統確保 AI 工具始終擁有當前、相關的專案結構信息，以實現最佳的代碼生成協助。*
