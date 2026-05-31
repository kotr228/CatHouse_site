'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface SiteSettings {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorBgCard: string;
  colorText: string;
  colorTextMuted: string;
  logoText: string;
  logoImageUrl?: string | null;
  siteName: string;
  siteTagline: string;
}

const SiteSettingsContext = createContext<SiteSettings>({
  colorPrimary: '#6366f1',
  colorSecondary: '#8b5cf6',
  colorAccent: '#06b6d4',
  colorBg: '#020617',
  colorBgCard: '#0f172a',
  colorText: '#f8fafc',
  colorTextMuted: '#94a3b8',
  logoText: 'DevStudio',
  logoImageUrl: null,
  siteName: 'DevStudio',
  siteTagline: 'Professional Software Development',
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function ThemeProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  const cssVars = `
    :root {
      --color-primary: ${settings.colorPrimary};
      --color-secondary: ${settings.colorSecondary};
      --color-accent: ${settings.colorAccent};
      --color-bg: ${settings.colorBg};
      --color-bg-card: ${settings.colorBgCard};
      --color-text: ${settings.colorText};
      --color-text-muted: ${settings.colorTextMuted};
    }
    body {
      background-color: ${settings.colorBg};
      color: ${settings.colorText};
    }
  `;

  return (
    <SiteSettingsContext.Provider value={settings}>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {children}
    </SiteSettingsContext.Provider>
  );
}
