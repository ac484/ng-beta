# Next.js 四專案整合開發指南

## 概述

本開發指南為 Next.js 四專案整合提供完整的開發流程、最佳實踐和實用工具，幫助開發團隊高效協作和維護專案品質。

## 開發環境設置

### 1. 系統要求
- **Node.js**: 18.x 或更高版本
- **包管理器**: pnpm 10.14.0 或更高版本
- **Git**: 2.30.0 或更高版本
- **編輯器**: VS Code 或 WebStorm

### 2. 環境變數配置
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. 開發工具安裝
```bash
# 全域安裝開發工具
npm install -g pnpm typescript ts-node nodemon

# 安裝 VS Code 擴展
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
```

## 專案結構規範

### 1. 目錄命名規範
```
src/
├── app/                    #
├── components/             # 可重用 UI 組件
├── lib/                    # 工具函數、配置、資料庫
├── public/                 # 靜態資源
├── styles/                 # 全局樣式
├── tests/                  # 測試文件
├── types/                  # 類型定義
└── utils/                  # 通用工具函數
```

### 2. 文件命名規範
- **組件**: `[ComponentName].tsx`
- **頁面**: `[PageName].tsx`
- **API 路由**: `[RouteName].ts`
- **工具函數**: `[FunctionName].ts`
- **類型定義**: `[Type].ts`

### 3. 代碼結構
```typescript
// app/actions.ts - Server Actions
'use server'

export async function createUser(data: FormData) {
  const user = await validateUser(data)
  return await db.users.create(user)
}

// app/components/UserForm.tsx - Client Component
'use client'

export function UserForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData)
    // 處理結果
  }
  
  return (
    <form action={handleSubmit}>
      {/* 表單內容 */}
    </form>
  )
}
```

## 現代開發架構

### 1. 全棧架構模式
```typescript
// app/actions.ts - Server Actions
'use server'

export async function createUser(data: FormData) {
  const user = await validateUser(data)
  return await db.users.create(user)
}

// app/components/UserForm.tsx - Client Component
'use client'

export function UserForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData)
    // 處理結果
  }
  
  return (
    <form action={handleSubmit}>
      {/* 表單內容 */}
    </form>
  )
}
```

### 2. 資料獲取策略
```typescript
// app/users/page.tsx - 伺服器組件資料獲取
async function UsersPage() {
  const users = await fetchUsers() // 伺服器端執行
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// app/components/UserCard.tsx - 客戶端組件
'use client'
export function UserCard({ user }: { user: User }) {
  const [likes, setLikes] = useState(user.likes)
  
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => setLikes(likes + 1)}>
        Likes: {likes}
      </button>
    </div>
  )
}
```

### 3. 狀態管理現代化
```typescript
// lib/store.ts - Zustand 狀態管理
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark'
  user: User | null
  setTheme: (theme: 'light' | 'dark') => void
  setUser: (user: User | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      user: null,
      setTheme: (theme) => set({ theme }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'app-storage',
    }
  )
)
```

## 性能優化技術

### 1. 圖片優化
```typescript
// app/components/OptimizedImage.tsx
import Image from 'next/image'

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={props.priority}
      {...props}
    />
  )
}
```

### 2. 字體優化
```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

### 3. 路由預載入
```typescript
// app/components/Navigation.tsx
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <Link href="/dashboard" prefetch={true}>
        Dashboard
      </Link>
      <Link href="/profile" prefetch={false}>
        Profile
      </Link>
    </nav>
  )
}
```

## 現代 UI 組件系統

### 1. Radix UI + shadcn/ui
```typescript
// components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 2. Tailwind CSS 4.0
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## 資料庫與 API 整合

### 1. Prisma + PostgreSQL
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        posts: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await prisma.user.create({
      data: body,
    })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
```

### 2. tRPC 類型安全 API
```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server'
import { Context } from './context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

// server/routers/user.ts
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input },
      })
    }),
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.user.create({
        data: input,
      })
    }),
})
```

## 認證與授權

### 1. NextAuth.js v5
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 驗證邏輯
        return null
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
}
```

### 2. Clerk 現代認證
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}

// app/components/UserButton.tsx
'use client'
import { UserButton } from '@clerk/nextjs'

export function UserButtonComponent() {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10"
        }
      }}
    />
  )
}
```

## 測試策略

### 1. Vitest + Testing Library
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive')
  })
})
```

### 2. Playwright E2E 測試
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign in', async ({ page }) => {
  await page.goto('/auth/signin')
  
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('text=Welcome')).toBeVisible()
})
```

## 部署與 DevOps

### 1. Vercel 部署
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

### 2. Docker 容器化
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 監控與分析

### 1. Sentry 錯誤追蹤
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})

// app/error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### 2. Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 開發工具與腳手架

### 1. 專案生成腳本
```bash
#!/bin/bash
# scripts/create-app.sh

APP_NAME=$1
if [ -z "$APP_NAME" ]; then
  echo "Usage: ./create-app.sh <app-name>"
  exit 1
fi

# 創建應用目錄
mkdir -p "apps/$APP_NAME"
cd "apps/$APP_NAME"

# 初始化 Next.js 專案
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

# 更新 package.json
npm pkg set name="@apps/$APP_NAME"

# 更新 tsconfig.json
cat > tsconfig.json << EOF
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
EOF

echo "App $APP_NAME created successfully!"
```

### 2. 開發環境腳本
```json
// package.json scripts
{
  "scripts": {
    "dev:all": "pnpm -r --parallel dev",
    "dev:app": "pnpm --filter @apps/$1 dev",
    "build:all": "pnpm -r --parallel build",
    "build:app": "pnpm --filter @apps/$1 build",
    "lint:all": "pnpm -r lint",
    "lint:app": "pnpm --filter @apps/$1 lint",
    "typecheck:all": "pnpm -r typecheck",
    "clean:all": "pnpm -r clean",
    "test:all": "pnpm -r test",
    "test:app": "pnpm --filter @apps/$1 test"
  }
}
```

## 最佳實踐總結

### 1. 架構原則
- **關注點分離**: 將業務邏輯、UI 組件、資料層分離
- **類型安全**: 全面使用 TypeScript，避免 any 類型
- **性能優先**: 使用 React Server Components 和 Streaming
- **可維護性**: 建立清晰的目錄結構和命名規範

### 2. 開發流程
- **代碼審查**: 強制代碼審查，確保品質
- **自動化測試**: 單元測試、整合測試、E2E 測試
- **持續整合**: 自動化建置、測試、部署
- **文檔維護**: 及時更新技術文檔和 API 文檔

### 3. 安全考慮
- **輸入驗證**: 使用 Zod 進行資料驗證
- **認證授權**: 實施適當的認證和授權機制
- **環境變數**: 敏感資訊使用環境變數管理
- **HTTPS**: 生產環境強制使用 HTTPS

## 結語

本技術指南涵蓋了 Next.js 15+ 的現代開發技術棧，為四專案整合提供了堅實的技術基礎。通過遵循這些最佳實踐，可以建立高性能、可維護、可擴展的現代化 Web 應用程式。

持續關注 Next.js 生態系統的發展，及時採用新技術和最佳實踐，將有助於保持專案的競爭力和技術領先性。
```

Now let me create a comprehensive dependency package list:

```markdown:docs/dependency-packages-guide.md
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
```
