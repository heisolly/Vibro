import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    // This happens if env vars are not properly loaded or swapped by Next.js
    console.warn('Supabase URL is missing or using placeholder! Re-check .env.local and restart dev server.');
  }

  return createBrowserClient(
    (supabaseUrl || 'https://placeholder.supabase.co').trim(),
    (supabaseKey || 'placeholder').trim()
  )
}
