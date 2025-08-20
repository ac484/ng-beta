# 無障礙性實作指南

## 概述

本指南涵蓋 Next.js 應用程式的無障礙性實作，確保符合 WCAG 2.1/2.2 標準，提供包容性的用戶體驗。

## 1. WCAG 合規性標準

### 1.1 合規性等級

```typescript
// src/lib/accessibility-standards.ts
export const WCAG_LEVELS = {
  A: 'A',      // 基本無障礙性
  AA: 'AA',    // 雙 A 級（推薦）
  AAA: 'AAA'   // 三 A 級（最高）
} as const

export const WCAG_PRINCIPLES = {
  PERCEIVABLE: 'Perceivable',     // 可感知
  OPERABLE: 'Operable',           // 可操作
  UNDERSTANDABLE: 'Understandable', // 可理解
  ROBUST: 'Robust'                // 強健性
} as const

// WCAG 2.1 成功標準
export const WCAG_CRITERIA = {
  // 1.1.1 非文字內容
  '1.1.1': {
    level: WCAG_LEVELS.A,
    title: 'Non-text Content',
    description: '所有非文字內容都有替代文字'
  },
  
  // 1.3.1 資訊和關係
  '1.3.1': {
    level: WCAG_LEVELS.A,
    title: 'Info and Relationships',
    description: '資訊、結構和關係可以通過程式化方式確定'
  },
  
  // 1.4.1 顏色使用
  '1.4.1': {
    level: WCAG_LEVELS.A,
    title: 'Use of Color',
    description: '顏色不是傳達資訊的唯一視覺方式'
  },
  
  // 2.1.1 鍵盤
  '2.1.1': {
    level: WCAG_LEVELS.A,
    title: 'Keyboard',
    description: '所有功能都可以通過鍵盤使用'
  },
  
  // 2.4.1 跳過區塊
  '2.4.1': {
    level: WCAG_LEVELS.A,
    title: 'Bypass Blocks',
    description: '提供跳過重複內容區塊的機制'
  },
  
  // 2.4.2 頁面標題
  '2.4.2': {
    level: WCAG_LEVELS.A,
    title: 'Page Titled',
    description: '網頁有描述主題和目的的標題'
  },
  
  // 3.1.1 頁面語言
  '3.1.1': {
    level: WCAG_LEVELS.A,
    title: 'Language of Page',
    description: '網頁的預設人類語言可以程式化方式確定'
  },
  
  // 4.1.1 解析
  '4.1.1': {
    level: WCAG_LEVELS.A,
    title: 'Parsing',
    description: '內容可以解析為用戶代理，包括輔助技術'
  }
}
```

### 1.2 無障礙性檢查清單

```typescript
// src/lib/accessibility-checklist.ts
export interface AccessibilityChecklist {
  id: string
  criterion: string
  description: string
  level: string
  status: 'pass' | 'fail' | 'not-applicable' | 'untested'
  notes?: string
  lastChecked?: Date
}

export const ACCESSIBILITY_CHECKLIST: AccessibilityChecklist[] = [
  {
    id: '1.1.1',
    criterion: '1.1.1 Non-text Content',
    description: '所有圖片、圖表、按鈕都有適當的替代文字',
    level: 'A',
    status: 'untested'
  },
  {
    id: '1.3.1',
    criterion: '1.3.1 Info and Relationships',
    description: '使用語義化 HTML 標籤和 ARIA 屬性',
    level: 'A',
    status: 'untested'
  },
  {
    id: '1.4.1',
    criterion: '1.4.1 Use of Color',
    description: '顏色不是傳達資訊的唯一方式',
    level: 'A',
    status: 'untested'
  },
  {
    id: '2.1.1',
    criterion: '2.1.1 Keyboard',
    description: '所有互動元素都可以通過鍵盤操作',
    level: 'A',
    status: 'untested'
  },
  {
    id: '2.4.1',
    criterion: '2.4.1 Bypass Blocks',
    description: '提供跳過導航和重複內容的機制',
    level: 'A',
    status: 'untested'
  }
]

export function updateChecklistStatus(
  id: string, 
  status: AccessibilityChecklist['status'], 
  notes?: string
): void {
  const item = ACCESSIBILITY_CHECKLIST.find(item => item.id === id)
  if (item) {
    item.status = status
    item.notes = notes
    item.lastChecked = new Date()
  }
}
```

