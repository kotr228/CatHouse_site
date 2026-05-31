import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd, { getOrganizationJsonLd } from '@/components/JsonLd';
import { locales, type Locale } from '@/i18n';
import { AnimationContextProvider } from '@/components/AnimationContext';
import PageTransition from '@/components/PageTransition';
import prisma from '@/lib/prisma';
import { getSiteName } from '@/lib/getSiteName';

interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: LayoutProps): Promise<Metadata> {
  const [t, siteName] = await Promise.all([
    getTranslations({ locale, namespace: 'meta' }),
    getSiteName(),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cathouse-site.onrender.com';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: t('homeDescription'),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },
    openGraph: {
      type: 'website',
      locale,
      siteName,
      title: siteName,
      description: t('homeDescription'),
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: t('homeDescription'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: LayoutProps) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cathouse-site.onrender.com';

  let animationVariant = 'fade';
  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DevStudio';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings?.animationVariant) animationVariant = settings.animationVariant;
    if (settings?.siteName) siteName = settings.siteName;
  } catch {
    // Use defaults
  }

  return (
    <>
      <JsonLd data={getOrganizationJsonLd(siteUrl, siteName)} />
      <NextIntlClientProvider messages={messages}>
        <AnimationContextProvider value={animationVariant}>
          <Header locale={locale as Locale} />
          <main className="min-h-screen pt-16">
            <PageTransition variant={animationVariant}>{children}</PageTransition>
          </main>
          <Footer locale={locale as Locale} />
        </AnimationContextProvider>
      </NextIntlClientProvider>
    </>
  );
}
