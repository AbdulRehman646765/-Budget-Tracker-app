import { useState, useEffect } from 'react';
import { AppTheme } from '@/types/budget';
import { THEMES } from '@/constants/themes';

const THEME_STORAGE_KEY = 'monthly_budget_app_theme';

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme;
    if (saved && THEMES[saved]) {
      setTheme(saved);
    }
  }, []);

  const changeTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      if (newTheme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      const activeDef = THEMES[theme];
      if (activeDef) {
        document.documentElement.style.setProperty('--primary-color', activeDef.primaryColor);
        document.documentElement.style.setProperty('--accent-color', activeDef.accentColor);
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    changeTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, changeTheme, toggleTheme, activeTheme: THEMES[theme] || THEMES.dark };
}