## 2. 語義化 HTML

### 2.1 基本語義化結構

```typescript
// src/components/SemanticLayout.tsx
export function SemanticLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* 跳過連結 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        跳過到主要內容
      </a>
      
      {/* 頁首 */}
      <header role="banner" aria-label="網站導航">
        <nav role="navigation" aria-label="主要導航">
          {/* 導航內容 */}
        </nav>
      </header>
      
      {/* 主要內容 */}
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      
      {/* 頁尾 */}
      <footer role="contentinfo" aria-label="網站資訊">
        {/* 頁尾內容 */}
      </footer>
    </div>
  )
}
```

### 2.2 表單無障礙性

```typescript
// src/components/AccessibleForm.tsx
'use client'

import { useState } from 'react'

interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea'
  required?: boolean
  error?: string
  helpText?: string
}

export function AccessibleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fields: FormField[] = [
    {
      id: 'name',
      label: '姓名',
      type: 'text',
      required: true,
      helpText: '請輸入您的全名'
    },
    {
      id: 'email',
      label: '電子郵件',
      type: 'email',
      required: true,
      helpText: '我們不會與第三方分享您的電子郵件'
    },
    {
      id: 'message',
      label: '訊息',
      type: 'textarea',
      helpText: '請描述您的需求或問題'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 表單驗證和提交邏輯
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <fieldset>
        <legend className="text-lg font-semibold mb-4">聯絡表單</legend>
        
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1" aria-label="必填">*</span>
              )}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                aria-describedby={`${field.id}-help ${field.id}-error`}
                aria-invalid={!!errors[field.id]}
                aria-required={field.required}
              />
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                aria-describedby={`${field.id}-help ${field.id}-error`}
                aria-invalid={!!errors[field.id]}
                aria-required={field.required}
              />
            )}
            
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-gray-500">
                {field.helpText}
              </p>
            )}
            
            {errors[field.id] && (
              <p
                id={`${field.id}-error`}
                className="text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}
      </fieldset>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        送出
      </button>
    </form>
  )
}
```

## 3. ARIA 屬性實作

### 3.1 動態內容更新

```typescript
// src/components/LiveRegion.tsx
'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function LiveRegion() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type
    }
    
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
    
    // 自動移除通知
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="space-y-4">
      {/* 通知計數器 */}
      <div
        aria-live="polite"
        aria-label={`您有 ${unreadCount} 個未讀通知`}
        className="sr-only"
      >
        {unreadCount > 0 && `${unreadCount} 個未讀通知`}
      </div>
      
      {/* 通知列表 */}
      <div
        aria-live="polite"
        aria-label="通知列表"
        className="space-y-2"
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            role="alert"
            aria-live="assertive"
            className={`p-4 rounded-md border ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <p>{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                aria-label="關閉通知"
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 測試按鈕 */}
      <div className="space-x-2">
        <button
          onClick={() => addNotification('操作成功完成！', 'success')}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          新增成功通知
        </button>
        <button
          onClick={() => addNotification('發生錯誤，請重試。', 'error')}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          新增錯誤通知
        </button>
      </div>
    </div>
  )
}
```

### 3.2 複雜互動組件

```typescript
// src/components/AccessibleTabs.tsx
'use client'

