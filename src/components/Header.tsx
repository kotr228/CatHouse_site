'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import type { Locale } from '@/i18n';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/pricing`, label: t('pricing') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-card/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}>
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>DevStudio</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-text-base text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher currentLocale={locale} />
            <Link
              href={`/${locale}/contact`}
              className="hidden md:inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {t('contact')}
            </Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden text-text-muted hover:text-text-base"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-text-muted hover:text-text-base text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
