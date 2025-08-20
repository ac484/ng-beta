# Next.js 15 國際化實作指南

## 概述

本指南涵蓋 Next.js 15 應用程式的國際化實作，使用 next-intl 庫實現多語言支援、本地化路由和 SEO 優化。

## 1. 安裝和基本配置

### 1.1 安裝依賴

```bash
npm install next-intl
```

### 1.2 Next.js 配置

```typescript
// next.config.ts
import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  // 其他 Next.js 配置
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
```

### 1.3 國際化配置

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // 支援的語言
  locales: ['en', 'zh-TW', 'ja'],
  
  // 預設語言
  defaultLocale: 'en',
  
  // 本地化策略
  localePrefix: 'as-needed'
})

// 語言顯示名稱
export const localeNames = {
  'en': 'English',
  'zh-TW': '繁體中文',
  'ja': '日本語'
}

// 語言方向
export const localeDirections = {
  'en': 'ltr',
  'zh-TW': 'ltr',
  'ja': 'ltr'
}
```

## 2. 訊息檔案管理

### 2.1 訊息檔案結構

```json
// src/messages/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "rememberMe": "Remember Me"
  },
  "forms": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordMinLength": "Password must be at least 8 characters",
    "passwordsDoNotMatch": "Passwords do not match"
  },
  "errors": {
    "notFound": "Page not found",
    "serverError": "Internal server error",
    "unauthorized": "You are not authorized to access this resource",
    "forbidden": "Access forbidden"
  }
}
```

```json
// src/messages/zh-TW.json
{
  "common": {
    "loading": "載入中...",
    "error": "發生錯誤",
    "retry": "重試",
    "cancel": "取消",
    "confirm": "確認",
    "save": "儲存",
    "delete": "刪除",
    "edit": "編輯",
    "view": "檢視"
  },
  "navigation": {
    "home": "首頁",
    "about": "關於",
    "contact": "聯絡我們",
    "dashboard": "儀表板",
    "profile": "個人資料",
    "settings": "設定"
  },
  "auth": {
    "signIn": "登入",
    "signUp": "註冊",
    "signOut": "登出",
    "email": "電子郵件",
    "password": "密碼",
    "forgotPassword": "忘記密碼？",
    "rememberMe": "記住我"
  },
  "forms": {
    "required": "此欄位為必填",
    "invalidEmail": "請輸入有效的電子郵件地址",
    "passwordMinLength": "密碼至少需要 8 個字元",
    "passwordsDoNotMatch": "密碼不相符"
  },
  "errors": {
    "notFound": "找不到頁面",
    "serverError": "伺服器內部錯誤",
    "unauthorized": "您沒有權限存取此資源",
    "forbidden": "存取被拒絕"
  }
}
```

### 2.2 請求配置

```typescript
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // 獲取請求的語言
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Taipei',
    now: new Date(),
  }
})
```

## 3. 中間件配置

### 3.1 國際化中間件

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // 匹配所有路徑，除了 API 路由和靜態檔案
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/((?!_next|_vercel|.*\\..*).*)'
  ]
}
```

### 3.2 語言檢測邏輯

```typescript
// src/lib/locale-detection.ts
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'

export function detectLocale(): string {
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language')
  
  if (acceptLanguage) {
    // 解析 Accept-Language 標頭
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .map(lang => lang.split('-')[0])
    
    // 找到第一個支援的語言
    for (const lang of languages) {
      if (routing.locales.includes(lang as any)) {
        return lang
      }
    }
  }
  
  return routing.defaultLocale
}

export function getPreferredLocale(): string {
  if (typeof window !== 'undefined') {
    // 客戶端：從 localStorage 或 navigator.language 獲取
    const stored = localStorage.getItem('preferred-locale')
    if (stored && routing.locales.includes(stored as any)) {
      return stored
    }
    
    const browserLang = navigator.language.split('-')[0]
    if (routing.locales.includes(browserLang as any)) {
      return browserLang
    }
  }
  
  return routing.defaultLocale
}
```

## 4. 佈局和路由配置

### 4.1 語言佈局

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // 驗證語言
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // 獲取訊息
  const messages = await getMessages()
  
  return (
    <html lang={locale} dir={localeDirections[locale as keyof typeof localeDirections]}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

// 生成靜態參數
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
```

### 4.2 導航組件

```typescript
// src/components/LocaleSwitcher.tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { localeNames } from '@/i18n/routing'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('common')

  const handleLocaleChange = (newLocale: string) => {
    // 儲存偏好語言
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale)
    }
    
    // 導航到新語言
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as keyof typeof localeNames]}
          </option>
        ))}
      </select>
    </div>
  )
}
```

## 5. 組件國際化

### 5.1 使用翻譯 Hook

```typescript
// src/components/Header.tsx
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LocaleSwitcher } from './LocaleSwitcher'

