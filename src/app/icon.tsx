import { ImageResponse } from 'next/og';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const DATA_URL_PREFIX = 'base64,';

export default async function Icon() {
  try {
    // 1. Fetch the singleton settings record.
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    const logoImageUrl = settings?.logoImageUrl;

    // 2. Check it exists and looks like a base64 data URL image.
    const marker = logoImageUrl?.indexOf(DATA_URL_PREFIX) ?? -1;
    if (logoImageUrl && logoImageUrl.startsWith('data:image/') && marker !== -1) {
      // 3. Strip the "data:image/png;base64," prefix and decode to a Buffer.
      const base64Data = logoImageUrl.slice(marker + DATA_URL_PREFIX.length);
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 0) {
        // 4. Return the raw PNG bytes directly.
        return new Response(buffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=0, must-revalidate',
          },
        });
      }
    }
  } catch {
    // DB unreachable, query failed, etc. — fall through to the fallback below.
  }

  // 5. Fallback: a simple generated favicon (used when the DB query fails,
  // logoImageUrl is empty/invalid, or during the initial build phase).
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: 18,
          fontFamily: 'sans-serif',
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
