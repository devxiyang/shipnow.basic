import { updateSession } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const intlResponse = intlMiddleware(request)
  
  // If intl middleware returns a response (redirect), use it
  if (intlResponse) {
    // For intl redirects, just return the intl response
    return intlResponse
  }

  // Otherwise, handle Supabase session update normally
  return await updateSession(request)
}

export const config = {
  // Match all pathnames except for
  // - routes starting with /api, /_next, /_vercel
  // - routes containing a dot (e.g. favicon.ico)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}