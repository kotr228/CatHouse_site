import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
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

    // Whitelist allowed fields
    const allowedFields = [
      'logoText',
      'logoImageUrl',
      'siteName',
      'siteTagline',
      'colorPrimary',
      'colorSecondary',
      'colorAccent',
      'colorBg',
      'colorBgCard',
      'colorText',
      'colorTextMuted',
      'bgType',
      'animationVariant',
    ] as const;

    type AllowedField = typeof allowedFields[number];
    const data: Partial<Record<AllowedField, string>> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
