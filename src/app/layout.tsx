'use client'

import { useEffect } from 'react'
import { initializeAppCheckWithRecaptcha } from '@/lib/firebase/app-check'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 初始化 Firebase App Check
    initializeAppCheckWithRecaptcha()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}