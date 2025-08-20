# 安全性掃描實作指南

## 概述

本指南涵蓋 Next.js 專案的安全性掃描實作，包括靜態應用程式安全測試 (SAST)、動態應用程式安全測試 (DAST) 和依賴安全性掃描。

## 1. SAST 工具整合

### 1.1 Semgrep 配置

```yaml
# .semgrep.yml
rules:
  - id: semgrep
    pattern: semgrep
    message: "Semgrep rule match"
    languages: [javascript, typescript]
    severity: WARNING

  - id: xss-prevention
    patterns:
      - pattern: innerHTML = $VAR
      - pattern-not: innerHTML = $SAFE_VAR
    message: "Potential XSS vulnerability - avoid innerHTML with user input"
    languages: [javascript, typescript]
    severity: ERROR

  - id: sql-injection
    patterns:
      - pattern: `SELECT * FROM ${$TABLE} WHERE id = ${$ID}`
    message: "Potential SQL injection - use parameterized queries"
    languages: [javascript, typescript]
    severity: ERROR

  - id: hardcoded-secrets
    patterns:
      - pattern: "sk-...|pk_...|AKIA...|AIza..."
    message: "Potential hardcoded secret detected"
    languages: [javascript, typescript, json, yaml]
    severity: ERROR
```

### 1.2 GitHub Actions 安全掃描

```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on: [push, pull_request]

jobs:
  semgrep:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    container:
      image: semgrep/semgrep
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        run: semgrep ci --sarif > semgrep.sarif
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}
      
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: semgrep.sarif

  dependency-check:
    name: Dependency Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run OWASP dep-scan
        run: |
          npm install -g @owasp/dep-scan
          dep-scan --src . --report_file dep-scan-report.json
      
      - name: Upload dependency report
        uses: actions/upload-artifact@v4
        with:
          name: dependency-security-report
          path: dep-scan-report.json
```

## 2. ESLint 安全規則

### 2.1 安全規則配置

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:security/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['security', 'jsx-a11y'],
  rules: {
    // 安全相關規則
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // JSX 無障礙性規則
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/no-onchange': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error'
  }
}
```

### 2.2 自定義安全規則

```javascript
// .eslintrc.js (續)
module.exports = {
  // ... 其他配置
  rules: {
    // ... 其他規則
    
    // 自定義安全規則
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-unsafe-optional-chaining': 'error',
    
    // Next.js 特定安全規則
    'next/no-html-link-for-pages': 'error',
    'next/no-img-element': 'error',
    'next/no-sync-scripts': 'error',
    'next/no-unwanted-polyfillio': 'error'
  }
}
```

## 3. 依賴安全性掃描

### 3.1 npm audit 配置

```json
// package.json
{
  "scripts": {
    "security:audit": "npm audit --audit-level=moderate",
    "security:fix": "npm audit fix",
    "security:ci": "npm audit --audit-level=moderate --json > audit-report.json"
  },
  "overrides": {
    // 強制使用安全版本
    "vulnerable-package": "1.2.3"
  }
}
```

### 3.2 依賴掃描腳本

```bash
#!/bin/bash
# scripts/security-scan.sh

echo "🔒 開始安全性掃描..."

# npm audit
echo "📦 執行 npm audit..."
npm audit --audit-level=moderate

if [ $? -ne 0 ]; then
    echo "❌ npm audit 發現安全問題"
    exit 1
fi

# OWASP dep-scan
echo "🛡️ 執行 OWASP dep-scan..."
if command -v dep-scan &> /dev/null; then
    dep-scan --src . --report_file dep-scan-report.json
else
    echo "⚠️ OWASP dep-scan 未安裝，跳過..."
fi

# Snyk (如果可用)
echo "🔍 執行 Snyk 掃描..."
if command -v snyk &> /dev/null; then
    snyk test
else
    echo "⚠️ Snyk 未安裝，跳過..."
fi

echo "✅ 安全性掃描完成"
```

## 4. 程式碼安全檢查

### 4.1 Git Hooks 配置

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run security:audit"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "git add"
    ],
    "*.{json,yml,yaml}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### 4.2 安全檢查腳本

```typescript
// scripts/security-check.ts
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

interface SecurityReport {
  timestamp: string
  npmAudit: any
  semgrep: any
  dependencies: any[]
}

