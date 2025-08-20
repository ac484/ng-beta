import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/sidebar';
import { ProjectProvider } from '@/context/ProjectContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProjectProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProjectProvider>
  );
}
