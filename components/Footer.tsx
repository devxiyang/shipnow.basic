'use client'

import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { NAVIGATION } from '@/config/template.config';
import { Twitter, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')
  
  return (
    <footer className="mt-16 bg-gradient-to-t from-muted/30 to-background border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity group">
              <div className="text-xl group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="font-semibold">{siteConfig.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {siteConfig.description}
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('product')}</h4>
            <div className="flex flex-col space-y-2 text-sm">
              {NAVIGATION.footer[0].links.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  {tNav(link.title.toLowerCase())}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('legal')}</h4>
            <div className="flex flex-col space-y-2 text-sm">
              {NAVIGATION.footer[1].links.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  {t(link.title === 'Privacy Policy' ? 'privacyPolicy' : 'termsOfService')}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border/60">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Social Links */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
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
                href="https://github.com/devxiyang/shipnow.basic"
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
              <span>© {new Date().getFullYear()} {siteConfig.name}. {t('copyright')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}