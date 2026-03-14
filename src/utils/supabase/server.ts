import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.error('❌ [Supabase Server] Environment variables are missing or using placeholders!');
  }

  const finalUrl = (supabaseUrl || 'https://placeholder.supabase.co').trim();
  const finalKey = (supabaseKey || 'placeholder').trim();

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
