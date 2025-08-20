# Next.js 現代技術指南 2024-2025

## 概述

本指南涵蓋 Next.js 15+ 的最新技術棧、最佳實踐和現代開發模式，為四專案整合提供技術基礎。

## 核心技術棧

### 1. Next.js 15 App Router
- **App Router**: 基於文件系統的路由，支援 React Server Components
- **Server Components**: 預設伺服器端渲染，提升性能和 SEO
- **Streaming**: 漸進式內容載入，改善使用者體驗
- **Turbopack**: 極速建置工具，開發體驗提升 700x

### 2. React 19 新特性
- **Actions**: 伺服器端表單處理
- **use() Hook**: 資料獲取和 Promise 處理
- **Document Metadata**: 動態 meta 標籤管理
- **Asset Loading**: 智能資源預載入

### 3. TypeScript 5.x
- **Decorators**: 元數據編程支援
- **Const Type Parameters**: 更精確的泛型推斷
- **Multiple Config Files**: 專案級別配置繼承
- **Strict Mode**: 更嚴格的類型檢查

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
