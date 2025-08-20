---
inclusion: always
---

# 專案整合開發標準

## 專案概述

本專案是將四個獨立的 Next.js 應用程式整合成一個統一的現代化平台：
- **Portfolio**: 專案管理和作品集系統
- **PartnerVerse**: 合作夥伴管理系統
- **DocuParse**: 文件解析和處理系統
- **Dashboard Starter**: 現代化 UI 框架基礎

## 技術架構標準

### Next.js 15 App Router 規範
- **必須使用** Next.js 15 App Router，不得使用 Pages Router
- **必須使用** 平行路由 (Parallel Routes) 進行模組分離
- **必須使用** Server Actions 進行資料變更，不使用 API Routes
- **必須使用** Server Components 作為預設，僅在需要時使用 Client Components
- **必須使用** TanStack Query 進行客戶端狀態管理

### 平行路由結構規範
```typescript
// 標準平行路由佈局結構
export default function DashboardLayout({
  children,
  projects,
  contracts,
  partners,
  documents,
  analytics
}: {
  children: React.ReactNode
  projects: React.ReactNode
  contracts: React.ReactNode
  partners: React.ReactNode
  documents: React.ReactNode
  analytics: React.ReactNode
}) {
  // 實作條件渲染邏輯
}
```

### 檔案命名規範
- **路由檔案**: 使用 `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **元件檔案**: 使用 kebab-case，例如 `project-card.tsx`
- **Hook 檔案**: 使用 `use-` 前綴，例如 `use-projects.ts`
- **Service 檔案**: 使用 `-service` 後綴，例如 `project-service.ts`
- **Type 檔案**: 使用 `.types.ts` 後綴，例如 `project.types.ts`

## 程式碼組織標準

### 目錄結構規範
```
src/
├── app/                    # Next.js App Router
├── components/             # 共用元件
│   ├── ui/                # shadcn/ui 基礎元件
│   ├── layout/            # 佈局元件
│   ├── projects/          # 專案管理專用元件
│   ├── contracts/         # 合約管理專用元件
│   ├── partners/          # 夥伴管理專用元件
│   ├── documents/         # 文檔處理專用元件
│   └── shared/            # 跨模組共用元件
├── features/              # 功能模組
├── lib/                   # 工具函數和配置
├── hooks/                 # 全域 hooks
├── store/                 # 狀態管理
├── types/                 # 全域類型定義
└── config/                # 配置文件
```

### 模組化開發規範
每個功能模組必須包含：
- `components/`: 模組專用元件
- `hooks/`: 模組專用 hooks
- `services/`: 業務邏輯和 API 呼叫
- `types/`: 模組類型定義

## UI/UX 開發標準

### 設計系統
- **必須使用** shadcn/ui 作為基礎 UI 元件庫
- **必須使用** Tailwind CSS 4.0 進行樣式設計
- **必須遵循** 響應式設計原則
- **必須支援** 深色/淺色主題切換

### 元件開發規範
```typescript
// 標準元件結構
interface ComponentProps {
  // 明確的 props 類型定義
}

export function Component({ ...props }: ComponentProps) {
  // 元件實作
  return (
    <div className="responsive-classes">
      {/* 內容 */}
    </div>
  )
}
```

### 樣式規範
- 使用 Tailwind CSS 類別，避免自定義 CSS
- 遵循 mobile-first 響應式設計
- 使用語義化的 HTML 標籤
- 確保無障礙性 (a11y) 支援

## 狀態管理標準

### Zustand Store 規範
```typescript
// 標準 store 結構
interface StoreState {
  // 狀態定義
}

interface StoreActions {
  // 動作定義
}

export const useStore = create<StoreState & StoreActions>((set, get) => ({
  // 狀態初始值
  // 動作實作
}))
```

### 資料流規範
- 使用 TanStack Query 進行伺服器狀態管理
- 使用 Zustand 進行客戶端全域狀態管理
- 使用 React Context 進行局部狀態共享
- 使用 React Hook Form 進行表單狀態管理

## Server Actions 開發標準

### Server Actions 規範
```typescript
// 標準 Server Action 結構
'use server'

