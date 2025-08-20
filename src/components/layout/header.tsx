'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
// import { useUser } from '@clerk/nextjs'
import { Bell, Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function Header() {
  const { setOpen, open } = useSidebar();
  // const { user } = useUser()
  const { theme, setTheme } = useTheme();

  return (
    <header className='flex h-16 items-center border-b px-4'>
      <div className='flex flex-1 items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={() => setOpen(!open)}>
          <Menu className='h-4 w-4' />
        </Button>

        <div className='max-w-md flex-1'>
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
            <Input
              placeholder='Search projects, partners, documents...'
              className='pl-10'
            />
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className='h-4 w-4' />
          ) : (
            <Moon className='h-4 w-4' />
          )}
        </Button>

        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-4 w-4' />
          <Badge
            variant='destructive'
            className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs'
          >
            3
          </Badge>
        </Button>

        <Button variant='ghost' size='icon'>
          <Settings className='h-4 w-4' />
        </Button>

        {/* {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        )} */}
      </div>
    </header>
  );
}
