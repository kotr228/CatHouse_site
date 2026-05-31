import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const services = await prisma.service.findMany({
    orderBy: { order: 'asc' },
    include: {
      translations: { where: { locale: 'en' } },
      prices: { where: { isActive: true }, take: 1 },
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-white font-bold">DevStudio</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-600/20 text-brand-300 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Services
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-navy-900 border-b border-white/10 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Services</h1>
        </header>

        <div className="p-6">
          <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Icon</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Slug</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Active</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Order</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const translation = service.translations[0];
                  const price = service.prices[0];
                  return (
                    <tr key={service.id} className="border-b border-white/5">
                      <td className="px-4 py-3 text-2xl">{service.icon}</td>
                      <td className="px-4 py-3 text-white text-sm font-medium">
                        {translation?.title || service.slug}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{service.slug}</td>
                      <td className="px-4 py-3 text-brand-400 text-sm">
                        {price ? `$${Number(price.amount).toLocaleString()} / ${price.period}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${service.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{service.order}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {services.length === 0 && (
              <div className="text-center py-12 text-gray-400">No services. Run the seed script to add default services.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
