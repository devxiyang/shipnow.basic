# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 SaaS template (ShipNow) that provides a complete foundation for building SaaS applications with authentication, payments, and subscription management.

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run dev:https    # Start development with HTTPS (for OAuth testing)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands (run from /prisma directory)
```bash
make init            # Initialize database (first time)
make migrate         # Apply schema changes
make studio          # Open Prisma Studio GUI
make generate        # Regenerate Prisma Client
```

### Testing
No test framework is currently configured. Use TypeScript and ESLint for code quality.

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui - All UI components use shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: Supabase Auth with Google One-Tap login
- **Payments**: Stripe (subscriptions)

### Key Directories
- `/app` - Next.js App Router pages and API routes
- `/components` - React components organized by domain
  - `/ui` - shadcn/ui base components (DO NOT put custom components here)
  - `/auth` - Authentication related components
  - `/subscription` - Subscription and billing components
- `/lib` - Core business logic and integrations
  - `/auth` - Authentication providers and utilities
  - `/subscription` - Subscription management and providers
  - `/action` - Server actions for data mutations
  - `/hooks` - Custom React hooks
  - `/stripe` - Stripe integration and utilities
  - `/supabase` - Supabase client and utilities
  - `/utils` - Utility functions (formatters, time, error handling)
  - `/types` - TypeScript type definitions
- `/config` - Configuration files
  - `template.config.ts` - Main template configuration
  - `stripe.config.ts` - Stripe pricing and product config
  - `subscription.config.ts` - Subscription features config
- `/i18n` - Internationalization
  - `config.ts` - i18n configuration and supported locales
  - `/messages` - Translation files for all supported languages
- `/prisma` - Database schema and migrations

### Important Patterns
1. **Server Components by default** - Add `"use client"` only when needed
2. **Server Actions** - Use for data mutations (in `/lib/action`)
3. **Path Aliases** - Use `@/` for imports from root
4. **Component Organization** - 
   - shadcn/ui components ONLY in `/components/ui`
   - Custom components organized by domain (auth, subscription, etc.)
5. **Modular Architecture** - Each feature module exports through index.ts
   - Auth: `import { useAuth, AuthProvider } from '@/lib/auth'`
   - Subscription: `import { useSubscription, SubscriptionProvider } from '@/lib/subscription'`
6. **Configuration** - Organized config files in `/config`
   - `template.config.ts`: Main template configuration (branding, content, features)
   - `stripe.config.ts`: Stripe products, pricing, and helpers
   - `subscription.config.ts`: Subscription feature configuration
7. **Error Handling** - Standardized error system with codes and messages
   - Use `AppError` class for throwing structured errors
   - Use `ERROR_CODES` constants instead of magic strings
   - Server actions should return `ApiResponse<T>` with success/error structure

### Core Features
- Google authentication with Supabase
- Subscription management (Standard: $4.90/mo, Pro: $9.90/mo)
- Customer portal for managing subscriptions
- User profile management
- Usage tracking and limits
- Responsive design with dark mode support
- **🌍 Internationalization**: Complete i18n support with 7 languages
  - English, Chinese, Spanish, French, German, Japanese, Korean
  - Dynamic URL routing (e.g., `/zh`, `/es`, `/fr`)
  - Language switcher in header
  - All UI components and content fully translated

### Database Schema
Key models: Order, Subscription, PaymentEvent

### Development Workflow
1. Make database schema changes in `/prisma/schema.prisma`
2. Run `make migrate` from `/prisma` directory
3. Server actions automatically revalidate paths
4. Use Suspense boundaries for loading states
5. Handle errors with proper user feedback using `AppError` and `ERROR_CODES`

### Next.js 15 Important Changes

#### Dynamic Route Parameters
**CRITICAL**: In Next.js 15, `params` in dynamic routes must be awaited before accessing properties.

**Correct pattern for `[locale]` routes:**
```typescript
// ✅ Correct - await params first
interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  // Now you can safely use locale
}
```

**Incorrect pattern (will cause runtime errors):**
```typescript
// ❌ Incorrect - accessing params.locale directly
interface PageProps {
  params: { locale: string };
}

export default async function Page({ params: { locale } }: PageProps) {
  // This will throw: "params should be awaited before using its properties"
}
```

