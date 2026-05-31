import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AdminOrdersClient from './OrdersClient';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const [orders, stats] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ]);

  const statMap = Object.fromEntries(
    stats.map((s: { status: string; _count: { id: number } }) => [s.status, s._count.id])
  );

  return (
    <AdminOrdersClient
      orders={orders.map((o: typeof orders[number]) => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        phone: o.phone ?? null,
      }))}
      stats={{
        total: orders.length,
        new: statMap['NEW'] || 0,
        inProgress: statMap['IN_PROGRESS'] || 0,
        completed: statMap['COMPLETED'] || 0,
      }}
    />
  );
}
