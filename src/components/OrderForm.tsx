'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';

interface OrderFormProps {
  locale: Locale;
}

export default function OrderForm({ locale }: OrderFormProps) {
  const t = useTranslations('contact');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', description: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-green-400 font-medium">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1.5">
            {t('name')} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-base placeholder-text-muted focus:outline-none focus:ring-1 transition-colors"
            style={{ ['--tw-ring-color' as string]: 'var(--color-primary)' } as React.CSSProperties}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1.5">
            {t('email')} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-base placeholder-text-muted focus:outline-none transition-colors"
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-text-muted mb-1.5">
          {t('phone')}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-base placeholder-text-muted focus:outline-none transition-colors"
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-muted mb-1.5">
          {t('description')} *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-base placeholder-text-muted focus:outline-none transition-colors resize-none"
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          placeholder={t('descriptionPlaceholder')}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
