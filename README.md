# ShipNow - Next.js SaaS Template

> 🇨🇳 [中文文档](./README-zh.md) | 🇺🇸 English

The complete Next.js template with everything you need to launch your SaaS. Stop building auth and payments from scratch.

## 🌍 Multi-Language Support

**Launch globally from day one!** ShipNow includes complete internationalization with 7 languages:
- English, Chinese, Spanish, French, German, Japanese, Korean
- Automatic language detection and URL-based routing
- Language switcher in the header
- All UI components, error messages, and content fully translated

## 🎯 Quick Template Setup

**New to this template?** Use our interactive setup wizard:

```bash
npm run init-template
```

This will guide you through customizing:
- Brand name, tagline, and description
- Hero section content  
- Feature descriptions
- Pricing plans
- Environment variables

All changes are applied to `config/template.config.ts` for easy customization.

## 🚀 Features

- **Authentication**: Supabase Auth with Google One-Tap login
- **Payments**: Stripe integration with subscription management
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui with dark mode support
- **Type Safety**: Full TypeScript support
- **Server Actions**: Type-safe data mutations
- **Responsive**: Mobile-first design
- **SEO Ready**: Optimized metadata and sitemap
- **🌍 Internationalization**: 7 languages support with next-intl

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Internationalization**: next-intl
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shipnow.pro.git
cd shipnow.pro
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

5. Set up the database:
```bash
cd prisma
make init  # First time setup
# OR
make migrate  # Apply migrations
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## ⚙️ Detailed Setup Guide

### Environment Variables

Copy `.env.example` to `.env.local` and configure each section:

#### Database Configuration
```bash
# Get these from your Supabase project or PostgreSQL provider
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE]"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DATABASE]"
```

#### Supabase Configuration
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

#### Stripe Configuration
1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard:
```bash
STRIPE_SECRET_KEY="sk_test_..." # Use sk_live_ for production
STRIPE_WEBHOOK_SECRET="whsec_..." # From webhook endpoint
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." # Use pk_live_ for production
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
```bash
GOOGLE_CLIENT_ID="[CLIENT-ID].apps.googleusercontent.com"
```

#### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000" # Update for production
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX" # Optional
```

### Database Setup

The template uses Prisma with a PostgreSQL database:

```bash
# Navigate to prisma directory
cd prisma

# First time setup (creates database and runs migrations)
make init

# For subsequent schema changes
make migrate

# View/edit data in browser
make studio

# Regenerate Prisma client after schema changes
make generate
```

### Stripe Setup

1. **Create Products in Stripe Dashboard:**
   - Standard Plan: $4.90/month
   - Pro Plan: $9.90/month

2. **Configure Webhook Endpoint:**
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`

3. **Update Product IDs in config:**
   ```typescript
   // config/stripe.config.ts
   export const STRIPE_CONFIG = {
     STANDARD_PRICE_ID: "price_xxxxx", // Your Stripe price ID
     PRO_PRICE_ID: "price_xxxxx"       // Your Stripe price ID
   }
   ```

### Google OAuth Setup

1. **Configure OAuth Consent Screen**
2. **Add Authorized Domains:**
   - `localhost` (for development)
   - Your production domain
3. **Set Redirect URIs in Supabase:**
   - Go to Supabase Dashboard > Authentication > Settings
   - Add: `https://yourdomain.com/auth/callback`

## 📝 Project Structure

```
shipnow.pro/
├── app/                  # Next.js App Router pages
│   ├── [locale]/        # Internationalized routes
│   ├── api/             # API routes
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── auth/           # Authentication components
├── config/             # Configuration files
│   ├── site.config.ts  # Site metadata
│   └── stripe.config.ts # Stripe configuration
├── i18n/               # Internationalization
│   ├── config.ts       # i18n configuration
│   └── messages/       # Translation files
│       ├── en.json     # English
│       ├── zh.json     # Chinese
│       ├── es.json     # Spanish
│       ├── fr.json     # French
│       ├── de.json     # German
│       ├── ja.json     # Japanese
│       └── ko.json     # Korean
├── lib/                # Core business logic
│   ├── action/         # Server actions
│   ├── hooks/          # Custom React hooks
│   ├── stripe/         # Stripe integration
│   ├── supabase/       # Supabase client
│   └── auth/           # Authentication providers
├── prisma/             # Database schema
├── types/              # TypeScript types
└── middleware.ts       # Next.js middleware
```

