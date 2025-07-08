import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing)

export function middleware(request: any) {
  // Handle internationalization
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - routes starting with /api, /_next, /_vercel
  // - routes containing a dot (e.g. favicon.ico)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
}