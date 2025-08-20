'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { initializeAppCheckWithRecaptcha } from '@/lib/firebase/app-check'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 初始化 Firebase App Check
    initializeAppCheckWithRecaptcha()
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}