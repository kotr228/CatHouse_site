import { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { routes, localizedUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: localizedUrl(locale, route),
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        // hreflang cross-links: every locale variant of this same route.
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, localizedUrl(l, route)])),
        },
      });
    }
  }

  return entries;
}
