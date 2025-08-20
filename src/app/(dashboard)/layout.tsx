import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  portfolio: React.ReactNode
  partners: React.ReactNode
  documents: React.ReactNode
  analytics: React.ReactNode
}

export default function DashboardLayout({
  children,
  portfolio,
  partners,
  documents,
  analytics
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 space-y-6">
              {children}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfolio}
                {partners}
                {documents}
              </div>
              {analytics}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}