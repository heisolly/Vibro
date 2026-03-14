import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const getSafeEnv = (key: string, fallback: string) => {
    const val = process.env[key];
    if (typeof val !== 'string' || !val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return fallback;
    }
    return val.trim();
  };

  const supabaseUrl = getSafeEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
  const supabaseKey = getSafeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');

  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ [Vibro] Using placeholder Supabase URL. This is expected during static build if env vars are missing.');
  }

  let cookieStore: any

  try {
    cookieStore = await cookies()
  } catch (e) {
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get() { return undefined },
          set() {},
          remove() {},
        },
      }
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
          }
        },
      },
    }
  )
}
