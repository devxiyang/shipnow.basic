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
  twitter: "devxiyang",
  website: "https://github.com/devxiyang/shipnow.basic",
  
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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://github.com/devxiyang/shipnow.basic",
  version: "1.0.0",
} as const;

// ============= CONTENT TEMPLATES =============
export const CONTENT = {
  // Hero section
  hero: {
    badge: "🚀 Simple & Clean",
    headline: "Build your website",
    highlightedText: " quickly",
    subtitle: "A clean Next.js template with internationalization support. Perfect for simple independent websites and landing pages.",
    primaryCTA: "Get Started",
    secondaryCTA: "View Features"
  },
  
  // Features section
  features: {
    title: "Everything you need for a modern website",
    subtitle: "Clean, responsive, and ready to customize for your needs.",
    list: [
      {
        icon: "Globe",
        title: "Internationalization",
        description: "Built-in support for multiple languages with automatic routing and localization."
      },
      {
        icon: "Code2",
        title: "Modern Stack", 
        description: "Next.js 15, React 19, TypeScript, Tailwind CSS v4 for the best developer experience."
      },
      {
        icon: "Zap",
        title: "Server Components",
        description: "Optimized performance with React Server Components and Next.js App Router."
      },
      {
        icon: "Palette",
        title: "Dark Mode",
        description: "Beautiful dark and light themes with smooth transitions and theme persistence."
      },
      {
        icon: "Mobile",
        title: "Responsive Design",
        description: "Fully responsive layout that works perfectly on all devices and screen sizes."
      },
      {
        icon: "CheckCircle2",
        title: "Production Ready", 
        description: "Error handling, loading states, and SEO optimization built right in."
      }
    ]
  },
  
  // Call-to-action section
  cta: {
    title: "Ready to build your website?",
    subtitle: "Get started with this clean, modern template today.",
    button: "Start Building Now"
  }
} as const;


// ============= NAVIGATION =============
export const NAVIGATION = {
  main: [
    {
      title: "Features",
      href: "#features",
      description: "Everything you need to build"
    },
    {
      title: "About", 
      href: "#about",
      description: "Learn more about this template"
    }
  ],
  
  footer: [
    {
      title: "Product",
      links: [
        { title: "Features", href: "#features" },
        { title: "About", href: "#about" }
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
    "nextjs template",
    "nextjs starter", 
    "react template",
    "typescript template",
    "tailwind template",
    "nextjs boilerplate",
    "i18n nextjs",
    "multilingual website",
    "responsive template"
  ],
  
  // Google Analytics
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US"
  }
} as const;


// ============= FEATURE FLAGS =============
export const FEATURES = {
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
  return process.env.NEXT_PUBLIC_SITE_URL || "https://github.com/devxiyang/shipnow.basic";
}

// Type exports for TypeScript support
export type BrandingConfig = typeof BRANDING;
export type SiteConfig = typeof SITE_CONFIG;
export type ContentConfig = typeof CONTENT;
export type NavigationConfig = typeof NAVIGATION;
export type SEOConfig = typeof SEO;
export type FeaturesConfig = typeof FEATURES;