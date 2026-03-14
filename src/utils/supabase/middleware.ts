import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const getSafeEnv = (key: string, fallback: string) => {
    const val = process.env[key];
    if (typeof val !== 'string' || !val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return fallback;
    }
    return val.trim();
  };

  const supabaseUrl = getSafeEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co');
  const supabaseKey = getSafeEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // auth issues.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return supabaseResponse
}
