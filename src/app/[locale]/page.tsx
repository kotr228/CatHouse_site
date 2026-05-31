import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import ServiceCard from '@/components/ServiceCard';
import AnimationWrapper from '@/components/AnimationWrapper';
import prisma from '@/lib/prisma';
import { getSiteName } from '@/lib/getSiteName';
import type { Locale } from '@/i18n';

import { locales } from '@/i18n';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const [t, siteName] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getSiteName(),
  ]);
  return {
    title: siteName,
    description: t('homeDescription'),
  };
}

export default async function HomePage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 3,
    include: {
      translations: {
        where: { locale },
      },
      prices: {
        where: { isActive: true },
        take: 1,
      },
    },
  }).catch(() => []);

  // Fetch animation variant from settings
  let animationVariant: 'fade' | 'slide' | 'scale' | 'bounce' | 'none' = 'fade';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings?.animationVariant) {
      animationVariant = settings.animationVariant as typeof animationVariant;
    }
  } catch {
    // Use default
  }

  // Fetch hero content from DB, fallback to translation strings
  let heroContent = {
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    ctaPrimary: t('hero.cta'),
    ctaSecondary: t('hero.ctaSecondary'),
  };
  try {
    const dbHero = await prisma.heroContent.findUnique({ where: { locale } });
    if (dbHero) {
      heroContent = {
        title: dbHero.title,
        subtitle: dbHero.subtitle,
        ctaPrimary: dbHero.ctaPrimary,
        ctaSecondary: dbHero.ctaSecondary,
      };
    }
  } catch {
    // Use defaults
  }

  // Fetch stats from DB
  let dbStats: Array<{ id: string; value: string; labelUk: string; labelEn: string; labelPl: string; labelLt: string; order: number; isVisible: boolean }> = [];
  try {
    dbStats = await prisma.statItem.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    // Use empty
  }

  // Fetch block visibility
  let blockMap: Record<string, boolean> = {};
  try {
    const blocks = await prisma.pageBlock.findMany();
    blockMap = Object.fromEntries(blocks.map((b: { id: string; isVisible: boolean }) => [b.id, b.isVisible]));
  } catch {
    // All visible by default
  }
  const isVisible = (key: string) => blockMap[key] !== false;

  // Helper to get stat label by locale
  const getStatLabel = (stat: typeof dbStats[0]) => {
    switch (locale) {
      case 'en': return stat.labelEn;
      case 'pl': return stat.labelPl;
      case 'lt': return stat.labelLt;
      default: return stat.labelUk;
    }
  };

  // Fallback static stats if no DB stats
  const fallbackStats = [
    { key: 'projects', value: '120+' },
    { key: 'clients', value: '85+' },
    { key: 'years', value: '5+' },
    { key: 'uptime', value: '99.9%' },
  ];

  return (
    <>
      {/* Hero */}
      {isVisible('hero') && (
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-card) 40%, color-mix(in srgb, var(--color-primary) 20%, var(--color-bg-card)) 100%)' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: 'var(--color-primary)' }} />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: 'var(--color-secondary)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-5"
              style={{ backgroundColor: 'var(--color-bg-card)' }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <AnimationWrapper variant={animationVariant} delay={0}>
                <div
                  className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                    Available for new projects
                  </span>
                </div>
              </AnimationWrapper>
              <AnimationWrapper variant={animationVariant} delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-base leading-tight mb-6">
                  {heroContent.title}
                </h1>
              </AnimationWrapper>
              <AnimationWrapper variant={animationVariant} delay={200}>
                <p className="text-lg sm:text-xl text-text-muted mb-8 leading-relaxed">
                  {heroContent.subtitle}
                </p>
              </AnimationWrapper>
              <AnimationWrapper variant={animationVariant} delay={300}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/${locale}/contact`}
                    className="px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-200"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {heroContent.ctaPrimary}
                  </Link>
                  <Link
                    href={`/${locale}/services`}
                    className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-text-base font-semibold rounded-xl transition-all duration-200 border border-white/10"
                  >
                    {heroContent.ctaSecondary}
                  </Link>
                </div>
              </AnimationWrapper>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {isVisible('stats') && (
        <section className="bg-bg-card border-y border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {dbStats.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {dbStats.map((stat) => (
                  <div key={stat.id} className="text-center">
                    <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-primary)' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-muted">{getStatLabel(stat)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {fallbackStats.map((stat) => (
                  <div key={stat.key} className="text-center">
                    <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-primary)' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-muted">{t(`stats.${stat.key}`)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Services preview */}
      {isVisible('services') && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-base mb-4">{t('services.title')}</h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(services as typeof services).map((service: typeof services[number], index: number) => {
              const translation = service.translations[0];
              if (!translation) return null;
              const price = service.prices[0];
              return (
                <AnimationWrapper key={service.id} variant={animationVariant} delay={index * 150}>
                  <ServiceCard
                    slug={service.slug}
                    icon={service.icon}
                    title={translation.title}
                    description={translation.description}
                    features={translation.features}
                    locale={locale as Locale}
                    learnMoreLabel={t('services.learnMore')}
                    startingPrice={price ? { amount: price.amount.toString(), currency: price.currency } : null}
                  />
                </AnimationWrapper>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 px-6 py-3 border rounded-xl transition-all duration-200 text-sm font-medium"
              style={{
                borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                color: 'var(--color-primary)',
              }}
            >
              {t('services.allServices')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      {isVisible('contact') && (
        <section
          className="border-y border-white/10 py-16"
          style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-primary) 40%, var(--color-bg-card)), color-mix(in srgb, var(--color-secondary) 40%, var(--color-bg-card)))' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-text-base mb-4">{t('contact.title')}</h2>
            <p className="text-text-muted text-lg mb-8">{t('contact.subtitle')}</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              style={{ color: 'var(--color-primary)' }}
            >
              {heroContent.ctaPrimary}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
