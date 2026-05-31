'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Locale = 'uk' | 'en' | 'pl' | 'lt';

const LOCALES: Locale[] = ['uk', 'en', 'pl', 'lt'];

interface ServiceTranslation {
  id?: string;
  locale: Locale;
  title: string;
  description: string;
  features: string[];
}

interface Price {
  id?: string;
  amount: string;
  currency: string;
  period: string;
  isActive?: boolean;
}

interface Service {
  id: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  translations: ServiceTranslation[];
  prices: Price[];
}

const emptyTranslations = (): ServiceTranslation[] =>
  LOCALES.map((locale) => ({ locale, title: '', description: '', features: [] }));

const emptyService = (): Omit<Service, 'id'> => ({
  slug: '',
  icon: '',
  order: 0,
  isActive: true,
  translations: emptyTranslations(),
  prices: [{ amount: '0', currency: 'USD', period: 'month' }],
});

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyService());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchServices();
  }, [status]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyService());
    setShowForm(true);
    setActiveLocale('en');
    setError('');
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);

    // Merge existing translations with empty ones for all locales
    const merged = LOCALES.map((locale) => {
      const existing = service.translations.find((t) => t.locale === locale);
      return existing
        ? { ...existing, features: existing.features || [] }
        : { locale, title: '', description: '', features: [] };
    });

    const price = service.prices.find((p) => p.isActive) || service.prices[0];

    setForm({
      slug: service.slug,
      icon: service.icon || '',
      order: service.order,
      isActive: service.isActive,
      translations: merged,
      prices: price
        ? [{ id: price.id, amount: String(price.amount), currency: price.currency, period: price.period || '' }]
        : [{ amount: '0', currency: 'USD', period: 'month' }],
    });
    setShowForm(true);
    setActiveLocale('en');
    setError('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleTranslationChange = (locale: Locale, field: 'title' | 'description', value: string) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.locale === locale ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleFeaturesChange = (locale: Locale, value: string) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.map((t) =>
        t.locale === locale
          ? { ...t, features: value.split('\n').filter((f) => f.trim()) }
          : t
      ),
    }));
  };

  const handlePriceChange = (field: 'amount' | 'currency' | 'period', value: string) => {
    setForm((prev) => ({
      ...prev,
      prices: [{ ...prev.prices[0], [field]: value }],
    }));
  };

  const handleSave = async () => {
    if (!form.slug.trim()) {
      setError('Slug is required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      slug: form.slug,
      icon: form.icon,
      order: form.order,
      isActive: form.isActive,
      translations: form.translations,
      price: form.prices[0]
        ? {
            amount: parseFloat(form.prices[0].amount) || 0,
            currency: form.prices[0].currency || 'USD',
            period: form.prices[0].period || null,
          }
        : null,
    };

    try {
      let res: Response;
      if (editingId) {
        res = await fetch(`/api/services/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchServices();
        setShowForm(false);
        setEditingId(null);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save service.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const currentTranslation = form.translations.find((t) => t.locale === activeLocale) || {
    locale: activeLocale,
    title: '',
    description: '',
    features: [],
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-white font-bold">DevStudio</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Orders
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Services
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Services</h1>
          {!showForm && (
            <button
              onClick={startCreate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              + Add Service
            </button>
          )}
        </header>

        <div className="p-6 space-y-6">
          {/* Inline Form */}
          {showForm && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? 'Edit Service' : 'New Service'}
              </h2>

              {/* Base fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                    placeholder="web-development"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Icon (emoji)</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="🌐"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-indigo-500"
                    />
                    <span className="text-sm text-slate-300">Active</span>
                  </label>
                </div>
              </div>

              {/* Price fields */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Pricing</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.prices[0]?.amount || '0'}
                      onChange={(e) => handlePriceChange('amount', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Currency</label>
                    <select
                      value={form.prices[0]?.currency || 'USD'}
                      onChange={(e) => handlePriceChange('currency', e.target.value)}
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="UAH">UAH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Period</label>
                    <input
                      type="text"
                      value={form.prices[0]?.period || ''}
                      onChange={(e) => handlePriceChange('period', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="month"
                    />
                  </div>
                </div>
              </div>

              {/* Translations */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Translations</h3>
                <div className="flex gap-2 mb-4">
                  {LOCALES.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => setActiveLocale(locale)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors uppercase ${
                        activeLocale === locale
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {locale}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={currentTranslation.title}
                      onChange={(e) => handleTranslationChange(activeLocale, 'title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Service title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={currentTranslation.description}
                      onChange={(e) => handleTranslationChange(activeLocale, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Service description"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Features (one per line)
                    </label>
                    <textarea
                      rows={5}
                      value={currentTranslation.features.join('\n')}
                      onChange={(e) => handleFeaturesChange(activeLocale, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  onClick={cancelForm}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-medium rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Services Table */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No services yet. Click &quot;Add Service&quot; to create one.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Icon</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Title (EN)</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Slug</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const enTranslation = service.translations.find((t) => t.locale === 'en');
                    const price = service.prices.find((p) => p.isActive) || service.prices[0];
                    return (
                      <tr key={service.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-2xl">{service.icon || '⚡'}</td>
                        <td className="px-4 py-3 text-white text-sm font-medium">
                          {enTranslation?.title || service.slug}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-mono">{service.slug}</td>
                        <td className="px-4 py-3 text-indigo-400 text-sm">
                          {price
                            ? `${price.currency === 'USD' ? '$' : price.currency}${Number(price.amount).toLocaleString()}${price.period ? ` / ${price.period}` : ''}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full border ${
                              service.isActive
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-sm">{service.order}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(service)}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              disabled={deletingId === service.id}
                              className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deletingId === service.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
