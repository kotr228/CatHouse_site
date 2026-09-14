import { locales, defaultLocale, type Locale } from '@/i18n';

/** All indexable static routes, relative to a locale segment (no trailing slash, '' = home). */
export const routes = ['', '/services', '/pricing', '/contact'] as const;
export type Route = (typeof routes)[number];

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://cathouse-site.onrender.com'
).replace(/\/$/, '');

/** Build the absolute URL for a given locale + route. */
export function localizedUrl(locale: string, path: Route | string = ''): string {
  return `${siteUrl}/${locale}${path}`;
}

/**
 * Build `alternates.canonical` + `alternates.languages` (hreflang, including
 * `x-default`) for a given route, to be spread into `generateMetadata`.
 */
export function buildAlternates(locale: Locale, path: Route | string = '') {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = localizedUrl(l, path);
  }
  languages['x-default'] = localizedUrl(defaultLocale, path);

  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}

/** BCP 47 locale tags OpenGraph expects (og:locale / og:locale:alternate). */
const ogLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  uk: 'uk_UA',
  pl: 'pl_PL',
  lt: 'lt_LT',
};

/**
 * Build a complete `openGraph` metadata object. Next.js does NOT deep-merge
 * `openGraph`/`twitter` between a layout and a page — a page-level export
 * fully replaces the parent's object — so every `generateMetadata` (layout
 * and every page) must build the *whole* object via this helper rather than
 * spreading a partial `{ title, description }`, or fields like `type` and
 * `siteName` silently disappear on pages that override it.
 */
export function buildOpenGraph(params: {
  locale: Locale;
  siteName: string;
  title: string;
  description: string;
  path?: Route | string;
}) {
  const { locale, siteName, title, description, path = '' } = params;
  return {
    type: 'website' as const,
    url: localizedUrl(locale, path),
    locale: ogLocaleMap[locale] ?? locale,
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocaleMap[l] ?? l),
    siteName,
    title,
    description,
  };
}

/**
 * Build a complete `twitter` metadata object — see {@link buildOpenGraph} for
 * why every segment must build the whole object rather than a partial one.
 */
export function buildTwitter(params: { title: string; description: string }) {
  return {
    card: 'summary_large_image' as const,
    title: params.title,
    description: params.description,
  };
}
