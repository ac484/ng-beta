'use client';

import { Button } from '@/components/ui/button';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
// import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Partners', href: '/dashboard/partners', icon: Users },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 }
];

export function AppSidebar() {
  const { open } = useSidebar();
  // const { user } = useUser()
  const pathname = usePathname();

  return (
    <Sidebar>
      <div className='flex h-16 items-center border-b px-4'>
        {open && <h2 className='text-lg font-semibold'>Workspace</h2>}
        {!open && <div className='bg-primary h-8 w-8 rounded-md' />}
      </div>

      <nav className='flex-1 space-y-1 p-4'>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn('w-full justify-start', !open && 'px-2')}
              asChild
            >
              <Link href={item.href}>
                <item.icon className={cn('h-4 w-4', open && 'mr-2')} />
                {open && item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        {/* {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {open && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            )}
          </div>
        )} */}

        {open && (
          <div className='mt-3 space-y-1'>
            <Button variant='ghost' size='sm' className='w-full justify-start'>
              <Settings className='mr-2 h-4 w-4' />
              Settings
            </Button>
            <Button variant='ghost' size='sm' className='w-full justify-start'>
              <LogOut className='mr-2 h-4 w-4' />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
