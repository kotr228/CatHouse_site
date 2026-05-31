import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import PricingCard from '@/components/PricingCard';
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
    title: `${t('pricingTitle')} | ${siteName}`,
    description: t('pricingDescription'),
  };
}

export default async function PricingPage({ params: { locale } }: PageProps) {
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

  // Mark the 2nd item (index 1) as popular
  const popularIndex = 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-base mb-4">
          {t('pricing.title')}
        </h1>
        <p className="text-text-muted text-xl max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(services as typeof services).map((service: typeof services[number], index: number) => {
          const translation = service.translations[0];
          const price = service.prices[0];
          if (!translation || !price) return null;

          return (
            <PricingCard
              key={service.id}
              title={translation.title}
              description={translation.description}
              features={translation.features}
              amount={price.amount.toString()}
              currency={price.currency}
              period={price.period}
              isPopular={index === popularIndex}
              locale={locale as Locale}
              fromLabel={t('pricing.from')}
              getStartedLabel={t('pricing.getStarted')}
              mostPopularLabel={t('pricing.mostPopular')}
            />
          );
        })}
      </div>

      {/* FAQ / Note */}
      <div className="mt-16 text-center">
        <p className="text-text-muted text-sm max-w-xl mx-auto">
          All prices are starting rates and may vary depending on project complexity and requirements.
          Contact us for a custom quote.
        </p>
      </div>
    </div>
  );
}
