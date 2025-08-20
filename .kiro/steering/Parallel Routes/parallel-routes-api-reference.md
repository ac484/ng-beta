# Next.js Parallel Routes API 參考文檔

**版本:** Next.js 15+  
**描述:** Next.js 平行路由的完整 API 參考，包含所有可用的 API、Hooks 和配置選項  
**分類:** API Reference  
**複雜度:** Advanced  
**用途:** API 參考、開發指南、技術文檔  
**最後更新:** 2025-01-17

## 文件約定

平行路由使用的特殊文件約定和命名規則

### 槽位目錄
- **語法:** `@folderName`
- **描述:** 創建命名槽位，用於平行路由
- **範例:** `@analytics`, `@team`, `@documents`
- **用途:** 在 app 目錄中使用 `@` 符號前綴創建槽位
- **注意:** 槽位名稱不能包含特殊字符，建議使用描述性名稱

### 攔截路由
- **語法:** `(.)folder`, `(..)folder`, `(..)(..)folder`, `(...)folder`
- **描述:** 攔截路由以顯示模態框而不改變 URL
- **範例:**
  - `(.)photo` - 攔截同級路由
  - `(..)photo` - 攔截上一級路由
  - `(..)(..)photo` - 攔截兩級上路由
  - `(...)photo` - 攔截根級路由
- **用途:** 在槽位目錄內創建攔截路由文件夾

### 分組路由
- **語法:** `(folderName)`
- **描述:** 創建不影響 URL 結構的路由分組
- **範例:** `(dashboard)`, `(auth)`, `(marketing)`
- **用途:** 組織相關功能而不改變 URL 路徑

## 佈局組件 Props

平行路由佈局組件可用的 props 和類型定義

### 基本 Props

#### children
- **類型:** `React.ReactNode`
- **描述:** 隱式槽位，對應 `app/page.js` 的內容
- **必需:** 是
- **用途:** 渲染主要頁面內容
- **範例:**
```tsx
export default function Layout({ children }: { children: React.ReactNode }) { 
  return <main>{children}</main> 
}
```

#### slotName
- **類型:** `React.ReactNode`
- **描述:** 命名槽位的內容，對應 `@slotName` 目錄
- **必需:** 是
- **用途:** 渲染特定的命名槽位
- **範例:**
```tsx
export default function Layout({ children, analytics }: { 
  children: React.ReactNode; 
  analytics: React.ReactNode 
}) { 
  return ( 
    <div> 
      {children} 
      <aside>{analytics}</aside> 
    </div> 
  ) 
}
```

### 類型定義

#### 基本佈局
```tsx
interface LayoutProps { 
  children: React.ReactNode; 
}
```

#### 帶槽位
```tsx
interface LayoutProps { 
  children: React.ReactNode; 
  analytics: React.ReactNode; 
  team: React.ReactNode; 
}
```

#### 條件槽位
```tsx
interface LayoutProps { 
  children: React.ReactNode; 
  user?: React.ReactNode; 
  admin?: React.ReactNode; 
}
```

## 導航 Hooks

平行路由中可用的導航相關 React Hooks

### useSelectedLayoutSegment

**包:** `next/navigation`

**簽名:**
```tsx
useSelectedLayoutSegment(parallelRoutesKey?: string): string | null
```

**描述:** 讀取活動路由段，可選指定平行路由槽位

**參數:**
- `parallelRoutesKey` (可選): 平行路由槽位的鍵名，如 'auth'、'analytics'

**返回值:** `string | null` - 返回活動路由段名稱，如果沒有活動段則返回 null

**使用範例:**
```tsx
// 讀取當前佈局的活動段
const segment = useSelectedLayoutSegment()

// 讀取特定槽位的活動段
const authSegment = useSelectedLayoutSegment('auth')
```

**使用場景:** 條件渲染、導航高亮、狀態管理、用戶體驗優化

### useSelectedLayoutSegments

**包:** `next/navigation`

**簽名:**
```tsx
useSelectedLayoutSegments(parallelRoutesKey?: string): string[]
```

**描述:** 讀取活動路由段數組，可選指定平行路由槽位

