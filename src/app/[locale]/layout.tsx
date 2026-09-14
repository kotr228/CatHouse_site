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
import { siteUrl, buildAlternates, buildOpenGraph, buildTwitter } from '@/lib/seo';

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
  const description = t('homeDescription');

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(siteUrl),
    alternates: buildAlternates(locale as Locale, ''),
    openGraph: buildOpenGraph({ locale: locale as Locale, siteName, title: siteName, description, path: '' }),
    twitter: buildTwitter({ title: siteName, description }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    formatDetection: {
      telephone: false,
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export default async function LocaleLayout({ children, params: { locale } }: LayoutProps) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  let animationVariant = 'fade';
  let siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DevStudio';
  let jsonLdEmail: string | null = null;
  const sameAs: string[] = [];
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings?.animationVariant) animationVariant = settings.animationVariant;
    if (settings?.siteName) siteName = settings.siteName;
    if (settings?.contactEmailVisible && settings.contactEmail) jsonLdEmail = settings.contactEmail;
    if (settings?.contactTelegramVisible && settings.contactTelegram) {
      sameAs.push(
        settings.contactTelegram.startsWith('http')
          ? settings.contactTelegram
          : `https://t.me/${settings.contactTelegram.replace(/^@/, '')}`
      );
    }
    if (settings?.contactWhatsappVisible && settings.contactWhatsapp) {
      sameAs.push(`https://wa.me/${settings.contactWhatsapp.replace(/\D/g, '')}`);
    }
  } catch {
    // Use defaults
  }

  return (
    <>
      <JsonLd
        data={getOrganizationJsonLd(siteUrl, siteName, {
          locale,
          email: jsonLdEmail,
          sameAs,
        })}
      />
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
