import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    supabaseUrl.trim(),
    supabaseKey.trim()
  )
}