**參數:**
- `parallelRoutesKey` (可選): 平行路由槽位的鍵名

**返回值:** `string[]` - 返回活動路由段名稱數組，如果沒有活動段則返回空數組

**使用範例:**
```tsx
// 讀取當前佈局的所有活動段
const segments = useSelectedLayoutSegments()

// 讀取特定槽位的活動段
const authSegments = useSelectedLayoutSegments('auth')
```

**使用場景:** 麵包屑導航、深度導航、路由分析、用戶體驗追蹤

### useRouter

**包:** `next/navigation`

**簽名:**
```tsx
useRouter(): AppRouterInstance
```

**描述:** 獲取 Next.js App Router 實例，用於編程式導航

**返回值:** `AppRouterInstance` - 返回路由器實例，包含導航方法和屬性

**方法:**

#### push
- **簽名:** `push(href: string, options?: NavigateOptions): void`
- **描述:** 導航到新頁面
- **使用:** `router.push('/dashboard')`

#### replace
- **簽名:** `replace(href: string, options?: NavigateOptions): void`
- **描述:** 替換當前頁面
- **使用:** `router.replace('/login')`

#### back
- **簽名:** `back(): void`
- **描述:** 返回上一頁
- **使用:** `router.back()`

#### forward
- **簽名:** `forward(): void`
- **描述:** 前進到下一頁
- **使用:** `router.forward()`

#### refresh
- **簽名:** `refresh(): void`
- **描述:** 刷新當前頁面
- **使用:** `router.refresh()`

**使用場景:** 模態框關閉、編程式導航、表單提交後導航、條件導航

## Link 組件

Next.js Link 組件在平行路由中的使用

**包:** `next/link`

### Props

#### href
- **類型:** `string | URL`
- **必需:** 是
- **描述:** 目標路由路徑

#### prefetch
- **類型:** `boolean | null`
- **必需:** 否
- **描述:** 是否預取目標頁面
- **預設:** `auto`

#### replace
- **類型:** `boolean`
- **必需:** 否
- **描述:** 是否替換當前歷史記錄
- **預設:** `false`

#### scroll
- **類型:** `boolean`
- **必需:** 否
- **描述:** 是否滾動到頁面頂部
- **預設:** `true`

#### shallow
- **類型:** `boolean`
- **必需:** 否
- **描述:** 是否使用淺層路由
- **預設:** `false`

### 使用範例

#### 基本導航
```tsx
<Link href="/dashboard">Dashboard</Link>
```

#### 模態框導航
```tsx
<Link href="/login">Open Login Modal</Link>
```

#### 禁用預取
```tsx
<Link href="/dashboard" prefetch={false}>Dashboard</Link>
```

## 特殊文件

平行路由中可用的特殊文件類型和用途

### default.tsx
- **描述:** 當槽位沒有匹配路由時顯示的默認內容
- **用途:** 處理未匹配的槽位狀態
- **範例:**
```tsx
export default function Default() { 
  return null 
}
```
- **最佳實踐:**
  - 為每個槽位創建 default.tsx
  - 返回 null 或默認內容
  - 考慮用戶體驗

### loading.tsx
- **描述:** 槽位載入時顯示的載入狀態
- **用途:** 提供用戶友好的載入體驗
- **範例:**
```tsx
export default function Loading() { 
  return <LoadingSpinner /> 
}
```
- **最佳實踐:**
  - 使用骨架屏或載入動畫
  - 保持與主內容一致的樣式
  - 避免過於複雜的載入狀態

### error.tsx
- **描述:** 槽位出錯時顯示的錯誤頁面
- **用途:** 處理槽位中的錯誤和異常
- **範例:**
```tsx
export default function Error({ error, reset }: { 
  error: Error; 
  reset: () => void 
}) { 
  return ( 
    <div> 
      <h2>Something went wrong!</h2> 
      <button onClick={reset}>Try again</button> 
    </div> 
  ) 
}
```
- **最佳實踐:**
  - 提供有用的錯誤信息
  - 提供恢復選項
  - 記錄錯誤信息用於調試