import { auth } from '@clerk/nextjs'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function createEntity(formData: FormData) {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
    const rawData = {
      field1: formData.get('field1') as string,
      field2: formData.get('field2') as string,
    }

    const validatedData = entitySchema.parse(rawData)
    const result = await entityService.create(validatedData)

    revalidateTag('entities')
    revalidatePath('/dashboard')
    
    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
```

### TanStack Query 整合規範
```typescript
// 標準 Query Hook 結構
export function useEntities() {
  const { userId } = useAuth()
  
  return useQuery({
    queryKey: ['entities', userId],
    queryFn: () => entityService.getAll(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// 標準 Mutation Hook 結構
export function useCreateEntity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createEntity,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['entities'] })
      }
    },
  })
}
```

### 資料驗證規範
- **必須使用** Zod 進行資料驗證
- **必須驗證** 所有 Server Action 輸入資料
- **必須處理** 錯誤情況並返回結構化回應
- **必須使用** revalidateTag 和 revalidatePath 管理快取

## 資料庫整合標準

### Firebase 整合規範
```typescript
// 標準 Firebase 服務結構
export class FirebaseService {
  private db = getFirestore()
  
  async create(collection: string, data: any) {
    // 實作
  }
  
  async read(collection: string, id: string) {
    // 實作
  }
  
  async update(collection: string, id: string, data: any) {
    // 實作
  }
  
  async delete(collection: string, id: string) {
    // 實作
  }
}
```

### 資料結構規範
- 使用統一的資料模型
- 實施資料正規化
- 建立適當的索引
- 實施資料驗證規則

## AI 功能整合標準

### Google Genkit 整合規範
```typescript
// 標準 AI 流程結構
export const aiFlow = defineFlow(
  {
    name: 'flowName',
    inputSchema: z.object({
      // 輸入驗證
    }),
    outputSchema: z.object({
      // 輸出驗證
    })
  },
  async (input) => {
    // AI 處理邏輯
    return result
  }
)
```

### AI 服務規範
- 統一的 AI 服務介面
- 適當的錯誤處理
- 結果快取機制
- 使用者回饋整合

## 認證與授權標準

### Clerk 整合規範
```typescript
// 標準認證檢查
import { auth } from '@clerk/nextjs'

export async function protectedAction() {
  const { userId } = auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  // 受保護的邏輯
}
```

### 權限管理規範
- 基於角色的存取控制 (RBAC)
- 細粒度權限檢查
- 安全的路由保護
- 適當的錯誤處理

## 效能最佳化標準

### 程式碼分割規範
```typescript
// 動態載入大型元件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

### 快取策略規範
- 使用 Next.js 內建快取
- 實施適當的 revalidation
- 使用 Redis 進行會話快取
- 最佳化資料庫查詢

## 測試標準

### 單元測試規範
```typescript
// 標準測試結構
describe('ComponentName', () => {
  it('should render correctly', () => {
    // 測試實作
  })
  
  it('should handle user interactions', () => {
    // 測試實作
  })
})
```

### 測試覆蓋率要求
- 元件測試覆蓋率 > 80%
- 工具函數測試覆蓋率 > 90%
- API 端點測試覆蓋率 > 85%
- E2E 測試覆蓋主要使用者流程

## 程式碼品質標準

### ESLint 規則
- 使用 Next.js 推薦配置
- 啟用 TypeScript 嚴格模式
- 自定義規則用於專案特定需求
- 自動修復可修復的問題

### Prettier 配置
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### Git 工作流程
- 使用 Conventional Commits
- 必須通過 CI/CD 檢查
- 程式碼審查必須通過
- 自動化測試必須通過

## 部署標準

### 環境配置
- 開發環境 (development)
- 測試環境 (staging)
- 生產環境 (production)

### 環境變數管理
```typescript
// 標準環境變數驗證
const env = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  // 其他必要變數
}).parse(process.env)
```

### 部署檢查清單
- [ ] 所有測試通過
- [ ] 程式碼審查完成
- [ ] 效能測試通過
- [ ] 安全掃描通過
- [ ] 文件更新完成

## 監控與日誌標準

### 錯誤追蹤
- 使用 Sentry 進行錯誤監控
- 實施結構化日誌
- 設定適當的警報
- 定期檢查錯誤報告

### 效能監控
- 監控 Core Web Vitals
- 追蹤 API 回應時間
- 監控資料庫效能
- 設定效能預算

## 文件標準

### 程式碼文件
- 所有公開 API 必須有 JSDoc
- 複雜邏輯必須有註解
- README 文件必須保持更新
- API 文件必須自動生成

### 使用者文件
- 功能使用指南
- 故障排除指南
- 常見問題解答
- 版本更新說明

這些標準確保整合專案的一致性、可維護性和高品質。所有開發人員都必須遵循這些標準，並在程式碼審查中嚴格執行。