'use client';

import { UserButton } from '@clerk/nextjs';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProfileProps {
  showRole?: boolean;
  showAvatar?: boolean;
}

export function UserProfile({
  showRole = true,
  showAvatar = true
}: UserProfileProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className='flex items-center gap-3'>
      {showAvatar && (
        <Avatar className='h-8 w-8'>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className='flex flex-col'>
        <span className='text-sm font-medium'>{user.name}</span>
        {showRole && (
          <Badge variant='secondary' className='text-xs'>
            {user.role}
          </Badge>
        )}
      </div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-8 w-8'
          }
        }}
      />
    </div>
  );
}
