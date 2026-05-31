import type { Metadata } from 'next';
import { SessionProvider } from './SessionProvider';
import AdminShell from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — DevStudio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminShell>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}
