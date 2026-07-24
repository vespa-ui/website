import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'vespa-ui-color-mode';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

function getInitialColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, colorMode);
    document.body.style.colorScheme = colorMode;
  }, [colorMode]);

  const value = useMemo(
    () => ({
      colorMode,
      toggleColorMode: () => setColorMode((mode) => (mode === 'light' ? 'dark' : 'light')),
    }),
    [colorMode]
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within a ColorModeProvider');
  return ctx;
}
