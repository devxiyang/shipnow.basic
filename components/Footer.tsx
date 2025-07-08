'use client'

import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { Mail, Twitter, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="mt-16 bg-gradient-to-t from-muted/30 to-background border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity group">
              <div className="text-xl group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-semibold">{siteConfig.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('resources')}</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/docs" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                {t('documentation')}
              </Link>
              <Link 
                href="/api" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                {t('apiReference')}
              </Link>
              <Link 
                href="/examples" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                {t('examples')}
              </Link>
              <Link 
                href="/blog" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                {t('blog')}
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-medium">Company</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/about" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Contact
              </Link>
              <Link 
                href="/careers" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Careers
              </Link>
              <Link 
                href="/partners" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Partners
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-medium">Legal</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/privacy-policy" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Cookie Policy
              </Link>
              <Link 
                href="/security" 
                className="text-muted-foreground hover:text-primary transition-colors w-fit"
              >
                Security
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border/60">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a 
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit group"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {siteConfig.email}
              </a>
              <a 
                href={`https://twitter.com/${siteConfig.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit group"
              >
                <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {siteConfig.twitter}
              </a>
              <a 
                href="https://github.com/shipnow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit group"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                GitHub
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}