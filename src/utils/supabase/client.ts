import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.error('❌ [Supabase Client] Environment variables are missing or using placeholders!');
    console.log('URL:', supabaseUrl);
    // Do not log the full key for security, just its presence
    console.log('Key defined:', !!supabaseKey);
  }

  return createBrowserClient(
    (supabaseUrl || 'https://placeholder.supabase.co').trim(),
    (supabaseKey || 'placeholder').trim()
  )
}
