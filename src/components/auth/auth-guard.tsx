'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SignIn } from '@clerk/nextjs';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center'>
          <SignIn redirectUrl='/dashboard' />
        </div>
      )
    );
  }

  return <>{children}</>;
}