### not-found.tsx
- **描述:** 槽位路由不存在時顯示的 404 頁面
- **用途:** 處理槽位中的 404 情況
- **範例:**
```tsx
export default function NotFound() { 
  return <div>Slot content not found</div> 
}
```
- **最佳實踐:**
  - 提供清晰的錯誤信息
  - 提供導航選項
  - 保持與應用風格一致

## 路由處理器

在平行路由中創建 API 端點和路由處理器

### route.ts
- **描述:** 創建 API 端點和路由處理器
- **HTTP 方法:** GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

#### 基本 GET 請求
```tsx
export async function GET() { 
  return Response.json({ message: 'Hello from parallel route!' }) 
}
```

#### 帶參數的 GET 請求
```tsx
export async function GET(request: Request, { params }: { 
  params: Promise<{ slug: string }> 
}) { 
  const { slug } = await params 
  return Response.json({ slug }) 
}
```

#### POST 處理器
```tsx
export async function POST(request: Request) { 
  const body = await request.json() 
  return Response.json({ received: body }) 
}
```

### 配置選項

#### dynamic
- **類型:** `'auto' | 'force-dynamic' | 'error' | 'force-static'`
- **描述:** 控制路由的動態行為
- **預設:** `auto`

#### dynamicParams
- **類型:** `boolean`
- **描述:** 是否允許動態參數
- **預設:** `true`

#### revalidate
- **類型:** `false | 'force-cache' | 0 | number`
- **描述:** 控制緩存重新驗證
- **預設:** `false`

#### fetchCache
- **類型:** `'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'`
- **描述:** 控制 fetch 緩存行為
- **預設:** `auto`

#### runtime
- **類型:** `'nodejs' | 'edge'`
- **描述:** 指定運行時環境
- **預設:** `nodejs`

#### preferredRegion
- **類型:** `'auto' | 'global' | 'home' | string | string[]`
- **描述:** 指定首選部署區域
- **預設:** `auto`

## 中間件

在平行路由中使用 Next.js 中間件

**文件位置:** `middleware.ts` (根目錄)

**基本結構:**
```tsx
export function middleware(request: NextRequest) { 
  // 中間件邏輯 
}
```

**匹配器配置:**
```tsx
export const config = { 
  matcher: ['/dashboard/:path*'] 
}
```

### 範例

#### 基本中間件
```tsx
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) { 
  // 檢查認證
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

#### 條件路由重寫
```tsx
export function middleware(request: NextRequest) { 
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard-v2' + pathname, request.url))
  }
  return NextResponse.next()
}
```

## 配置選項

平行路由相關的 Next.js 配置選項

### experimental.ppr
- **類型:** `boolean`
- **描述:** 啟用部分預渲染
- **預設:** `false`
- **用途:** 在 `next.config.js` 中配置
- **範例:**
```js
module.exports = { 
  experimental: { 
    ppr: true 
  } 
}
```

### experimental.parallelRoutes
- **類型:** `boolean`
- **描述:** 啟用平行路由功能
- **預設:** `true`
- **用途:** 在 `next.config.js` 中配置
- **範例:**
```js
module.exports = { 
  experimental: { 
    parallelRoutes: true 
  } 
}
```

## TypeScript 類型定義

平行路由中常用的 TypeScript 類型定義

### React.ReactNode
- **描述:** React 組件可以渲染的任何內容
- **用途:** 槽位 props 的類型定義
- **範例:**
```tsx
interface SlotProps { 
  content: React.ReactNode 
}
```

### NextRequest
- **描述:** Next.js 擴展的 Request 對象
- **用途:** 中間件和路由處理器中的請求類型
- **範例:**
```tsx
export function middleware(request: NextRequest) { 
  // 中間件邏輯
}
```

### NextResponse
- **描述:** Next.js 擴展的 Response 對象
- **用途:** 中間件和路由處理器中的響應類型
- **範例:**
```tsx
return NextResponse.redirect(new URL('/login', request.url))
```

### AppRouterInstance
- **描述:** Next.js App Router 實例類型
- **用途:** useRouter hook 的返回類型
- **範例:**
```tsx
const router: AppRouterInstance = useRouter()
```
