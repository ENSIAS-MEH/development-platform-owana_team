import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import { CONFIG } from 'src/config-global';
import { primary } from 'src/shared/theme/core/palette';
import { LocalizationProvider } from 'src/shared/locales';
import { ThemeProvider } from 'src/shared/theme/theme-provider';
import { getInitColorSchemeScript } from 'src/shared/theme/color-scheme-script';

import { ProgressBar } from 'src/shared/components/progress-bar';
import { MotionLazy } from 'src/shared/components/animate/motion-lazy';
import { detectSettings } from 'src/shared/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/shared/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {getInitColorSchemeScript}
        <LocalizationProvider>
        <AuthProvider>
          <SettingsProvider
            settings={settings}
            caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
          >
            <ThemeProvider>
              <MotionLazy>
                <ProgressBar />
                <SettingsDrawer />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
