'use client';

import { useState } from 'react';

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
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-slate-900 border-b border-white/10 px-6 py-4">
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

      {/* Order detail modal */}
      {selected != null && (() => {
        const s = selected;
        return (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-navy-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-white">{s.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Email:</span> <span className="text-white ml-2">{s.email}</span></div>
              {s.phone && <div><span className="text-gray-400">Phone:</span> <span className="text-white ml-2">{s.phone}</span></div>}
              <div><span className="text-gray-400">Locale:</span> <span className="text-white ml-2 uppercase">{s.locale}</span></div>
              <div><span className="text-gray-400">Status:</span>
                <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[s.status]}`}>
                  {statusLabels[s.status]}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Description:</span>
                <p className="text-white bg-white/5 rounded-lg p-3 leading-relaxed">{s.description}</p>
              </div>
              <div><span className="text-gray-400">Date:</span> <span className="text-white ml-2">{new Date(s.createdAt).toLocaleString()}</span></div>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Update Status</label>
              <select
                value={s.status}
                disabled={updating === s.id}
                onChange={(e) => updateStatus(s.id, e.target.value as OrderStatus)}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-3 py-2 focus:outline-none focus:border-brand-500 disabled:opacity-50"
              >
                {(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((st) => (
                  <option key={st} value={st} className="bg-navy-900">
                    {statusLabels[st]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
