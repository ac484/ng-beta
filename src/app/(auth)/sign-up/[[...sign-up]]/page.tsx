import { SignUp } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: 'mx-auto',
          card: 'shadow-lg'
        }
      }}
      path='/sign-up'
      routing='path'
      signInUrl='/sign-in'
      redirectUrl='/dashboard'
    />
  );
}
