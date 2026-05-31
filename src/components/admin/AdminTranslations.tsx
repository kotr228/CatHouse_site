'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Messages = Record<string, unknown>;

const AdminTranslationsContext = createContext<{
  t: (key: string) => string;
  locale: string;
  changeLocale: (l: string) => void;
}>({
  t: (key) => key,
  locale: 'uk',
  changeLocale: () => {},
});

function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof current === 'string' ? current : key;
}

export function AdminTranslationsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('uk');
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const stored = localStorage.getItem('adminLocale') || 'uk';
    setLocale(stored);
  }, []);

  useEffect(() => {
    import(`../../../messages/${locale}.json`)
      .then((mod) => setMessages(mod.default as Messages))
      .catch(() => setMessages({}));
  }, [locale]);

  const changeLocale = (l: string) => {
    localStorage.setItem('adminLocale', l);
    setLocale(l);
  };

  const t = (key: string): string => {
    return getNestedValue(messages, key);
  };

  return (
    <AdminTranslationsContext.Provider value={{ t, locale, changeLocale }}>
      {children}
    </AdminTranslationsContext.Provider>
  );
}

export function useAdminTranslations() {
  return useContext(AdminTranslationsContext);
}
