import { BRANDING, SITE_CONFIG, NAVIGATION, SEO } from "@/config/template.config";

export const siteConfig = {
  name: BRANDING.name,
  title: SITE_CONFIG.title,
  description: BRANDING.description,
  url: SITE_CONFIG.url,
  
  // Contact email and social
  email: BRANDING.email,
  twitter: BRANDING.twitter,
  
  // Version
  version: SITE_CONFIG.version,

  // Navigation links
  navigation: NAVIGATION.main,

  // SEO keywords
  keywords: SEO.keywords
};

export const analytics = {
  googleAnalyticsId: SEO.googleAnalyticsId || "G-X4ZC5VSGPM",
}
