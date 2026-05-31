import type { Metadata } from 'next';
import { SessionProvider } from './SessionProvider';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'Admin — DevStudio',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-navy-950 text-white antialiased min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
