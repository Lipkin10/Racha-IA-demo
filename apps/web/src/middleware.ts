import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if it exists
  const { data: { session } } = await supabase.auth.getSession()

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/auth/callback',
    '/auth/confirm',
    '/privacy',
    '/terms',
    '/api/health'
  ]

  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith('/api/health')
  )

  // If accessing protected route without session, redirect to login
  if (!session && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated, check LGPD consent and user profile
  if (session?.user) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('id, consent_timestamp, privacy_settings, data_retention_date')
        .eq('id', session.user.id)
        .single()

      // Check if user profile exists (should exist after registration)
      if (!user && !req.nextUrl.pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }

      // Check LGPD consent (if user profile exists)
      if (user && !user.consent_timestamp && !req.nextUrl.pathname.startsWith('/auth/consent')) {
        return NextResponse.redirect(new URL('/auth/consent', req.url))
      }

      // Check data retention compliance
      if (user?.data_retention_date) {
        const retentionDate = new Date(user.data_retention_date)
        const now = new Date()
        
        if (now > retentionDate && !req.nextUrl.pathname.startsWith('/auth/data-retention')) {
          return NextResponse.redirect(new URL('/auth/data-retention', req.url))
        }
      }

      // Update last active timestamp
      if (user && !req.nextUrl.pathname.startsWith('/api/')) {
        // Don't await this to avoid blocking the request
        try {
          supabase
            .from('users')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', session.user.id)
            .then(() => {})
        } catch (error) {
          console.error('Last active update error:', error)
        }
      }
    } catch (error) {
      console.error('Middleware error checking user:', error)
      // Continue with request on error to avoid blocking
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth/') && 
      !req.nextUrl.pathname.includes('callback') && 
      !req.nextUrl.pathname.includes('confirm')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 