import { useState, useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface AccessibleTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function AccessibleTabs({ tabs, defaultTab }: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [focusedTab, setFocusedTab] = useState<string | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement>>({})
  const panelRefs = useRef<Record<string, HTMLDivElement>>({})

  useEffect(() => {
    if (activeTab && panelRefs.current[activeTab]) {
      panelRefs.current[activeTab].focus()
    }
  }, [activeTab])

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId)
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        const prevTab = tabs[prevIndex]
        setActiveTab(prevTab.id)
        tabRefs.current[prevTab.id]?.focus()
        break
        
      case 'ArrowRight':
        e.preventDefault()
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        const nextTab = tabs[nextIndex]
        setActiveTab(nextTab.id)
        tabRefs.current[nextTab.id]?.focus()
        break
        
      case 'Home':
        e.preventDefault()
        const firstTab = tabs[0]
        setActiveTab(firstTab.id)
        tabRefs.current[firstTab.id]?.focus()
        break
        
      case 'End':
        e.preventDefault()
        const lastTab = tabs[tabs.length - 1]
        setActiveTab(lastTab.id)
        tabRefs.current[lastTab.id]?.focus()
        break
    }
  }

  return (
    <div className="w-full">
      {/* 標籤列表 */}
      <div
        role="tablist"
        aria-label="內容標籤"
        className="flex border-b border-gray-200"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current[tab.id] = el
            }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            onFocus={() => setFocusedTab(tab.id)}
            onBlur={() => setFocusedTab(null)}
            className={`
              px-4 py-2 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              ${focusedTab === tab.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* 內容面板 */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          ref={(el) => {
            if (el) panelRefs.current[tab.id] = el
          }}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          hidden={activeTab !== tab.id}
          className={`p-4 ${activeTab === tab.id ? 'block' : 'hidden'}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
```

## 4. 鍵盤導航

### 4.1 鍵盤事件處理

```typescript
// src/hooks/useKeyboardNavigation.ts
import { useEffect, useRef } from 'react'

interface KeyboardNavigationOptions {
  onEnter?: () => void
  onEscape?: () => void
  onTab?: (direction: 'forward' | 'backward') => void
  onArrow?: (direction: 'up' | 'down' | 'left' | 'right') => void
  trapFocus?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const containerRef = useRef<HTMLElement>(null)
  const focusableElements = useRef<HTMLElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 獲取所有可聚焦元素
    const getFocusableElements = () => {
      const selector = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')
      
      return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    }

    focusableElements.current = getFocusableElements()

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Enter':
          if (options.onEnter) {
            e.preventDefault()
            options.onEnter()
          }
          break
          
        case 'Escape':
          if (options.onEscape) {
            e.preventDefault()
            options.onEscape()
          }
          break
          
        case 'Tab':
          if (options.trapFocus) {
            e.preventDefault()
            const direction = e.shiftKey ? 'backward' : 'forward'
            if (options.onTab) {
              options.onTab(direction)
            } else {
              handleFocusTrap(direction)
            }
          }
          break
          
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          if (options.onArrow) {
            e.preventDefault()
            const direction = e.key.replace('Arrow', '').toLowerCase() as 'up' | 'down' | 'left' | 'right'
            options.onArrow(direction)
          }
          break
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [options])

  const handleFocusTrap = (direction: 'forward' | 'backward') => {
    const elements = focusableElements.current
    if (elements.length === 0) return

    const currentIndex = elements.findIndex(el => el === document.activeElement)
    let nextIndex: number

    if (direction === 'forward') {
      nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
    }

    elements[nextIndex]?.focus()
  }

  return { containerRef }
}
```

### 4.2 跳過連結

```typescript
// src/components/SkipLinks.tsx
export function SkipLinks() {
  const skipTargets = [
    { id: 'main-content', label: '跳過到主要內容' },
    { id: 'navigation', label: '跳過到導航' },
    { id: 'search', label: '跳過到搜尋' }
  ]

  return (
    <>
      {skipTargets.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        >
          {label}
        </a>
      ))}
    </>
  )
}
```

## 5. 測試和驗證

### 5.1 無障礙性測試配置

```typescript
// jest.config.js
module.exports = {
  // ... 其他配置
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-accessibility.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
```

### 5.2 無障礙性測試案例

```typescript
// src/test/accessibility.test.tsx
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AccessibleForm } from '../components/AccessibleForm'
import { AccessibleTabs } from '../components/AccessibleTabs'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  describe('AccessibleForm', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<AccessibleForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper form labels', () => {
      render(<AccessibleForm />)
      
      expect(screen.getByLabelText(/姓名/)).toBeInTheDocument()
      expect(screen.getByLabelText(/電子郵件/)).toBeInTheDocument()
      expect(screen.getByLabelText(/訊息/)).toBeInTheDocument()
    })

    it('should indicate required fields', () => {
      render(<AccessibleForm />)
      
      const nameField = screen.getByLabelText(/姓名/)
      const emailField = screen.getByLabelText(/電子郵件/)
      
      expect(nameField).toHaveAttribute('aria-required', 'true')
      expect(emailField).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('AccessibleTabs', () => {
    const mockTabs = [
      { id: 'tab1', label: '標籤 1', content: <div>內容 1</div> },
      { id: 'tab2', label: '標籤 2', content: <div>內容 2</div> }
    ]

    it('should have no accessibility violations', async () => {
      const { container } = render(<AccessibleTabs tabs={mockTabs} />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper ARIA attributes', () => {
      render(<AccessibleTabs tabs={mockTabs} />)
      
      const tablist = screen.getByRole('tablist')
      const tabs = screen.getAllByRole('tab')
      const panels = screen.getAllByRole('tabpanel')
      
      expect(tablist).toBeInTheDocument()
      expect(tabs).toHaveLength(2)
      expect(panels).toHaveLength(2)
      
      // 檢查第一個標籤的 ARIA 屬性
      const firstTab = tabs[0]
      const firstPanel = panels[0]
      
      expect(firstTab).toHaveAttribute('aria-selected', 'true')
      expect(firstTab).toHaveAttribute('aria-controls', 'panel-tab1')
      expect(firstPanel).toHaveAttribute('aria-labelledby', 'tab-tab1')
    })
  })
})
```

### 5.3 無障礙性測試工具

```typescript
// src/lib/accessibility-testing.ts
import { axe, AxeResults } from 'axe-core'

export interface AccessibilityTestResult {
  passes: number
  violations: number
  incomplete: number
  inapplicable: number
  timestamp: Date
  url: string
  results: AxeResults
}

export async function runAccessibilityTest(
  element?: HTMLElement
): Promise<AccessibilityTestResult> {
  try {
    const results = await axe(element || document.body)
    
    const testResult: AccessibilityTestResult = {
      passes: results.passes.length,
      violations: results.violations.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
      timestamp: new Date(),
      url: window.location.href,
      results
    }
    
    // 記錄結果
    console.log('Accessibility Test Results:', testResult)
    
    if (results.violations.length > 0) {
      console.warn('Accessibility violations found:', results.violations)
    }
    
    return testResult
  } catch (error) {
    console.error('Accessibility test failed:', error)
    throw error
  }
}

export function generateAccessibilityReport(results: AccessibilityTestResult): string {
  let report = `# 無障礙性測試報告\n\n`
  report += `**測試時間:** ${results.timestamp.toLocaleString()}\n`
  report += `**測試頁面:** ${results.url}\n\n`
  
  report += `## 測試結果摘要\n\n`
  report += `- ✅ 通過: ${results.passes}\n`
  report += `- ❌ 違規: ${results.violations}\n`
  report += `- ⚠️ 不完整: ${results.incomplete}\n`
  report += `- ℹ️ 不適用: ${results.inapplicable}\n\n`
  
  if (results.violations.length > 0) {
    report += `## 違規詳情\n\n`
    results.violations.forEach((violation, index) => {
      report += `### ${index + 1}. ${violation.description}\n\n`
      report += `**影響:** ${violation.impact}\n`
      report += `**等級:** ${violation.tags.join(', ')}\n\n`
      
      if (violation.nodes.length > 0) {
        report += `**受影響元素:**\n`
        violation.nodes.forEach(node => {
          report += `- ${node.html}\n`
        })
        report += `\n`
      }
      
      report += `**建議修復:** ${violation.help}\n\n`
    })
  }
  
  return report
}
```

## 6. 無障礙性組件庫

### 6.1 無障礙性按鈕

```typescript
// src/components/AccessibleButton.tsx
import React from 'react'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }
    
    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      className
    ].join(' ')
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={classes}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'
```

## 總結

本指南提供了完整的無障礙性實作方案，包括：

1. **WCAG 合規性**：標準檢查清單和合規性等級
2. **語義化 HTML**：正確的 HTML 結構和標籤使用
3. **ARIA 屬性**：動態內容和複雜互動組件的無障礙性
4. **鍵盤導航**：完整的鍵盤操作支援
5. **測試和驗證**：自動化無障礙性測試和報告
6. **組件庫**：可重用的無障礙性組件

這些實作將確保應用程式符合無障礙性標準，為所有用戶提供包容性的體驗。
