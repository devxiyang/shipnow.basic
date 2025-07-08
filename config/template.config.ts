/**
 * SaaS Template Configuration
 * 
 * This file contains all customizable settings for the SaaS template.
 * Modify these values to quickly adapt the template for different projects.
 */

// ============= BRANDING & IDENTITY =============
export const BRANDING = {
  // Basic brand information
  name: "ShipNow",
  tagline: "Simple Independent Website", 
  description: "A clean Next.js template with internationalization support. Perfect for simple independent websites.",
  
  // Contact & Social
  email: "support@shipnow.pro",
  twitter: "@shipnow",
  website: "https://shipnow.pro",
  
  // Logo configuration
  logo: {
    text: "ShipNow", // Text-based logo
    icon: "🚀", // Emoji or icon
    // image: "/logo.png", // Uncomment for image logo
  }
} as const;

// ============= SITE CONFIGURATION =============
export const SITE_CONFIG = {
  title: "ShipNow - Simple Independent Website",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://shipnow.pro",
  version: "1.0.0",
} as const;

// ============= CONTENT TEMPLATES =============
export const CONTENT = {
  // Hero section
  hero: {
    badge: "🚀 Launch faster with ShipNow",
    headline: "Build your SaaS",
    highlightedText: " in days",
    subtitle: "The complete Next.js template with everything you need to launch your SaaS. Authentication, payments, and subscriptions included.",
    primaryCTA: "Get Started",
    secondaryCTA: "View Features"
  },
  
  // Features section
  features: {
    title: "Everything you need to ship fast",
    subtitle: "Stop building auth and payments from scratch. Focus on your product.",
    list: [
      {
        icon: "Shield",
        title: "Supabase Auth",
        description: "Google One-Tap login, secure authentication, and user management out of the box."
      },
      {
        icon: "CreditCard", 
        title: "Stripe Payments",
        description: "Subscription management, customer portal, and webhook handling configured."
      },
      {
        icon: "Code2",
        title: "Modern Stack", 
        description: "Next.js 15, React 19, TypeScript, Tailwind CSS v4, and Prisma ORM."
      },
      {
        icon: "Zap",
        title: "Server Actions",
        description: "Type-safe server actions for data mutations with automatic revalidation."
      },
      {
        icon: "Users",
        title: "User Dashboard",
        description: "Profile management, subscription status, and usage tracking included."
      },
      {
        icon: "CheckCircle2",
        title: "Production Ready", 
        description: "Error handling, loading states, and responsive design implemented."
      }
    ]
  },
  
  // Pricing section
  pricing: {
    title: "Simple, transparent pricing",
    subtitle: "Choose the plan that fits your needs",
    currency: "USD",
    plans: [
      {
        name: "Standard",
        description: "Perfect for getting started",
        price: 4.90,
        interval: "month",
        features: [
          "Basic features",
          "100 API calls/month", 
          "Email support"
        ],
        cta: "Get Started",
        popular: false
      },
      {
        name: "Pro",
        description: "For growing businesses", 
        price: 9.90,
        interval: "month",
        features: [
          "All Standard features",
          "Unlimited API calls",
          "Priority support",
          "Advanced analytics"
        ],
        cta: "Upgrade to Pro",
        popular: true
      }
    ]
  },
  
  // Call-to-action section
  cta: {
    title: "Ready to launch your SaaS?",
    subtitle: "Skip weeks of development. Get your SaaS up and running today.",
    button: "Start Building Now"
  }
} as const;

