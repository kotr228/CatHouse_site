import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import OrderForm from '@/components/OrderForm';
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
    title: t('contactTitle'),
    description: t('contactDescription'),
  };
}

export default async function ContactPage({ params: { locale } }: PageProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left side - info */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-base mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-text-muted text-lg mb-10">{t('contact.subtitle')}</p>

          <div className="space-y-6">
            {[
              {
                icon: '⚡',
                title: 'Fast Response',
                desc: 'We reply to all inquiries within 24 hours.',
              },
              {
                icon: '🔒',
                title: 'NDA Available',
                desc: 'Your project details are always kept confidential.',
              },
              {
                icon: '🌍',
                title: 'Global Team',
                desc: 'We work across all time zones and speak 4 languages.',
              },
              {
                icon: '💡',
                title: 'Free Consultation',
                desc: 'Get expert advice on your project at no cost.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="text-text-base font-semibold mb-1">{item.title}</h3>
                  <p className="text-text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - form */}
        <div className="bg-gradient-card border border-white/10 rounded-2xl p-8">
          <OrderForm locale={locale as Locale} />
        </div>
      </div>
    </div>
  );
}
