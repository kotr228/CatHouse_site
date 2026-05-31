'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  uk: 'UK',
  pl: 'PL',
  lt: 'LT',
};

interface LocaleSwitcherProps {
  currentLocale: Locale;
}

export default function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale: Locale) => {
    // Replace current locale prefix with new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          className="px-2 py-1 text-xs font-medium rounded transition-colors"
          style={
            locale === currentLocale
              ? { backgroundColor: 'var(--color-primary)', color: 'white' }
              : { color: 'var(--color-text-muted)' }
          }
          onMouseEnter={(e) => {
            if (locale !== currentLocale) {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (locale !== currentLocale) {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }
          }}
          aria-label={`Switch to ${locale.toUpperCase()}`}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
