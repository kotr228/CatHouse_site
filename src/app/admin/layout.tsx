import type { Metadata } from 'next';
import { SessionProvider } from './SessionProvider';

export const metadata: Metadata = {
  title: 'Admin — DevStudio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}
