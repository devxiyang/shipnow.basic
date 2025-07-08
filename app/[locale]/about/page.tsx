import { useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANDING } from '@/config/template.config';

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              {t('badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* About Content */}
          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🚀</span>
                <h2 className="text-2xl font-semibold">{t('mission.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('mission.description')}
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🌍</span>
                <h2 className="text-2xl font-semibold">{t('vision.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('vision.description')}
              </p>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.i18n.title')}</h3>
                <p className="text-muted-foreground">{t('features.i18n.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.performance.title')}</h3>
                <p className="text-muted-foreground">{t('features.performance.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.design.title')}</h3>
                <p className="text-muted-foreground">{t('features.design.description')}</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">{t('tech.title')}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Next.js 15', description: t('tech.nextjs') },
                { name: 'React 19', description: t('tech.react') },
                { name: 'TypeScript', description: t('tech.typescript') },
                { name: 'Tailwind CSS v4', description: t('tech.tailwind') },
                { name: 'next-intl', description: t('tech.nextintl') },
                { name: 'shadcn/ui', description: t('tech.shadcn') }
              ].map((tech) => (
                <Card key={tech.name} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-primary mb-2">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/devxiyang/shipnow.basic"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('cta.github')}
              </a>
              <a
                href={`https://twitter.com/${BRANDING.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                {t('cta.twitter')}
              </a>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}