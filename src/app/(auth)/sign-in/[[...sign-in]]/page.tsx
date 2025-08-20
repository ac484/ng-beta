import { SignIn } from '@clerk/nextjs';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <SignIn />
    </div>
  );
}
