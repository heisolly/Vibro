import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  const finalUrl = supabaseUrl.trim();
  const finalKey = supabaseKey.trim();

  if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('⚠️ [Vibro] Using placeholder Supabase URL. This is expected during static build if env vars are missing.');
  }

  let cookieStore: any

  try {
    cookieStore = await cookies()
  } catch (e) {
    return createServerClient(
      finalUrl,
      finalKey,
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
    finalUrl,
    finalKey,
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
