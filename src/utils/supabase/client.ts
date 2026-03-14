import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const getSafeEnv = (val: string | undefined, fallback: string) => {
    if (typeof val !== 'string' || !val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return fallback;
    }
    return val.trim();
  };

  const supabaseUrl = getSafeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'https://placeholder.supabase.co');
  const supabaseKey = getSafeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'placeholder');

  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
