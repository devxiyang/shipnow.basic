# ShipNow Basic - Next.js Website Template

> 🇨🇳 [中文文档](./README-zh.md) | 🇺🇸 English

A clean and modern Next.js website template with built-in internationalization. Perfect for landing pages, marketing websites, and simple web applications.

## 🌍 Multi-Language Support

**Launch globally from day one!** ShipNow Basic includes complete internationalization with 7 languages:
- English, Chinese, Spanish, French, German, Japanese, Korean
- Automatic language detection and URL-based routing
- Language switcher in the header
- All UI components and content fully translated

## 🎯 Quick Template Setup

**New to this template?** Simply customize the configuration files:

1. **Brand Configuration**: Update `config/template.config.ts` with your branding
2. **Site Settings**: Modify `config/site.config.ts` for metadata
3. **Content**: Customize hero, features, and CTA sections
4. **Translations**: Update translation files in `i18n/messages/`

All template content is centralized in configuration files for easy customization.

## 🚀 Features

- **🌍 Internationalization**: Complete i18n with 7 languages (next-intl)
- **🎨 UI Components**: shadcn/ui with dark mode support
- **📱 Responsive**: Mobile-first design with Tailwind CSS v4
- **⚡ Performance**: Server Components and App Router for optimal speed
- **🔒 Type Safety**: Full TypeScript support
- **🎯 SEO Ready**: Optimized metadata and sitemap
- **🛠️ Developer Experience**: Hot reload with Turbopack
- **🏗️ Clean Architecture**: Well-organized project structure

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **Deployment**: Vercel

## 📦 Getting Started

### Prerequisites

- Node.js 18+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/devxiyang/shipnow.basic.git
cd shipnow.basic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local` (optional):
```bash
# Site URL for production
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## ⚙️ Development Commands

