import { redirect } from 'next/navigation'
// import { currentUser } from '@clerk/nextjs/server'

export default async function HomePage() {
  // const user = await currentUser()

  // Temporarily redirect to dashboard for build analysis
  redirect('/dashboard')
}