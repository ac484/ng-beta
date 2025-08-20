# Next.js 15 效能監控實作指南

## 概述

本指南涵蓋 Next.js 15 應用程式的效能監控實作，包括 Core Web Vitals 追蹤、效能測量 API 和監控工具整合。

## 1. Core Web Vitals 監控

### 1.1 useReportWebVitals Hook 實作

```typescript
// src/components/WebVitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0]

const handleWebVitals: ReportWebVitalsCallback = (metric) => {
  // 發送到分析服務
  switch (metric.name) {
    case 'FCP': {
      // First Contentful Paint
      console.log('FCP:', metric.value)
      break
    }
    case 'LCP': {
      // Largest Contentful Paint
      console.log('LCP:', metric.value)
      break
    }
    case 'FID': {
      // First Input Delay
      console.log('FID:', metric.value)
      break
    }
    case 'CLS': {
      // Cumulative Layout Shift
      console.log('CLS:', metric.value)
      break
    }
    case 'INP': {
      // Interaction to Next Paint
      console.log('INP:', metric.value)
      break
    }
    case 'TTFB': {
      // Time to First Byte
      console.log('TTFB:', metric.value)
      break
    }
  }

  // 發送到 Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_label: metric.id,
      non_interaction: true,
    })
  }

  // 發送到自定義分析端點
  const body = JSON.stringify(metric)
  const url = '/api/analytics/web-vitals'

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}

export function WebVitals() {
  useReportWebVitals(handleWebVitals)
  return null
}
```

### 1.2 整合到根佈局

```typescript
// src/app/layout.tsx
import { WebVitals } from '@/components/WebVitals'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

### 1.3 Next.js 配置

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 啟用 Web Vitals 歸因
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  // 啟用效能監控
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

## 2. 效能測量 API

### 2.1 自定義效能標記

```typescript
// src/lib/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name)
      this.marks.set(name, performance.now())
    }
  }

  measure(name: string, startMark: string, endMark: string): void {
    if (typeof performance !== 'undefined') {
      try {
        performance.measure(name, startMark, endMark)
      } catch (error) {
        console.warn(`Failed to measure ${name}:`, error)
      }
    }
  }

  getDuration(startMark: string, endMark: string): number {
    const start = this.marks.get(startMark)
    const end = this.marks.get(endMark)
    
    if (start && end) {
      return end - start
    }
    return 0
  }

  // 路由轉換效能追蹤
  trackRouteTransition(url: string): void {
    this.mark(`nav-start-${url}`)
  }

  // 組件載入效能追蹤
  trackComponentLoad(componentName: string): void {
    this.mark(`component-load-start-${componentName}`)
  }

  // 資料獲取效能追蹤
  trackDataFetch(operation: string): void {
    this.mark(`data-fetch-start-${operation}`)
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
```

### 2.2 路由效能監控

```typescript
// src/lib/route-performance.ts
import { performanceMonitor } from './performance'

export function trackRoutePerformance() {
  if (typeof window !== 'undefined') {
    // 監聽路由變化
    let currentUrl = window.location.pathname
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('Navigation Performance:', {
            url: currentUrl,
            loadEventEnd: navEntry.loadEventEnd - navEntry.loadEventStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            firstPaint: navEntry.responseEnd - navEntry.fetchStart,
          })
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })

    // 追蹤路由轉換
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
      performanceMonitor.trackRouteTransition(args[2] as string)
      return originalPushState.apply(this, args)
    }

    history.replaceState = function(...args) {
      performanceMonitor.trackRouteTransition(args[2] as string)
      return originalReplaceState.apply(this, args)
    }
  }
}
```

## 3. 效能監控工具整合

### 3.1 Google Analytics 4 整合

```typescript
// src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export function initGA(): void {
  if (typeof window === 'undefined' || !GA_TRACKING_ID) return

  // 載入 Google Analytics
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  })
}

export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export function trackPageView(url: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}
```

### 3.2 自定義分析端點

```typescript
// src/app/api/analytics/web-vitals/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json()
    
    // 儲存到資料庫或發送到分析服務
    console.log('Web Vitals Metric:', metric)
    
    // 這裡可以整合 Sentry、DataDog 等服務
    if (process.env.SENTRY_DSN) {
      // 發送到 Sentry
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to process web vitals:', error)
    return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 })
  }
}
```

### 3.3 Sentry 效能監控

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ['localhost', 'your-domain.com'],
        }),
      ],
    })
  }
}

export function trackPerformance(name: string, operation: string, duration: number): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addPerformanceEntry({
      name,
      entryType: 'measure',
      startTime: 0,
      duration,
      detail: { operation },
    })
  }
}
```

## 4. 效能優化策略

### 4.1 圖片優化

```typescript
// src/components/OptimizedImage.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
}
```

### 4.2 程式碼分割

```typescript
// src/components/LazyComponent.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// 動態載入組件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>載入中...</div>,
  ssr: false, // 如果組件不需要 SSR
})

export function LazyComponent() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 4.3 快取策略

```typescript
// src/lib/cache.ts
export class PerformanceCache {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  static set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  static get(key: string): any | null {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  static clear(): void {
    this.cache.clear()
  }
}
```

## 5. 效能測試

### 5.1 Lighthouse CI 配置

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### 5.2 效能測試腳本

```json
// package.json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "lighthouse:view": "lhci open",
    "performance:test": "npm run build && npm run lighthouse"
  }
}
```

## 6. 環境變數配置

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
```

## 7. 監控儀表板

### 7.1 效能指標顯示

```typescript
// src/components/PerformanceDashboard.tsx
'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  inp: number
  ttfb: number
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    // 獲取已儲存的效能指標
    const storedMetrics = localStorage.getItem('performance-metrics')
    if (storedMetrics) {
      setMetrics(JSON.parse(storedMetrics))
    }
  }, [])

  if (!metrics) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">效能指標</h3>
      <div className="space-y-1 text-xs">
        <div>FCP: {metrics.fcp.toFixed(0)}ms</div>
        <div>LCP: {metrics.lcp.toFixed(0)}ms</div>
        <div>FID: {metrics.fid.toFixed(0)}ms</div>
        <div>CLS: {metrics.cls.toFixed(3)}</div>
        <div>INP: {metrics.inp.toFixed(0)}ms</div>
        <div>TTFB: {metrics.ttfb.toFixed(0)}ms</div>
      </div>
    </div>
  )
}
```

## 總結

本指南提供了完整的 Next.js 15 效能監控實作方案，包括：

1. **Core Web Vitals 追蹤**：使用 `useReportWebVitals` 和自定義分析
2. **效能測量 API**：自定義效能標記和測量
3. **工具整合**：Google Analytics、Sentry 等服務整合
4. **效能優化**：圖片優化、程式碼分割、快取策略
5. **測試和監控**：Lighthouse CI 和效能儀表板

這些實作將幫助開發團隊監控應用程式效能，識別瓶頸，並持續優化用戶體驗。
