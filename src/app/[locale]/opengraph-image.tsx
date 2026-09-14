import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import prisma from '@/lib/prisma';
import type { Locale } from '@/i18n';

export const dynamic = 'force-dynamic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'CatHouse — Professional Software Development';

interface Props {
  params: { locale: Locale };
}

export default async function OpengraphImage({ params: { locale } }: Props) {
  let siteName = 'CatHouse';
  let tagline = 'Professional Software Development';
  let primary = '#6366f1';
  let secondary = '#8b5cf6';
  let bg = '#020617';

  try {
    const [settings, t] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
      getTranslations({ locale, namespace: 'meta' }),
    ]);
    if (settings?.siteName) siteName = settings.siteName;
    if (settings?.siteTagline) tagline = settings.siteTagline;
    if (settings?.colorPrimary) primary = settings.colorPrimary;
    if (settings?.colorSecondary) secondary = settings.colorSecondary;
    if (settings?.colorBg) bg = settings.colorBg;
    tagline = t('homeDescription');
  } catch {
    // Use defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: `linear-gradient(135deg, ${bg} 0%, #0f1559 60%, ${bg} 100%)`,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            {siteName.charAt(0).toUpperCase()}
          </div>
          <span style={{ color: 'white', fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {siteName}
          </span>
        </div>
        <div
          style={{
            color: '#cbd5e1',
            fontSize: 30,
            maxWidth: 900,
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
