import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const getSafeEnv = (key: string, fallback: string) => {
    const val = process.env[key];
    if (typeof val !== 'string' || !val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return fallback;
    }
    return val.trim();
  };

  const supabaseUrl = getSafeEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
  const supabaseKey = getSafeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');

  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