## 🔧 Configuration

### Template Customization

The template uses a centralized configuration system in `config/template.config.ts`:

**Brand Configuration:**
```typescript
export const BRANDING = {
  name: "YourSaaS",
  tagline: "Your Custom Tagline", 
  description: "Your SaaS description",
  email: "support@yoursaas.com",
  twitter: "@yoursaas",
  website: "https://yoursaas.com"
};
```

**Content Customization:**
```typescript
export const CONTENT = {
  hero: {
    headline: "Build your SaaS",
    highlightedText: " in days",
    subtitle: "Your custom subtitle..."
  },
  features: { /* ... */ },
  pricing: { /* ... */ }
};
```

### Database Schema

The template includes these core models:
- `Order` - Payment transactions
- `Subscription` - User subscriptions
- `PaymentEvent` - Webhook events

### Subscription Plans

Customize plans in `config/template.config.ts`:
```typescript
export const SUBSCRIPTION_PLANS = {
  STANDARD: {
    name: "Starter", 
    price: 9.99,
    features: ["Feature 1", "Feature 2"]
  }
};
```

### Internationalization

The template supports 7 languages out of the box:

**Supported Languages:**
- 🇺🇸 English (en) - Default
- 🇨🇳 Chinese (zh)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

**Adding a New Language:**
1. Create a translation file in `/i18n/messages/[locale].json`
2. Add the locale to `/i18n/config.ts`:
```typescript
export const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'your-locale'] as const;
```
3. Update the middleware pattern in `middleware.ts`
4. Add the locale name to the language switcher

**Translation Keys:**
All translations are organized by sections:
```json
{
  "common": { "loading": "Loading..." },
  "auth": { "signIn": "Sign In" },
  "hero": { "headline": "Build your SaaS" },
  "features": { "title": "Features" },
  "pricing": { "title": "Pricing" }
}
```

### Authentication

Google One-Tap login is configured by default. To add more providers:
1. Configure the provider in Supabase
2. Update the auth components in `/components/auth/`

## 📖 Usage Guide

### Customizing Your SaaS

#### 1. Update Site Configuration
```typescript
// config/site.config.ts
export const siteConfig = {
  name: "YourSaaS",
  title: "Your SaaS Title",
  description: "Your SaaS description",
  url: "https://yoursaas.com",
  email: "support@yoursaas.com",
  twitter: "@yoursaas"
}
```

#### 2. Customize Content
```typescript
// config/template.config.ts
export const CONTENT = {
  hero: {
    headline: "Your Custom Headline",
    subtitle: "Your value proposition...",
    primaryCTA: "Get Started",
    secondaryCTA: "Learn More"
  },
  // ... customize features, pricing, etc.
}
```

#### 3. Update Pricing Plans
```typescript
// config/template.config.ts
export const CONTENT = {
  pricing: {
    plans: [
      {
        name: "Starter",
        price: 9.99,
        interval: "month",
        features: ["Feature 1", "Feature 2"],
        cta: "Start Free Trial"
      }
    ]
  }
}
```

### Language Management

#### Switching Languages
Users can switch languages using the language picker in the header. The app automatically:
- Updates the URL (e.g., `/en/page` → `/es/page`)
- Changes all UI text
- Maintains user session and state

#### Adding Custom Translations
```typescript
// In your component
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('mySection')
  return <h1>{t('title')}</h1>
}
```

```json
// i18n/messages/en.json
{
  "mySection": {
    "title": "My Custom Title"
  }
}
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run dev:https        # Start with HTTPS (for OAuth testing)

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript

# Database (from /prisma directory)
make init               # First-time database setup
make migrate            # Run migrations
make studio             # Open Prisma Studio
make generate           # Regenerate Prisma client
make reset              # Reset database (⚠️ destructive)
```

