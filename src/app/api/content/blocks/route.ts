import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

const defaultBlocks = [
  { id: 'hero', label: 'Hero Section', isVisible: true, order: 0 },
  { id: 'stats', label: 'Stats', isVisible: true, order: 1 },
  { id: 'services', label: 'Services', isVisible: true, order: 2 },
  { id: 'pricing', label: 'Pricing', isVisible: true, order: 3 },
  { id: 'contact', label: 'Contact Form', isVisible: true, order: 4 },
];

export async function GET() {
  try {
    let blocks = await prisma.pageBlock.findMany({ orderBy: { order: 'asc' } });

    if (blocks.length === 0) {
      // Seed defaults
      await prisma.pageBlock.createMany({ data: defaultBlocks, skipDuplicates: true });
      blocks = await prisma.pageBlock.findMany({ orderBy: { order: 'asc' } });
    }

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('Error fetching blocks:', error);
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
    // body: Record<string, boolean> — id -> isVisible
    const updates = body as Record<string, boolean>;

    const results = [];
    for (const [id, isVisible] of Object.entries(updates)) {
      const defaultBlock = defaultBlocks.find((b) => b.id === id);
      const record = await prisma.pageBlock.upsert({
        where: { id },
        update: { isVisible },
        create: {
          id,
          label: defaultBlock?.label ?? id,
          isVisible,
          order: defaultBlock?.order ?? 99,
        },
      });
      results.push(record);
    }
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error updating blocks:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
