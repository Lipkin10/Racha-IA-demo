import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '../types/database'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if it exists
  const { data: { session } } = await supabase.auth.getSession()

  // LGPD compliance check
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('lgpd_consent, lgpd_consent_date')
      .eq('id', session.user.id)
      .single()

    // Redirect to consent page if LGPD consent not given
    if (!profile?.lgpd_consent && !req.nextUrl.pathname.startsWith('/consent')) {
      return NextResponse.redirect(new URL('/consent', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|consent).*)',
  ],
} 