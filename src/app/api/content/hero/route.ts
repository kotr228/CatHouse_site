import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const heroes = await prisma.heroContent.findMany();
    return NextResponse.json(heroes);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // body is an object keyed by locale: { uk: { title, subtitle, ctaPrimary, ctaSecondary }, ... }
    const results = [];
    for (const [locale, data] of Object.entries(body)) {
      const d = data as { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
      const record = await prisma.heroContent.upsert({
        where: { locale },
        update: {
          title: d.title,
          subtitle: d.subtitle,
          ctaPrimary: d.ctaPrimary,
          ctaSecondary: d.ctaSecondary,
        },
        create: {
          id: locale,
          locale,
          title: d.title,
          subtitle: d.subtitle,
          ctaPrimary: d.ctaPrimary,
          ctaSecondary: d.ctaSecondary,
        },
      });
      results.push(record);
    }
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
