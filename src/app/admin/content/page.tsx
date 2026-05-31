'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminTranslationsProvider, useAdminTranslations } from '@/components/admin/AdminTranslations';

const LOCALES = ['uk', 'en', 'pl', 'lt'] as const;
type Locale = typeof LOCALES[number];

interface HeroData {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

interface StatItem {
  id: string;
  value: string;
  labelUk: string;
  labelEn: string;
  labelPl: string;
  labelLt: string;
  order: number;
  isVisible: boolean;
}

interface BlockItem {
  id: string;
  label: string;
  isVisible: boolean;
  order: number;
}

const defaultHero: HeroData = { title: '', subtitle: '', ctaPrimary: '', ctaSecondary: '' };

function ContentPageInner() {
  const { t } = useAdminTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'blocks'>('hero');
  const [heroLocale, setHeroLocale] = useState<Locale>('uk');
  const [heroData, setHeroData] = useState<Record<Locale, HeroData>>({
    uk: { ...defaultHero },
    en: { ...defaultHero },
    pl: { ...defaultHero },
    lt: { ...defaultHero },
  });
  const [stats, setStats] = useState<StatItem[]>([]);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    Promise.all([
      fetch('/api/content/hero').then((r) => r.json()),
      fetch('/api/content/stats').then((r) => r.json()),
      fetch('/api/content/blocks').then((r) => r.json()),
    ]).then(([heroes, statsData, blocksData]) => {
      if (Array.isArray(heroes)) {
        const map: Record<Locale, HeroData> = {
          uk: { ...defaultHero },
          en: { ...defaultHero },
          pl: { ...defaultHero },
          lt: { ...defaultHero },
        };
        for (const h of heroes) {
          if (LOCALES.includes(h.locale)) {
            map[h.locale as Locale] = {
              title: h.title,
              subtitle: h.subtitle,
              ctaPrimary: h.ctaPrimary,
              ctaSecondary: h.ctaSecondary,
            };
          }
        }
        setHeroData(map);
      }
      if (Array.isArray(statsData)) setStats(statsData);
      if (Array.isArray(blocksData)) setBlocks(blocksData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status]);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleHeroSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/content/hero', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData),
      });
      if (res.ok) showSaved();
      else setError('Failed to save hero content.');
    } catch {
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatsSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/content/stats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats),
      });
      if (res.ok) showSaved();
      else setError('Failed to save stats.');
    } catch {
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleBlocksSave = async () => {
    setSaving(true);
    setError('');
    try {
      const visibility = Object.fromEntries(blocks.map((b) => [b.id, b.isVisible]));
      const res = await fetch('/api/content/blocks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visibility),
      });
      if (res.ok) showSaved();
      else setError('Failed to save blocks.');
    } catch {
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const addStat = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: '',
          labelUk: '',
          labelEn: '',
          labelPl: '',
          labelLt: '',
          order: stats.length,
          isVisible: true,
        }),
      });
      if (res.ok) {
        const newStat = await res.json();
        setStats((prev) => [...prev, newStat]);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const deleteStat = async (id: string) => {
    if (!confirm('Delete this stat?')) return;
    try {
      const res = await fetch(`/api/content/stats?id=${id}`, { method: 'DELETE' });
      if (res.ok) setStats((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  };

  const updateStat = (id: string, field: keyof StatItem, value: string | boolean) => {
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateHero = (field: keyof HeroData, value: string) => {
    setHeroData((prev) => ({ ...prev, [heroLocale]: { ...prev[heroLocale], [field]: value } }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors';
  const textareaCls = `${inputCls} resize-none`;
  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`;

  return (
    <div className="min-h-screen flex bg-slate-950">
      <AdminHeader />

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900 border-b border-white/10 px-6 py-4">
          <h1 className="text-xl font-bold text-white">{t('admin.content.title')}</h1>
        </header>

        <div className="p-6 max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button className={tabCls(activeTab === 'hero')} onClick={() => setActiveTab('hero')}>
              {t('admin.content.hero')}
            </button>
            <button className={tabCls(activeTab === 'stats')} onClick={() => setActiveTab('stats')}>
              {t('admin.content.stats')}
            </button>
            <button className={tabCls(activeTab === 'blocks')} onClick={() => setActiveTab('blocks')}>
              {t('admin.content.blocks')}
            </button>
          </div>

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex gap-2 mb-4">
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    onClick={() => setHeroLocale(l)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${heroLocale === l ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">{t('admin.content.heroTitle')}</label>
                <textarea
                  rows={2}
                  value={heroData[heroLocale].title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  className={textareaCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">{t('admin.content.heroSubtitle')}</label>
                <textarea
                  rows={3}
                  value={heroData[heroLocale].subtitle}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  className={textareaCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">{t('admin.content.heroCta1')}</label>
                  <input
                    type="text"
                    value={heroData[heroLocale].ctaPrimary}
                    onChange={(e) => updateHero('ctaPrimary', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">{t('admin.content.heroCta2')}</label>
                  <input
                    type="text"
                    value={heroData[heroLocale].ctaSecondary}
                    onChange={(e) => updateHero('ctaSecondary', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleHeroSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {saving ? '...' : t('admin.content.save')}
                </button>
                {saved && <span className="text-green-400 text-sm">{t('admin.content.saved')}</span>}
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </section>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <section className="space-y-4">
              {stats.map((stat, idx) => (
                <div key={stat.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1">{t('admin.content.statValue')}</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                        className={inputCls}
                        placeholder="120+"
                      />
                    </div>
                    <button
                      onClick={() => updateStat(stat.id, 'isVisible', !stat.isVisible)}
                      className={`p-2 rounded-lg border transition-colors mt-5 ${stat.isVisible ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'border-white/10 text-slate-500 hover:bg-white/5'}`}
                      title={stat.isVisible ? t('admin.content.visible') : t('admin.content.hidden')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {stat.isVisible ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteStat(stat.id)}
                      className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors mt-5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['uk', 'en', 'pl', 'lt'] as const).map((l) => {
                      const field = `label${l.charAt(0).toUpperCase() + l.slice(1)}` as keyof StatItem;
                      return (
                        <div key={l}>
                          <label className="block text-xs text-slate-400 mb-1">{t('admin.content.statLabel')} ({l.toUpperCase()})</label>
                          <input
                            type="text"
                            value={stat[field] as string}
                            onChange={(e) => updateStat(stat.id, field, e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={addStat}
                disabled={saving}
                className="w-full py-3 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-white hover:border-white/30 transition-colors text-sm"
              >
                + {t('admin.content.addStat')}
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleStatsSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {saving ? '...' : t('admin.content.save')}
                </button>
                {saved && <span className="text-green-400 text-sm">{t('admin.content.saved')}</span>}
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </section>
          )}

          {/* Blocks Tab */}
          {activeTab === 'blocks' && (
            <section className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3">
              {blocks.map((block) => (
                <div key={block.id} className="flex items-center justify-between py-2">
                  <span className="text-white text-sm font-medium">{block.label}</span>
                  <button
                    onClick={() => setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, isVisible: !b.isVisible } : b))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${block.isVisible ? 'bg-indigo-600' : 'bg-slate-700'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${block.isVisible ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleBlocksSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {saving ? '...' : t('admin.content.save')}
                </button>
                {saved && <span className="text-green-400 text-sm">{t('admin.content.saved')}</span>}
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <AdminTranslationsProvider>
      <ContentPageInner />
    </AdminTranslationsProvider>
  );
}