### Essential Commands
```bash
npm run dev          # Start development server with Turbopack
npm run dev:https    # Start development server with HTTPS
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Template Customization

The template uses a centralized configuration system in `config/template.config.ts`:

**Brand Configuration:**
```typescript
export const BRANDING = {
  name: "YourSite",
  tagline: "Your Custom Tagline", 
  description: "Your site description",
  email: "contact@yoursite.com",
  twitter: "devxiyang",
  website: "https://yoursite.com"
};
```

**Content Customization:**
```typescript
export const CONTENT = {
  hero: {
    headline: "Build your website",
    highlightedText: " beautifully",
    subtitle: "Your custom subtitle..."
  },
  features: { /* ... */ }
};
```

## 📝 Project Structure

```
shipnow.basic/
├── app/                  # Next.js App Router pages
│   ├── [locale]/        # Internationalized routes
│   │   ├── page.tsx     # Homepage
│   │   ├── layout.tsx   # Locale-specific layout
│   │   ├── privacy-policy/
│   │   └── terms-of-service/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Root page redirect
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Footer.tsx      # Footer component
│   ├── Header.tsx      # Header component
│   └── theme-provider.tsx # Theme provider
├── config/             # Configuration files
│   ├── site.config.ts  # Site metadata
│   └── template.config.ts # Template configuration
├── i18n/               # Internationalization
│   ├── routing.ts      # i18n routing configuration
│   ├── request.ts      # Request configuration
│   └── messages/       # Translation files
│       ├── en.json     # English
│       ├── zh.json     # Chinese
│       ├── es.json     # Spanish
│       ├── fr.json     # French
│       ├── de.json     # German
│       ├── ja.json     # Japanese
│       └── ko.json     # Korean
├── lib/                # Utilities and helpers
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
└── middleware.ts       # Next.js middleware
```

## 🔧 Configuration

### Site Configuration

Update your site metadata in `config/site.config.ts`:

```typescript
export const siteConfig = {
  name: "YourSite",
  title: "Your Site Title",
  description: "Your site description",
  url: "https://yoursite.com",
  email: "contact@yoursite.com",
  twitter: "devxiyang"
}
```

### Content Customization

Customize your content in `config/template.config.ts`:

```typescript
export const CONTENT = {
  hero: {
    headline: "Build your website",
    highlightedText: " beautifully",
    subtitle: "Your custom subtitle..."
  },
  features: [
    {
      title: "Feature 1",
      description: "Description of feature 1"
    }
  ]
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
2. Add the locale to `/i18n/routing.ts`:
```typescript
export const routing = defineRouting({
  locales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'your-locale'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
```
3. The middleware will automatically handle the new locale
4. Add the locale name to the language switcher component

**Translation Keys:**
All translations are organized by sections:
```json
{
  "common": { "loading": "Loading..." },
  "hero": { "headline": "Build your website" },
  "features": { "title": "Features" },
  "navigation": { "home": "Home" }
}
```

**Using Translations:**
```typescript
import { useTranslations } from 'next-intl'

function MyComponent() {
  const t = useTranslations('hero')
  return <h1>{t('headline')}</h1>
}
```

## 📖 Usage Guide

### Customizing Your Website

#### 1. Update Site Configuration
```typescript
// config/site.config.ts
export const siteConfig = {
  name: "YourSite",
  title: "Your Site Title",
  description: "Your site description",
  url: "https://yoursite.com",
  email: "contact@yoursite.com",
  twitter: "devxiyang"
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
  features: [
    {
      title: "Feature 1",
      description: "Description of your feature"
    }
  ]
}
```

#### 3. Add Your Own Pages
Create new pages in the `app/[locale]/` directory:

```typescript
// app/[locale]/about/page.tsx
import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  )
}
```

### Language Management

#### Switching Languages
Users can switch languages using the language picker in the header. The app automatically:
- Updates the URL (e.g., `/en/page` → `/es/page`)
- Changes all UI text
- Maintains navigation state

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
npm run dev              # Start dev server with Turbopack
npm run dev:https        # Start dev server with HTTPS
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Deployment Checklist

#### Before Deploying:
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your domain
- [ ] Test all pages and translations
- [ ] Verify responsive design
- [ ] Check SEO metadata
- [ ] Test performance

#### Production Environment Variables:
```bash
# Required for production
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Optional analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
1. Run `npm run lint` to check for code issues
2. Ensure all environment variables are set
3. Check TypeScript errors with `npm run type-check`

#### Translation Issues
1. Verify translation files exist in `/i18n/messages/`
2. Check locale configuration in `/i18n/routing.ts`
3. Ensure translation keys match between files
4. Verify middleware configuration in `middleware.ts`

#### Routing Issues
1. Check middleware configuration in `middleware.ts`
2. Verify locale parameter handling in pages
3. Ensure proper URL structure for internationalized routes

### Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Bundle Analysis**: Run `npm run build` and check bundle sizes
3. **Caching**: Configure appropriate cache headers
4. **Code Splitting**: Use dynamic imports for large components

### Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to version control
2. **CORS**: Configure appropriate CORS policies if needed
3. **Content Security Policy**: Implement CSP headers
4. **Input Validation**: Validate all user inputs

## ❓ Frequently Asked Questions

### General

**Q: Can I use this template for commercial projects?**
A: Yes! This template is MIT licensed, so you can use it for any commercial project.

**Q: How do I customize the branding?**
A: Update the configuration in `config/site.config.ts` and `config/template.config.ts`. All branding elements are centralized there.

**Q: What's the difference between this and other Next.js templates?**
A: This template focuses on internationalization and clean architecture. It's a simplified version without authentication or payments, perfect for marketing websites and simple applications.

### Internationalization

**Q: How do I change the default language?**
A: Update `defaultLocale` in `i18n/routing.ts` to your preferred language.

**Q: Can I remove languages I don't need?**
A: Yes! Remove the locale from the `locales` array in `i18n/routing.ts` and delete the corresponding translation file.

**Q: How do I handle RTL languages?**
A: You'll need to add RTL support by configuring CSS direction based on locale. The template uses Tailwind CSS v4 which has built-in RTL support.

### Technical

**Q: Can I deploy to platforms other than Vercel?**
A: Yes! The template works with any platform supporting Next.js (Railway, Render, AWS, etc.).

**Q: How do I add a database?**
A: You can add any database solution. Consider using Prisma with PostgreSQL, SQLite, or any other database of your choice. The template is database-agnostic.

**Q: Can I add authentication?**
A: Yes! You can integrate any authentication provider like Auth.js, Supabase Auth, Clerk, or Firebase Auth. The template is authentication-agnostic.

### Development

**Q: How do I add new pages?**
A: Create new files in `app/[locale]/` directory. They'll automatically be available in all languages.

**Q: Can I use a different UI library?**
A: Yes! While the template uses shadcn/ui, you can replace it with any React component library.

**Q: How do I add API routes?**
A: Create files in the `app/api/` directory. These routes will be available regardless of locale.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (optional)
4. Deploy

### Other Platforms

The template works with any platform that supports Next.js:
- Railway
- Render
- Fly.io
- AWS Amplify
- Netlify

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [next-intl Documentation](https://next-intl.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [Vercel](https://vercel.com) for the amazing deployment platform
- [next-intl](https://next-intl.dev) for the internationalization support
- [Tailwind CSS](https://tailwindcss.com) for the styling system

---

Built with ❤️ by [devxiyang](https://twitter.com/devxiyang)