'use client';

import { type ReactNode } from 'react';
import { AdminTranslationsProvider } from './AdminTranslations';
import AdminHeader from './AdminHeader';

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminTranslationsProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminTranslationsProvider>
  );
}
