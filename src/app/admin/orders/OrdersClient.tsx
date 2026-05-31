'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface Order {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  description: string;
  status: OrderStatus;
  locale: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
}

interface AdminOrdersClientProps {
  orders: Order[];
  stats: Stats;
}

const statusColors: Record<OrderStatus, string> = {
  NEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  IN_PROGRESS: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  COMPLETED: 'bg-green-500/20 text-green-300 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const statusLabels: Record<OrderStatus, string> = {
  NEW: 'New',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function AdminOrdersClient({ orders: initialOrders, stats }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
        if (selected?.id === id) {
          setSelected((prev) => prev ? { ...prev, status } : null);
        }
      }
    } finally {
      setUpdating(null);
    }
  };

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
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-600/20 text-brand-300 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Services
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-navy-900 border-b border-white/10 px-6 py-4">
          <h1 className="text-xl font-bold text-white">Orders</h1>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'text-white' },
              { label: 'New', value: stats.new, color: 'text-blue-400' },
              { label: 'In Progress', value: stats.inProgress, color: 'text-yellow-400' },
              { label: 'Completed', value: stats.completed, color: 'text-green-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gradient-card border border-white/10 rounded-xl p-4">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-gradient-card border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Locale</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer"
                    onClick={() => setSelected(order)}
                  >
                    <td className="px-4 py-3 text-white text-sm font-medium">{order.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{order.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs uppercase">{order.locale}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1 focus:outline-none focus:border-brand-500 disabled:opacity-50"
                      >
                        {(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((s) => (
                          <option key={s} value={s} className="bg-navy-900">
                            {statusLabels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-12 text-gray-400">No orders yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-navy-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{selected.email}</span></div>
              {selected.phone && <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-2">{selected.phone}</span></div>}
              <div><span className="text-gray-400">Locale:</span> <span className="text-white ml-2 uppercase">{selected.locale}</span></div>
              <div><span className="text-gray-400">Status:</span>
                <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[selected.status]}`}>
                  {statusLabels[selected.status]}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Description:</span>
                <p className="text-white bg-white/5 rounded-lg p-3 leading-relaxed">{selected.description}</p>
              </div>
              <div><span className="text-gray-400">Date:</span> <span className="text-white ml-2">{new Date(selected.createdAt).toLocaleString()}</span></div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Update Status</label>
              <select
                value={selected.status}
                disabled={updating === selected.id}
                onChange={(e) => updateStatus(selected.id, e.target.value as OrderStatus)}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2 focus:outline-none focus:border-brand-500 disabled:opacity-50"
              >
                {(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((s) => (
                  <option key={s} value={s} className="bg-navy-900">
                    {statusLabels[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
