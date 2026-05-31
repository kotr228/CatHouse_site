'use client';

import type { ReactNode } from 'react';

interface SiteSettingsTheme {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBg: string;
  colorBgCard: string;
  colorText: string;
  colorTextMuted: string;
}

interface ThemeProviderProps {
  settings: SiteSettingsTheme;
  children: ReactNode;
}

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      {children}
    </>
  );
}
