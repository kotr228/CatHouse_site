import { MetadataRoute } from 'next';
import { locales } from '@/i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cathouse-site.onrender.com';

const pages = ['', '/services', '/pricing', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