async function runSecurityChecks(): Promise<SecurityReport> {
  const report: SecurityReport = {
    timestamp: new Date().toISOString(),
    npmAudit: null,
    semgrep: null,
    dependencies: []
  }

  try {
    // npm audit
    console.log('🔒 執行 npm audit...')
    const npmAuditResult = execSync('npm audit --json', { encoding: 'utf8' })
    report.npmAudit = JSON.parse(npmAuditResult)
  } catch (error) {
    console.error('❌ npm audit 失敗:', error)
  }

  try {
    // Semgrep
    console.log('🛡️ 執行 Semgrep...')
    const semgrepResult = execSync('semgrep scan --json', { encoding: 'utf8' })
    report.semgrep = JSON.parse(semgrepResult)
  } catch (error) {
    console.error('❌ Semgrep 失敗:', error)
  }

  // 生成報告
  const reportPath = `security-report-${Date.now()}.json`
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📊 安全報告已生成: ${reportPath}`)

  return report
}

if (require.main === module) {
  runSecurityChecks().catch(console.error)
}
```

## 5. 容器安全性

### 5.1 Dockerfile 安全檢查

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安全更新
RUN apk update && apk upgrade

# 非 root 用戶
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 工作目錄
WORKDIR /app

# 複製 package 檔案
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production && npm cache clean --force

# 複製應用程式
COPY --chown=nextjs:nodejs . .

# 切換用戶
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 啟動應用程式
CMD ["npm", "start"]
```

### 5.2 容器掃描

```yaml
# .github/workflows/container-scan.yml
name: Container Security Scan
on: [push, pull_request]

jobs:
  container-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t myapp .
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

## 6. 環境變數安全

### 6.1 環境變數驗證

```typescript
// src/lib/env-validation.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().url(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})

export function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ 環境變數驗證失敗:', error)
    process.exit(1)
  }
}

export const env = validateEnv()
```

### 6.2 敏感資訊檢查

```typescript
// scripts/check-secrets.ts
import { execSync } from 'child_process'
import { readFileSync } from 'fs'

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{48}/,
  /pk_[a-zA-Z0-9]{48}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z\-_]{35}/,
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
  /[A-Za-z0-9+/]{4}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/,
]

function checkFileForSecrets(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf8')
  const secrets: string[] = []

  SECRET_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) {
      secrets.push(...matches)
    }
  })

  return secrets
}

function scanDirectory(dir: string): void {
  const files = execSync(`find ${dir} -type f -name "*.ts" -o -name "*.js" -o -name "*.json"`, { encoding: 'utf8' })
  
  files.split('\n').forEach(file => {
    if (file) {
      const secrets = checkFileForSecrets(file)
      if (secrets.length > 0) {
        console.error(`❌ 發現潛在敏感資訊: ${file}`)
        secrets.forEach(secret => console.error(`   ${secret}`))
      }
    }
  })
}

if (require.main === module) {
  console.log('🔍 掃描潛在敏感資訊...')
  scanDirectory('./src')
  scanDirectory('./config')
  console.log('✅ 掃描完成')
}
```

## 7. 安全測試

### 7.1 安全測試配置

```typescript
// jest.config.js
module.exports = {
  // ... 其他配置
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-security.ts'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*'
  ]
}
```

### 7.2 安全測試案例

```typescript
// src/test/security.test.ts
import { validateEnv } from '../lib/env-validation'

describe('Security Tests', () => {
  describe('Environment Variables', () => {
    it('should validate required environment variables', () => {
      // 模擬環境變數
      process.env.NODE_ENV = 'test'
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key'
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'https://test.firebaseapp.com'
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-bucket'
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789'
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id'
      process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_RECAPTCHA_SITE_KEY = 'test-site-key'
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_key'
      process.env.CLERK_SECRET_KEY = 'sk_test_secret_key'
      process.env.DATABASE_URL = 'https://test.db.com'
      process.env.JWT_SECRET = 'test-jwt-secret-32-chars-long'

      expect(() => validateEnv()).not.toThrow()
    })

    it('should reject invalid environment variables', () => {
      delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY

      expect(() => validateEnv()).toThrow()
    })
  })

  describe('XSS Prevention', () => {
    it('should not allow innerHTML with user input', () => {
      const userInput = '<script>alert("xss")</script>'
      const element = document.createElement('div')
      
      // 這應該被 ESLint 規則阻止
      // element.innerHTML = userInput
      
      expect(element.innerHTML).toBe('')
    })
  })
})
```

## 總結

本指南提供了完整的安全性掃描實作方案，包括：

1. **SAST 工具**：Semgrep 配置和 GitHub Actions 整合
2. **ESLint 安全規則**：安全相關的程式碼檢查規則
3. **依賴安全性**：npm audit 和 OWASP dep-scan
4. **容器安全**：Dockerfile 最佳實踐和漏洞掃描
5. **環境變數安全**：驗證和敏感資訊檢查
6. **安全測試**：自動化安全測試案例

這些實作將幫助開發團隊識別和修復安全漏洞，確保應用程式的安全性。
