'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const SidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: true,
  setOpen: () => {}
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export function Sidebar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        'flex h-full w-64 flex-col border-r bg-background transition-all duration-300',
        !open && 'w-16',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}