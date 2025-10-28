import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { AuroraThemeProvider } from '../components/theme/AuroraThemeProvider.jsx';

const ThemeContext = createContext(undefined);

const LEGACY_THEME = createTheme({});

const getInitialColorScheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('legacy');
  const [colorScheme, setColorScheme] = useState(getInitialColorScheme);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => setColorScheme(event.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
    isAurora: theme === 'aurora',
    isLegacy: theme !== 'aurora'
  }), [theme, colorScheme]);

  const themedChildren = theme === 'aurora'
    ? (
      <AuroraThemeProvider colorScheme={colorScheme}>
        {children}
      </AuroraThemeProvider>
    )
    : (
      <MantineProvider theme={LEGACY_THEME} defaultColorScheme={colorScheme}>
        {children}
      </MantineProvider>
    );

  return (
    <ThemeContext.Provider value={contextValue}>
      {themedChildren}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
