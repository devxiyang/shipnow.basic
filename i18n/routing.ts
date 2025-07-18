import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always'
});