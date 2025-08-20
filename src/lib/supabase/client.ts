import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASESUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASESUPABASE_ANON_KEY!
  )
}