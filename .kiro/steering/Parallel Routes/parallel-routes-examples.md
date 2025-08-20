# Next.js Parallel Routes 實例與範例

**版本:** Next.js 15+  
**描述:** Next.js 平行路由的實用範例、代碼示例和常見使用場景  
**分類:** Examples  
**複雜度:** Intermediate  
**用途:** 實用範例、代碼參考、開發指南  
**最後更新:** 2025-01-17

## 基礎範例

平行路由的基本實現和常見模式

### 基本佈局組件
**描述:** 創建包含多個槽位的佈局組件

**TypeScript:**
```tsx
export default function Layout({ 
  children, 
  team, 
  analytics 
}: { 
  children: React.ReactNode; 
  analytics: React.ReactNode; 
  team: React.ReactNode 
}) { 
  return ( 
    <> 
      {children} 
      {team} 
      {analytics} 
    </> 
  ) 
}
```

**JavaScript:**
```jsx
export default function Layout({ children, team, analytics }) { 
  return ( 
    <> 
      {children} 
      {team} 
      {analytics} 
    </> 
  ) 
}
```

**文件結構:**
```
app/
  (dashboard)/
    @portfolio/           # Portfolio 模組槽
    @partners/            # PartnerVerse 模組槽
    @documents/           # DocuParse 模組槽
    @analytics/           # 分析模組槽
    layout.tsx            # 儀表板佈局
    page.tsx              # 儀表板首頁
```

### 條件渲染基於用戶角色
**描述:** 根據用戶角色條件性渲染不同的佈局

**TypeScript:**
```tsx
import { checkUserRole } from '@/lib/auth'

export default function Layout({ 
  user, 
  admin 
}: { 
  user: React.ReactNode; 
  admin: React.ReactNode 
}) { 
  const role = checkUserRole() 
  return role === 'admin' ? admin : user 
}
```

**JavaScript:**
```jsx
import { checkUserRole } from '@/lib/auth'

export default function Layout({ user, admin }) { 
  const role = checkUserRole() 
  return role === 'admin' ? admin : user 
}
```

## 模態框範例

使用平行路由實現模態框和彈出層

### 模態框佈局
**描述:** 創建模態框佈局組件

**TypeScript:**
```tsx
import Link from 'next/link'

export default function Layout({ 
  auth, 
  children 
}: { 
  auth: React.ReactNode; 
  children: React.ReactNode 
}) { 
  return ( 
    <> 
      <nav> 
        <Link href="/login">Open modal</Link> 
      </nav> 
      <div>{auth}</div> 
      <div>{children}</div> 
    </> 
  ) 
}
```

**JavaScript:**
```jsx
import Link from 'next/link'

export default function Layout({ auth, children }) { 
  return ( 
    <> 
      <nav> 
        <Link href="/login">Open modal</Link> 
      </nav> 
      <div>{auth}</div> 
      <div>{children}</div> 
    </> 
  ) 
}
```

### 模態框內容
**描述:** 模態框內容組件

**TypeScript:**
```tsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() { 
  return ( 
    <Modal> 
      <Login /> 
    </Modal> 
  ) 
}
```

**JavaScript:**
```jsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() { 
  return ( 
    <Modal> 
      <Login /> 
    </Modal> 
  ) 
}
```

### 關閉模態框
**描述:** 使用 Link 組件關閉模態框

**TypeScript:**
```tsx
import Link from 'next/link'

export function Modal({ children }: { children: React.ReactNode }) { 
  return ( 
    <> 
      <Link href="/">Close modal</Link> 
      <div>{children}</div> 
    </> 
  ) 
}
```

**JavaScript:**
```jsx
import Link from 'next/link'

export function Modal({ children }) { 
  return ( 
    <> 
      <Link href="/">Close modal</Link> 
      <div>{children}</div> 
    </> 
  ) 
}
```

### 使用 useRouter 關閉模態框
**描述:** 使用 useRouter hook 編程式關閉模態框

**TypeScript:**
```tsx
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) { 
  const router = useRouter()

  return ( 
    <> 
      <button onClick={() => { router.back() }}> 
        Close modal 
      </button> 
      <div>{children}</div> 
    </> 
  ) 
}
```

**JavaScript:**
```jsx
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }) { 
  const router = useRouter()

  return ( 
    <> 
      <button onClick={() => { router.back() }}> 
        Close modal 
      </button> 
      <div>{children}</div> 
    </> 
  ) 
}
```

## 標籤導航範例

創建獨立的標籤導航系統

### 標籤組佈局
**描述:** 在平行路由槽內創建獨立的標籤導航

**TypeScript:**
```tsx
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) { 
  return ( 
    <> 
      <nav> 
        <Link href="/page-views">Page Views</Link> 
        <Link href="/visitors">Visitors</Link> 
      </nav> 
      <div>{children}</div> 
    </> 
  ) 
}
```

**JavaScript:**
```jsx
import Link from 'next/link'

export default function Layout({ children }) { 
  return ( 
    <> 
      <nav> 
        <Link href="/page-views">Page Views</Link> 
        <Link href="/visitors">Visitors</Link> 
      </nav> 
      <div>{children}</div> 
    </> 
  ) 
}
```

## 預設處理範例

處理未匹配槽位的預設內容

### 預設空內容
**描述:** 確保槽位預設渲染 null

**TypeScript:**
```tsx
export default function Default() { 
  return null 
}
```

**JavaScript:**
```jsx
export default function Default() { 
  return null 
}
```

### 空頁面組件
**描述:** 返回 null 的頁面組件

**TypeScript:**
```tsx
export default function Page() { 
  return null 
}
```

**JavaScript:**
```jsx
export default function Page() { 
  return null 
}
```

### 捕獲所有路由
**描述:** 處理任何頁面的捕獲所有路由

**TypeScript:**
```tsx
export default function CatchAll() { 
  return null 
}
```

**JavaScript:**
```jsx
export default function CatchAll() { 
  return null 
}
```

## 導航 Hook 範例

使用導航相關的 React hooks

### useSelectedLayoutSegment
**描述:** 讀取活動路由段

**TypeScript:**
```tsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) { 
  const loginSegment = useSelectedLayoutSegment('auth') 
  // ... 
}
```

**JavaScript:**
```jsx
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }) { 
  const loginSegment = useSelectedLayoutSegment('auth') 
  // ... 
}
```
