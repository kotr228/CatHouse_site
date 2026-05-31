'use client';
import { useState, useEffect } from 'react';

export function useAdminLocale() {
  const [locale, setLocale] = useState('uk');

  useEffect(() => {
    const stored = localStorage.getItem('adminLocale') || 'uk';
    setLocale(stored);
  }, []);

  const changeLocale = (l: string) => {
    localStorage.setItem('adminLocale', l);
    setLocale(l);
  };

  return { locale, changeLocale };
}
