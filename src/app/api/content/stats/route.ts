import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const stats = await prisma.statItem.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
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
    const stat = await prisma.statItem.create({
      data: {
        value: body.value ?? '',
        labelUk: body.labelUk ?? '',
        labelEn: body.labelEn ?? '',
        labelPl: body.labelPl ?? '',
        labelLt: body.labelLt ?? '',
        order: body.order ?? 0,
        isVisible: body.isVisible ?? true,
      },
    });
    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error creating stat:', error);
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
    // body is an array of stat items
    const items = body as Array<{
      id: string;
      value: string;
      labelUk: string;
      labelEn: string;
      labelPl: string;
      labelLt: string;
      order: number;
      isVisible: boolean;
    }>;

    const results = [];
    for (const item of items) {
      const record = await prisma.statItem.upsert({
        where: { id: item.id },
        update: {
          value: item.value,
          labelUk: item.labelUk,
          labelEn: item.labelEn,
          labelPl: item.labelPl,
          labelLt: item.labelLt,
          order: item.order,
          isVisible: item.isVisible,
        },
        create: {
          id: item.id,
          value: item.value,
          labelUk: item.labelUk,
          labelEn: item.labelEn,
          labelPl: item.labelPl,
          labelLt: item.labelLt,
          order: item.order,
          isVisible: item.isVisible,
        },
      });
      results.push(record);
    }
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }
    await prisma.statItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
