import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { locales, type Locale } from '@/i18n';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('servicesTitle'),
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          {t('services.title')}
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">{t('services.subtitle')}</p>
      </div>

      {/* Services list */}
      <div className="space-y-12">
        {services.map((service, index) => {
          const translation = service.translations[0];
          const price = service.prices[0];
          if (!translation) return null;

          const isEven = index % 2 === 0;

          return (
            <div
              key={service.id}
              id={service.slug}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center bg-gradient-card border border-white/10 rounded-2xl p-8 hover:border-brand-500/30 transition-all duration-300`}
            >
              {/* Icon side */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col items-center text-center">
                <div className="text-6xl mb-4">{service.icon || '⚡'}</div>
                {price && (
                  <div className="bg-brand-600/20 border border-brand-500/30 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">{t('pricing.from')}</div>
                    <div className="text-2xl font-bold text-brand-400">
                      ${Number(price.amount).toLocaleString()}
                    </div>
                    {price.period && (
                      <div className="text-xs text-gray-400">/ {price.period}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">{translation.title}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">{translation.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {translation.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg
                        className="w-4 h-4 text-brand-400 flex-shrink-0"
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-colors"
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
