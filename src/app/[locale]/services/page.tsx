import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getSiteName } from '@/lib/getSiteName';
import { locales, type Locale } from '@/i18n';

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
    title: `${t('servicesTitle')} | ${siteName}`,
    description: t('servicesDescription'),
  };
}

export default async function ServicesPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      translations: { where: { locale } },
      prices: { where: { isActive: true }, take: 1 },
    },
  }).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-base mb-4">
          {t('services.title')}
        </h1>
        <p className="text-text-muted text-xl max-w-2xl mx-auto">{t('services.subtitle')}</p>
      </div>

      {/* Services list */}
      <div className="space-y-12">
        {(services as typeof services).map((service: typeof services[number], index: number) => {
          const translation = service.translations[0];
          const price = service.prices[0];
          if (!translation) return null;

          const isEven = index % 2 === 0;

          return (
            <div
              key={service.id}
              id={service.slug}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center bg-gradient-card border border-white/10 rounded-2xl p-8 transition-all duration-300`}
              style={{ ['--hover-border' as string]: 'var(--color-primary)' }}
              onMouseEnter={undefined}
            >
              {/* Icon side */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col items-center text-center">
                <div className="text-6xl mb-4">{service.icon || '⚡'}</div>
                {price && (
                  <div
                    className="border rounded-xl p-3 text-center"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                    }}
                  >
                    <div className="text-xs text-text-muted mb-1">{t('pricing.from')}</div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      ${Number(price.amount).toLocaleString()}
                    </div>
                    {price.period && (
                      <div className="text-xs text-text-muted">/ {price.period}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-base mb-3">{translation.title}</h2>
                <p className="text-text-muted mb-6 leading-relaxed">{translation.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {translation.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-text-base">
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: 'var(--color-primary)' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
