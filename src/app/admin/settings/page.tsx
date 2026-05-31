'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type AnimationVariant = 'none' | 'fade' | 'slide' | 'scale' | 'bounce';

interface SettingsForm {
  logoText: string;
  logoImageUrl: string;
  siteName: string;
  siteTagline: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorBgCard: string;
  colorText: string;
  colorTextMuted: string;
  animationVariant: AnimationVariant;
  contactEmail: string;
  contactEmailVisible: boolean;
  contactTelegram: string;
  contactTelegramVisible: boolean;
  contactViber: string;
  contactViberVisible: boolean;
  contactWhatsapp: string;
  contactWhatsappVisible: boolean;
}

const defaultSettings: SettingsForm = {
  logoText: 'DevStudio',
  logoImageUrl: '',
  siteName: 'DevStudio',
  siteTagline: 'Professional Software Development',
  colorPrimary: '#6366f1',
  colorSecondary: '#8b5cf6',
  colorAccent: '#06b6d4',
  colorBg: '#020617',
  colorBgCard: '#0f172a',
  colorText: '#f8fafc',
  colorTextMuted: '#94a3b8',
  animationVariant: 'fade',
  contactEmail: '',
  contactEmailVisible: true,
  contactTelegram: '',
  contactTelegramVisible: true,
  contactViber: '',
  contactViberVisible: false,
  contactWhatsapp: '',
  contactWhatsappVisible: false,
};

const animationOptions: { value: AnimationVariant; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide Up' },
  { value: 'scale', label: 'Scale In' },
  { value: 'bounce', label: 'Bounce In' },
];

const colorFields: { key: keyof SettingsForm; label: string }[] = [
  { key: 'colorPrimary', label: 'Primary Color' },
  { key: 'colorSecondary', label: 'Secondary Color' },
  { key: 'colorAccent', label: 'Accent Color' },
  { key: 'colorBg', label: 'Background' },
  { key: 'colorBgCard', label: 'Card Background' },
  { key: 'colorText', label: 'Text' },
  { key: 'colorTextMuted', label: 'Muted Text' },
];

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          logoText: data.logoText ?? defaultSettings.logoText,
          logoImageUrl: data.logoImageUrl ?? defaultSettings.logoImageUrl,
          siteName: data.siteName ?? defaultSettings.siteName,
          siteTagline: data.siteTagline ?? defaultSettings.siteTagline,
          colorPrimary: data.colorPrimary ?? defaultSettings.colorPrimary,
          colorSecondary: data.colorSecondary ?? defaultSettings.colorSecondary,
          colorAccent: data.colorAccent ?? defaultSettings.colorAccent,
          colorBg: data.colorBg ?? defaultSettings.colorBg,
          colorBgCard: data.colorBgCard ?? defaultSettings.colorBgCard,
          colorText: data.colorText ?? defaultSettings.colorText,
          colorTextMuted: data.colorTextMuted ?? defaultSettings.colorTextMuted,
          animationVariant: data.animationVariant ?? defaultSettings.animationVariant,
          contactEmail: data.contactEmail ?? defaultSettings.contactEmail,
          contactEmailVisible: data.contactEmailVisible ?? defaultSettings.contactEmailVisible,
          contactTelegram: data.contactTelegram ?? defaultSettings.contactTelegram,
          contactTelegramVisible: data.contactTelegramVisible ?? defaultSettings.contactTelegramVisible,
          contactViber: data.contactViber ?? defaultSettings.contactViber,
          contactViberVisible: data.contactViberVisible ?? defaultSettings.contactViberVisible,
          contactWhatsapp: data.contactWhatsapp ?? defaultSettings.contactWhatsapp,
          contactWhatsappVisible: data.contactWhatsappVisible ?? defaultSettings.contactWhatsappVisible,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  const handleChange = (key: keyof SettingsForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo file must be under 2 MB.');
      return;
    }
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('logoImageUrl', reader.result as string);
      setLogoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Failed to save settings.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const animClass =
    form.animationVariant === 'none'
      ? 'anim-none'
      : form.animationVariant === 'fade'
      ? 'anim-fade'
      : form.animationVariant === 'slide'
      ? 'anim-slide'
      : form.animationVariant === 'scale'
      ? 'anim-scale'
      : 'anim-bounce';

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-slate-900 border-b border-white/10 px-6 py-4">
        <h1 className="text-xl font-bold text-white">Site Settings</h1>
      </header>

        <div className="p-6 max-w-3xl space-y-8">
          {/* Brand & Logo */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Brand &amp; Logo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Logo Image</label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.logoImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.logoImageUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-slate-500 text-xs text-center px-1">No logo</span>
                    )}
                  </div>
                  {/* Controls */}
                  <div className="flex flex-col gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    <button
                      type="button"
                      disabled={logoUploading}
                      onClick={() => logoInputRef.current?.click()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {logoUploading ? 'Uploading...' : form.logoImageUrl ? 'Change Logo' : 'Upload Logo'}
                    </button>
                    {form.logoImageUrl && (
                      <button
                        type="button"
                        onClick={() => { handleChange('logoImageUrl', ''); if (logoInputRef.current) logoInputRef.current.value = ''; }}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">PNG, SVG, WebP · max 2 MB. If not set, a colored icon with the first letter of Logo Text is used.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Logo Text</label>
                <input
                  type="text"
                  value={form.logoText}
                  onChange={(e) => handleChange('logoText', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Site Name</label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Site Tagline</label>
                <input
                  type="text"
                  value={form.siteTagline}
                  onChange={(e) => handleChange('siteTagline', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Color Palette</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorFields.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form[key] as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{label}</div>
                    <div className="text-xs text-slate-400 font-mono">{form[key] as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Animation */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Animation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {animationOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                      form.animationVariant === opt.value
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="animationVariant"
                      value={opt.value}
                      checked={form.animationVariant === opt.value}
                      onChange={() => handleChange('animationVariant', opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {/* Live preview */}
              <div className="mt-4">
                <div className="text-sm text-slate-400 mb-2">Preview:</div>
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={`${form.animationVariant}-${i}`}
                      className={`w-12 h-12 rounded-lg ${animClass}`}
                      style={{
                        backgroundColor: form.colorPrimary,
                        animationDelay: `${(i - 1) * 150}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contacts */}
          <section className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Contact Info</h2>
            <div className="space-y-4">
              {([
                { key: 'contactEmail', visKey: 'contactEmailVisible', label: 'Email', placeholder: 'hello@example.com', type: 'email' },
                { key: 'contactTelegram', visKey: 'contactTelegramVisible', label: 'Telegram', placeholder: '@username or https://t.me/username', type: 'text' },
                { key: 'contactViber', visKey: 'contactViberVisible', label: 'Viber', placeholder: '+380XXXXXXXXX', type: 'text' },
                { key: 'contactWhatsapp', visKey: 'contactWhatsappVisible', label: 'WhatsApp', placeholder: '+380XXXXXXXXX', type: 'text' },
              ] as const).map(({ key, visKey, label, placeholder, type }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[key]}
                      placeholder={placeholder}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                  <div className="flex-shrink-0 mt-5">
                    <button
                      type="button"
                      onClick={() => handleChange(visKey, !form[visKey])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form[visKey] ? 'bg-indigo-600' : 'bg-white/10'}`}
                      title={form[visKey] ? 'Visible' : 'Hidden'}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form[visKey] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && <span className="text-green-400 text-sm">Settings saved successfully!</span>}
            {error && <span className="text-red-400 text-sm">{error}</span>}
          </div>
        </div>
      </div>
  );
}
