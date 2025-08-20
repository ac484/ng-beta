'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='from-background to-muted min-h-screen bg-gradient-to-br'>
      <div className='container mx-auto px-4 py-16'>
        <div className='space-y-8 text-center'>
          <h1 className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent'>
            NG Beta
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            Modern integrated platform for projects, contracts, partners, and
            documents. Streamline your workflow with AI-powered insights.
          </p>

          <div className='flex justify-center gap-4'>
            <SignedOut>
              <SignInButton mode='modal'>
                <Button size='lg'>Sign In</Button>
              </SignInButton>
              <SignUpButton mode='modal'>
                <Button variant='outline' size='lg'>
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href='/dashboard'>
                <Button size='lg'>Go to Dashboard</Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
