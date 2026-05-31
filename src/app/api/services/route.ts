import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
      include: {
        translations: true,
        prices: true,
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, icon, order, isActive, translations, price } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required.' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        slug,
        icon: icon || null,
        order: order ?? 0,
        isActive: isActive ?? true,
        translations: {
          create: (translations || []).map((t: {
            locale: string;
            title: string;
            description: string;
            features: string[];
          }) => ({
            locale: t.locale,
            title: t.title || '',
            description: t.description || '',
            features: t.features || [],
          })),
        },
        prices: price
          ? {
              create: {
                amount: price.amount,
                currency: price.currency || 'USD',
                period: price.period || null,
                isActive: true,
              },
            }
          : undefined,
      },
      include: {
        translations: true,
        prices: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
