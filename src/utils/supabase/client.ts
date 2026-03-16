import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ [Vibro Supabase] Environment variables missing. Supabase functionality will be disabled.');
    }
    // Return a dummy client that doesn't trigger network calls immediately
    return createBrowserClient(
      'https://INVALID_SUPABASE_URL.supabase.co',
      'INVALID_KEY'
    );
  }

  // Ensure URL is valid protocol
  let sanitizedUrl = supabaseUrl.trim();
  if (!sanitizedUrl.startsWith('http')) {
    sanitizedUrl = `https://${sanitizedUrl}`;
  }

  return createBrowserClient(sanitizedUrl, supabaseKey.trim());
}