**This applies to all dynamic routes including:**
- `app/[locale]/layout.tsx`
- `app/[locale]/[...slug]/page.tsx`
- Any other dynamic route with parameters

**Error message you'll see if not followed:**
```
Error: Route "/[locale]" used `params.locale`. `params` should be awaited before using its properties.
```

#### Middleware Configuration for i18n
**IMPORTANT**: The middleware configuration must be set up correctly for next-intl to work properly. Follow the official documentation exactly.

**Correct file structure:**
```
/i18n/
  routing.ts     # Define locales and routing config
  request.ts     # Handle locale validation and message loading
  /messages/
    en.json      # English translations
    zh.json      # Chinese translations
    ...
```

**Required files:**

**1. `i18n/routing.ts`:**
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});
```

**2. `middleware.ts`:**
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};
```

**3. `i18n/request.ts`:**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

**4. `next.config.ts`:**
```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
export default withNextIntl(nextConfig);
```

**5. Root page redirect (`app/page.tsx`):**
```typescript
import { redirect } from 'next/navigation';
export default function RootPage() {
  redirect('/en');
}
```

**Common mistakes that cause 404 errors:**
- ❌ Using old config format with `locale` instead of `requestLocale`
- ❌ Wrong file names (`config.ts` instead of `request.ts`)
- ❌ Not creating root page redirect
- ❌ Incorrect routing configuration
- ✅ Follow official documentation exactly
- ✅ Use `requestLocale` and `hasLocale` for proper validation

### Error Handling Examples
```typescript
// Throwing structured errors
import { AppError, ERROR_CODES } from '@/lib/utils'

throw new AppError(ERROR_CODES.USER_NOT_AUTHENTICATED, 'Custom message')

// Server action responses
import { createSuccessResponse, createErrorResponse } from '@/lib/utils'

export async function myAction(): Promise<ApiResponse<Data>> {
  try {
    const data = await someOperation()
    return createSuccessResponse(data)
  } catch (error) {
    return handleActionError(error, 'myAction')
  }
}

// Client-side error handling
import { handleError } from '@/lib/utils'

try {
  await riskyOperation()
} catch (error) {
  handleError(error, 'Component name')
}
```

## UI/UX Guidelines

### Theme Usage
- **ALWAYS use theme tokens** - Never hardcode colors (e.g., avoid `bg-blue-500`, use `bg-primary`)
- **Theme color tokens**:
  - `primary` - Main brand color for CTAs and emphasis
  - `secondary` - Secondary actions and less prominent elements
  - `destructive` - Error states and destructive actions
  - `muted` - Subtle backgrounds and disabled states
  - `accent` - Highlight and hover states
  - `card` - Card backgrounds
  - `border` - All borders should use theme border colors

### Modal Design Patterns
- **Consistent spacing** - Use Tailwind's spacing scale (p-4, p-6, gap-4, etc.)
- **Border radius** - Use `rounded-lg` or `rounded-xl` for cards and modals
- **Shadows** - Use theme shadows (`shadow-sm`, `shadow-md`, `shadow-lg`)
- **Transitions** - Add smooth transitions with `transition-all duration-200`
- **Hover effects** - Include subtle scale effects `hover:scale-[1.01]` or `hover:scale-[1.02]`

### Dark Mode Considerations
- All colors must work in both light and dark modes
- Use `/10`, `/20` opacity modifiers for subtle backgrounds (e.g., `bg-primary/10`)
- Gradients should use theme colors (e.g., `from-primary/20 to-primary/10`)
- Test all UI changes in both light and dark themes

### Component Best Practices
- **Buttons** - Use appropriate variants (`default`, `outline`, `ghost`, `destructive`)
- **Cards** - Apply hover states with `hover:shadow-lg` and `hover:border-{color}/80`
- **Icons** - Should inherit text color or use theme colors
- **Badges** - Use theme-aware variants, avoid custom colors
- **Focus states** - Ensure all interactive elements have proper focus rings using `focus:ring-ring`

## Environment Variables Required

```bash
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=

# Site URL
NEXT_PUBLIC_SITE_URL=

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
```