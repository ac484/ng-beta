'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '@/components/ui/sidebar'
// import { useUser } from '@clerk/nextjs'
import {
  Menu,
  Search,
  Bell,
  Settings,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const { setOpen, open } = useSidebar()
  // const { user } = useUser()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 items-center border-b px-4">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, partners, documents..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            3
          </Badge>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
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
  )
}