import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import prisma from '@/lib/prisma';

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' });

const defaultSettings = {
  colorPrimary: '#6366f1',
  colorSecondary: '#8b5cf6',
  colorAccent: '#06b6d4',
  colorBg: '#020617',
  colorBgCard: '#0f172a',
  colorText: '#f8fafc',
  colorTextMuted: '#94a3b8',
  logoText: 'DevStudio',
  siteName: 'DevStudio',
  siteTagline: 'Professional Software Development',
};

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' },
    });
    return {
      colorPrimary: settings.colorPrimary,
      colorSecondary: settings.colorSecondary,
      colorAccent: settings.colorAccent,
      colorBg: settings.colorBg,
      colorBgCard: settings.colorBgCard,
      colorText: settings.colorText,
      colorTextMuted: settings.colorTextMuted,
      logoText: settings.logoText,
      logoImageUrl: settings.logoImageUrl,
      siteName: settings.siteName,
      siteTagline: settings.siteTagline,
      contactEmail: settings.contactEmail,
      contactEmailVisible: settings.contactEmailVisible,
      contactTelegram: settings.contactTelegram,
      contactTelegramVisible: settings.contactTelegramVisible,
      contactViber: settings.contactViber,
      contactViberVisible: settings.contactViberVisible,
      contactWhatsapp: settings.contactWhatsapp,
      contactWhatsappVisible: settings.contactWhatsappVisible,
    };
  } catch {
    return defaultSettings;
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <html className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider settings={settings}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
