import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, icon, order, isActive, translations, price } = body;

    const updateData: {
      slug?: string;
      icon?: string | null;
      order?: number;
      isActive?: boolean;
    } = {};

    if (slug !== undefined) updateData.slug = slug;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update service base fields
    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData,
    });

    // Update translations if provided
    if (translations && Array.isArray(translations)) {
      for (const t of translations as {
        locale: string;
        title: string;
        description: string;
        features: string[];
      }[]) {
        await prisma.serviceTranslation.upsert({
          where: { serviceId_locale: { serviceId: params.id, locale: t.locale } },
          update: {
            title: t.title || '',
            description: t.description || '',
            features: t.features || [],
          },
          create: {
            serviceId: params.id,
            locale: t.locale,
            title: t.title || '',
            description: t.description || '',
            features: t.features || [],
          },
        });
      }
    }

    // Update/create price if provided
    if (price) {
      const existingPrice = await prisma.price.findFirst({
        where: { serviceId: params.id, isActive: true },
      });

      if (existingPrice) {
        await prisma.price.update({
          where: { id: existingPrice.id },
          data: {
            amount: price.amount,
            currency: price.currency || 'USD',
            period: price.period || null,
          },
        });
      } else {
        await prisma.price.create({
          data: {
            serviceId: params.id,
            amount: price.amount,
            currency: price.currency || 'USD',
            period: price.period || null,
            isActive: true,
          },
        });
      }
    }

    // Return updated service with all relations
    const updated = await prisma.service.findUnique({
      where: { id: params.id },
      include: { translations: true, prices: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.service.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
