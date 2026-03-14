import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  let cookieStore: any

  try {
    cookieStore = cookies()
  } catch (e) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
          }
        },
      },
    }
  )
}