export function Header() {
  const t = useTranslations('navigation')

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">{t('home')}</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/about"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                {t('about')}
              </Link>
              <Link
                href="/contact"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300"
              >
                {t('contact')}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <LocaleSwitcher />
          </div>
        </div>
      </nav>
    </header>
  )
}
```

### 5.2 表單驗證訊息

```typescript
// src/components/LoginForm.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function LoginForm() {
  const t = useTranslations('auth')
  const f = useTranslations('forms')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 處理表單提交
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder={t('email')}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('password')}
        </label>
        <input
          type="password"
          id="password"
          required
          minLength={8}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder={t('password')}
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {t('signIn')}
      </button>
    </form>
  )
}
```

## 6. 日期和數字格式化

### 6.1 日期格式化

```typescript
// src/components/DateDisplay.tsx
'use client'

import { useFormatter } from 'next-intl'

interface DateDisplayProps {
  date: Date
  format?: 'short' | 'long' | 'relative'
}

export function DateDisplay({ date, format = 'short' }: DateDisplayProps) {
  const formatDate = useFormatter()
  
  const formatOptions = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    } as const,
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    } as const,
    relative: undefined
  }
  
  if (format === 'relative') {
    return formatDate.relativeTime(date)
  }
  
  return formatDate.dateTime(date, formatOptions[format])
}
```

### 6.2 數字格式化

```typescript
// src/components/NumberDisplay.tsx
'use client'

import { useFormatter } from 'next-intl'

interface NumberDisplayProps {
  value: number
  format?: 'decimal' | 'currency' | 'percent'
  currency?: string
}

export function NumberDisplay({ 
  value, 
  format = 'decimal', 
  currency = 'TWD' 
}: NumberDisplayProps) {
  const formatNumber = useFormatter()
  
  switch (format) {
    case 'currency':
      return formatNumber.number(value, {
        style: 'currency',
        currency
      })
    case 'percent':
      return formatNumber.number(value, {
        style: 'percent'
      })
    default:
      return formatNumber.number(value)
  }
}
```

## 7. SEO 和元資料

### 7.1 多語言元資料

```typescript
// src/app/[locale]/page.tsx
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  
  return {
    title: t('home.title'),
    description: t('home.description'),
    alternates: {
      languages: {
        'en': '/en',
        'zh-TW': '/zh-TW',
        'ja': '/ja'
      }
    }
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('HomePage')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### 7.2 語言切換連結

```typescript
// src/components/LanguageAlternates.tsx
import { routing } from '@/i18n/routing'
import { usePathname } from '@/i18n/navigation'

export function LanguageAlternates() {
  const pathname = usePathname()
  
  return (
    <>
      {routing.locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`/${locale}${pathname}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={pathname}
      />
    </>
  )
}
```

## 8. 測試配置

### 8.1 國際化測試

```typescript
// src/test/i18n.test.ts
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { messages } from '../messages/en.json'
import { Header } from '../components/Header'

describe('Internationalization', () => {
  it('should render English text by default', () => {
    render(
      <NextIntlClientProvider messages={messages}>
        <Header />
      </NextIntlClientProvider>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
  
  it('should render Chinese text when locale is zh-TW', () => {
    const chineseMessages = require('../messages/zh-TW.json')
    
    render(
      <NextIntlClientProvider messages={chineseMessages}>
        <Header />
      </NextIntlClientProvider>
    )
    
    expect(screen.getByText('首頁')).toBeInTheDocument()
    expect(screen.getByText('關於')).toBeInTheDocument()
    expect(screen.getByText('聯絡我們')).toBeInTheDocument()
  })
})
```

## 9. 效能優化

### 9.1 動態導入訊息

```typescript
// src/lib/message-loader.ts
export async function loadMessages(locale: string) {
  try {
    const messages = await import(`../messages/${locale}.json`)
    return messages.default
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}`)
    // 回退到預設語言
    const fallbackMessages = await import(`../messages/en.json`)
    return fallbackMessages.default
  }
}
```

### 9.2 快取策略

```typescript
// src/lib/message-cache.ts
class MessageCache {
  private cache = new Map<string, { messages: any; timestamp: number }>()
  private readonly TTL = 5 * 60 * 1000 // 5 分鐘

  async getMessages(locale: string): Promise<any> {
    const cached = this.cache.get(locale)
    
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.messages
    }
    
    const messages = await loadMessages(locale)
    this.cache.set(locale, {
      messages,
      timestamp: Date.now()
    })
    
    return messages
  }

  clear(): void {
    this.cache.clear()
  }
}

export const messageCache = new MessageCache()
```

## 總結

本指南提供了完整的 Next.js 15 國際化實作方案，包括：

1. **基本配置**：next-intl 安裝和 Next.js 配置
2. **訊息管理**：多語言訊息檔案和請求配置
3. **路由配置**：中間件和語言佈局
4. **組件國際化**：翻譯 Hook 和表單驗證
5. **格式化**：日期和數字本地化
6. **SEO 優化**：多語言元資料和語言切換
7. **測試和效能**：國際化測試和快取策略

這些實作將幫助開發團隊建立多語言應用程式，提供更好的用戶體驗和 SEO 優化。