// ============= MODAL CONTENT =============
export const MODALS = {
  // Authentication Modal
  auth: {
    title: "Sign in to continue",
    subtitle: "Use your Google account",
    button: "Continue with Google",
    loadingText: "Signing in...",
    disclaimer: "By continuing, you agree to our Terms & Privacy Policy",
    successMessage: "Login successful"
  },
  
  // Upgrade Modal
  upgrade: {
    title: "Choose Your Plan",
    subtitle: "Upgrade your plan to access this feature",
    anonymousSubtitle: "Sign in and upgrade to access premium features",
    billingToggle: {
      monthly: "Monthly",
      annually: "Annually",
      annualDiscount: "2 months free"
    },
    plans: {
      standard: {
        name: "Standard Plan",
        description: "Perfect for regular users",
        features: [
          "Unlimited API calls",
          "All premium features", 
          "Data export"
        ],
        excludedFeatures: [
          "Advanced analytics"
        ],
        button: "Get Started"
      },
      pro: {
        name: "Pro Plan",
        description: "For power users",
        badge: "Recommended",
        features: [
          "Unlimited API calls",
          "All premium features",
          "Data export",
          "Advanced analytics"
        ],
        button: "Get Pro"
      }
    },
    buttons: {
      maybeLater: "Maybe Later",
      createCheckout: "Creating Checkout..."
    },
    messages: {
      signInFirst: "Please sign in first to continue with your subscription",
      checkoutError: "Failed to start checkout. Please try again."
    }
  },
  
  // Usage Limit Modal
  usageLimit: {
    title: "Daily limit reached",
    subtitle: "You've used all your free attempts today. Upgrade for unlimited access",
    anonymousSubtitle: "Sign up to get more daily usage, or upgrade for unlimited access",
    resetInfo: {
      title: "Usage resets daily",
      subtitle: "New attempts available at midnight"
    },
    upgradeCard: {
      title: "Get Unlimited Access",
      subtitle: "No more daily limits"
    },
    buttons: {
      tryTomorrow: "Try Tomorrow",
      maybeLater: "Maybe Later"
    }
  }
} as const;

// ============= NAVIGATION =============
export const NAVIGATION = {
  main: [
    {
      title: "Features",
      href: "#features",
      description: "Everything you need to launch"
    },
    {
      title: "Pricing", 
      href: "#pricing",
      description: "Simple, transparent pricing"
    },
    {
      title: "Dashboard",
      href: "/userprofile",
      description: "Manage your account"
    }
  ],
  
  footer: [
    {
      title: "Product",
      links: [
        { title: "Features", href: "#features" },
        { title: "Pricing", href: "#pricing" },
        { title: "Dashboard", href: "/userprofile" }
      ]
    },
    {
      title: "Legal", 
      links: [
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Terms of Service", href: "/terms-of-service" }
      ]
    }
  ]
} as const;

// ============= SEO & ANALYTICS =============
export const SEO = {
  keywords: [
    "nextjs saas template",
    "saas boilerplate", 
    "nextjs starter",
    "stripe integration",
    "supabase auth",
    "react saas template",
    "typescript saas",
    "saas starter kit",
    "ship fast"
  ],
  
  // Google Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US"
  }
} as const;

// ============= SUBSCRIPTION PLANS =============
export const SUBSCRIPTION_PLANS = {
  STANDARD: {
    name: "Standard", 
    price: 4.90,
    interval: "month" as const,
    features: ["Basic features", "100 API calls/month", "Email support"],
    // Note: Actual Stripe price IDs are configured in stripe.config.ts
  },
  PRO: {
    name: "Pro",
    price: 9.90, 
    interval: "month" as const,
    features: ["All Standard features", "Unlimited API calls", "Priority support", "Advanced analytics"]
    // Note: Actual Stripe price IDs are configured in stripe.config.ts
  }
} as const;

// ============= FEATURE FLAGS =============
export const FEATURES = {
  // Authentication options
  auth: {
    googleOneTap: true,
    emailSignup: false,
    socialLogin: true
  },
  
  // Payment options  
  payments: {
    stripe: true,
    lemonsqueezy: false,
    paddle: false
  },
  
  // UI features
  ui: {
    darkMode: true,
    animations: true,
    blogSection: false,
    testimonials: false
  },
  
  // Analytics & Tracking
  analytics: {
    googleAnalytics: true,
    hotjar: false,
    mixpanel: false
  }
} as const;

// Helper function to get environment-specific URL
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_SITE_URL || BRANDING.website;
}

// Type exports for TypeScript support
export type BrandingConfig = typeof BRANDING;
export type SiteConfig = typeof SITE_CONFIG;
export type ContentConfig = typeof CONTENT;
export type ModalsConfig = typeof MODALS;
export type NavigationConfig = typeof NAVIGATION;
export type SEOConfig = typeof SEO;
export type SubscriptionPlansConfig = typeof SUBSCRIPTION_PLANS;
export type FeaturesConfig = typeof FEATURES;