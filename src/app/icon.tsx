import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  let letter = 'D';
  let primary = '#6366f1';
  let secondary = '#8b5cf6';
  let logoImageUrl: string | null = null;

  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (s?.siteName) letter = s.siteName.charAt(0).toUpperCase();
    if (s?.colorPrimary) primary = s.colorPrimary;
    if (s?.colorSecondary) secondary = s.colorSecondary;
    if (s?.logoImageUrl) logoImageUrl = s.logoImageUrl;
  } catch {
    // Use defaults
  }

  if (logoImageUrl) {
    return new ImageResponse(
      <img src={logoImageUrl} width={32} height={32} style={{ borderRadius: 8, objectFit: 'contain' }} />,
      { ...size }
    );
  }

  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 700,
        fontSize: 18,
        fontFamily: 'sans-serif',
      }}
    >
      {letter}
    </div>,
    { ...size }
  );
}