### Deployment Checklist

#### Before Deploying:
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Set up production database
- [ ] Configure production Stripe keys
- [ ] Set up domain verification for Google OAuth
- [ ] Test all payment flows in Stripe test mode
- [ ] Configure webhook endpoints

#### Production Environment Variables:
```bash
# Use production values
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

## 🔧 Troubleshooting

### Common Issues

#### Authentication Not Working
1. Check Google Client ID is correct
2. Verify redirect URLs in Google Console match your domain
3. Ensure Supabase project URL and keys are correct

#### Payments Failing
1. Verify Stripe keys (test vs production)
2. Check webhook endpoint is receiving events
3. Confirm product IDs match your Stripe dashboard

#### Build Errors
1. Run `npm run lint` to check for code issues
2. Ensure all environment variables are set
3. Check TypeScript errors with `npm run type-check`

#### Database Connection Issues
1. Verify DATABASE_URL format
2. Check database server is accessible
3. Run `make generate` to ensure Prisma client is up to date

### Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Bundle Analysis**: Run `npm run build` and check bundle sizes
3. **Database Queries**: Use Prisma query optimization
4. **Caching**: Configure appropriate cache headers

### Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Use different keys for development and production
3. **CORS**: Configure appropriate CORS policies
4. **Rate Limiting**: Implement rate limiting for API routes

## ❓ Frequently Asked Questions

### General

**Q: Can I use this template for commercial projects?**
A: Yes! This template is MIT licensed, so you can use it for any commercial project.

**Q: How do I customize the branding?**
A: Update the configuration in `config/site.config.ts` and `config/template.config.ts`. All branding elements are centralized there.

**Q: Can I add more payment plans?**
A: Yes! Create additional products in Stripe, then update the pricing configuration in `config/template.config.ts`.

### Internationalization

**Q: How do I change the default language?**
A: Update `defaultLocale` in `i18n/config.ts` to your preferred language.

**Q: Can I remove languages I don't need?**
A: Yes! Remove the locale from the `locales` array in `i18n/config.ts` and delete the corresponding translation file.

**Q: How do I handle RTL languages?**
A: You'll need to add RTL support by configuring CSS direction based on locale. Consider using a library like `next-intl` with RTL detection.

### Technical

**Q: Can I use a different database?**
A: Yes! Prisma supports multiple databases. Update the `provider` in `prisma/schema.prisma` and your `DATABASE_URL`.

**Q: How do I add more authentication providers?**
A: Configure additional providers in Supabase (GitHub, Discord, etc.) and update the auth components.

**Q: Can I deploy to platforms other than Vercel?**
A: Yes! The template works with any platform supporting Next.js (Railway, Render, AWS, etc.).

**Q: How do I handle file uploads?**
A: Integrate with Supabase Storage or other providers like AWS S3, Cloudinary, or UploadThing.

### Subscription & Payments

**Q: How do I handle free trials?**
A: Set up trial periods in your Stripe products. The webhook handlers will automatically manage trial states.

**Q: Can I use one-time payments instead of subscriptions?**
A: Yes! Create one-time payment products in Stripe and update the checkout logic.

**Q: How do I handle subscription cancellations?**
A: Cancellations are handled automatically via Stripe webhooks. Users retain access until the period ends.

### Development

**Q: How do I add new pages?**
A: Create new files in `app/[locale]/` directory. They'll automatically be available in all languages.

**Q: Can I use a different UI library?**
A: Yes! While the template uses shadcn/ui, you can replace it with any React component library.

**Q: How do I handle API rate limiting?**
A: Implement rate limiting in your API routes using libraries like `@upstash/ratelimit` or custom middleware.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The template works with any platform that supports Next.js:
- Railway
- Render
- Fly.io
- AWS Amplify

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [next-intl Documentation](https://next-intl.dev)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Vercel](https://vercel.com) for the amazing deployment platform
- [Supabase](https://supabase.com) for the authentication and database
- [Stripe](https://stripe.com) for the payment processing

---

Built with ❤️ by the ShipNow team