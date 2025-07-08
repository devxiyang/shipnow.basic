import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/config/site.config";
import { CONTENT } from "@/config/template.config";
import { CheckCircle2 } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
  },
};

export default function HomePage() {
  const t = useTranslations('hero')
  const tFeatures = useTranslations('features')
  const tPricing = useTranslations('pricing')
  const tCta = useTranslations('cta')
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Header />
        
        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-1.5">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('headline')}
              <span className="text-primary">{t('highlightedText')}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/userprofile">{t('primaryCTA')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#features">{t('secondaryCTA')}</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {tFeatures('title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {tFeatures('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['auth', 'payments', 'ui', 'performance'] as const).map((featureKey, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DynamicIcon name={CONTENT.features.list[index]?.icon || 'Shield'} className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{tFeatures(`${featureKey}.title`)}</h3>
                    <p className="text-muted-foreground">
                      {tFeatures(`${featureKey}.description`)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {tPricing('title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {tPricing('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{tPricing('standard.name')}</h3>
                  <p className="text-muted-foreground">{tPricing('standard.description')}</p>
                </div>
                <div className="text-4xl font-bold">
                  ${CONTENT.pricing.plans[0].price}<span className="text-lg font-normal text-muted-foreground">/{CONTENT.pricing.plans[0].interval}</span>
                </div>
                <ul className="space-y-3">
                  {(tPricing.raw('standard.features') as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/userprofile">{CONTENT.pricing.plans[0].cta}</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-primary">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">{tPricing('pro.name')}</h3>
                    <Badge>{tPricing('pro.popular')}</Badge>
                  </div>
                  <p className="text-muted-foreground">{tPricing('pro.description')}</p>
                </div>
                <div className="text-4xl font-bold">
                  ${CONTENT.pricing.plans[1].price}<span className="text-lg font-normal text-muted-foreground">/{CONTENT.pricing.plans[1].interval}</span>
                </div>
                <ul className="space-y-3">
                  {(tPricing.raw('pro.features') as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/userprofile">{CONTENT.pricing.plans[1].cta}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {tCta('title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tCta('subtitle')}
            </p>
          </div>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/userprofile">{tCta('button')}</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}