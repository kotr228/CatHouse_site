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

    const stringFields = [
      'logoText', 'logoImageUrl', 'siteName', 'siteTagline',
      'colorPrimary', 'colorSecondary', 'colorAccent',
      'colorBg', 'colorBgCard', 'colorText', 'colorTextMuted',
      'bgType', 'animationVariant',
      'contactEmail', 'contactTelegram', 'contactViber', 'contactWhatsapp',
    ] as const;

    const boolFields = [
      'contactEmailVisible', 'contactTelegramVisible',
      'contactViberVisible', 'contactWhatsappVisible',
    ] as const;

    const data: Record<string, string | boolean> = {};

    for (const field of stringFields) {
      if (body[field] !== undefined) data[field] = body[field];
    }
    for (const field of boolFields) {
      if (body[field] !== undefined) data[field] = Boolean(body[field]);
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
